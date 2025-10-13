import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { bookingSchema } from "@/schemas/bookingSchema";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar los datos
    const validatedData = bookingSchema.parse(body);

    // Verificar que la propiedad existe y está disponible
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, max_guests, price")
      .eq("id", validatedData.property_id)
      .eq("status", "published")
      .single();

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found or not available" }, { status: 404 });
    }

    // Verificar que el número de huéspedes no exceda el máximo
    if (validatedData.guests > property.max_guests) {
      return NextResponse.json({ 
        error: `Maximum ${property.max_guests} guests allowed for this property` 
      }, { status: 400 });
    }

    // Verificar disponibilidad (no hay reservas confirmadas en las mismas fechas)
    const { data: existingBookings, error: bookingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("property_id", validatedData.property_id)
      .in("status", ["confirmed", "pending"])
      .or(`and(check_in.lte.${validatedData.check_out},check_out.gte.${validatedData.check_in})`);

    if (bookingError) {
      console.error("Error checking availability:", bookingError);
      return NextResponse.json({ error: "Error checking availability" }, { status: 500 });
    }

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json({ 
        error: "Property is not available for the selected dates" 
      }, { status: 400 });
    }

    // Crear la reserva
    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert([validatedData])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating booking:", insertError);
      return NextResponse.json({ error: "Error creating booking" }, { status: 500 });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/bookings:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}