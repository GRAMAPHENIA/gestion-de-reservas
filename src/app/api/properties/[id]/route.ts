import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: property, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", params.id)
      .eq("status", "published")
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error in GET /api/properties/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}