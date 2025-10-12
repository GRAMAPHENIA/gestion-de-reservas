import { NextResponse } from "next/server";
import { createServerClient } from '@/utils/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['draft', 'published'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido. Debe ser "draft" o "published"' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.log('Error de Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, property: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.log('Error de Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Error interno' }, { status: 500 });
  }
}