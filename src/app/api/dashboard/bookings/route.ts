import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const ownerId = url.searchParams.get('owner_id');

    if (!ownerId) {
      return NextResponse.json({ error: "Owner ID required" }, { status: 400 });
    }

    // Obtener reservas de propiedades del propietario
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        *,
        property:properties!inner(
          id,
          title,
          location,
          owner_id
        )
      `)
      .eq("property.owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json({ error: "Error fetching bookings" }, { status: 500 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error in GET /api/dashboard/bookings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}