import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log("API: Starting to fetch properties");
    console.log("API: Supabase URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("API: Service role key exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("API: Missing environment variables");
      return NextResponse.json({ 
        error: "Server configuration error",
        details: "Missing environment variables"
      }, { status: 500 });
    }

    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    console.log("API: Supabase response - error:", error);
    console.log("API: Supabase response - data count:", properties?.length || 0);

    if (error) {
      console.error("API: Supabase error:", error);
      return NextResponse.json({ 
        error: "Error fetching properties",
        details: error.message
      }, { status: 500 });
    }

    console.log("API: Returning properties:", properties?.length || 0);
    return NextResponse.json(properties || []);
  } catch (error) {
    console.error("API: Unexpected error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}