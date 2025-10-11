import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest, context: unknown) {
  try {
  const id = ((context as unknown) as { params?: { id?: string } })?.params?.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const supabase = createServerClient();
    const { data, error } = await supabase.from('properties').delete().eq('id', id).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, property: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Error interno' }, { status: 500 });
  }
}
