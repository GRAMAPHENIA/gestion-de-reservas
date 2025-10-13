import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      return NextResponse.json({ error: "Error fetching properties" }, { status: 500 });
    }

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error in GET /api/properties:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}