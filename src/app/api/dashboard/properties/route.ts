import { NextResponse } from "next/server";
import { createServerClient } from '@/utils/supabase/server';
import { propertySchema } from '@/schemas/propertySchema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('API recibió body:', body);

    const parse = propertySchema.safeParse(body);
    if (!parse.success) {
      console.log('Error de validación:', parse.error.flatten());
      return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
    }
    
    console.log('Datos validados correctamente:', parse.data);

    const supabase = createServerClient();
    console.log('Intentando insertar en Supabase...');
    
    const { data, error } = await supabase
      .from('properties')
      .insert({
        title: parse.data.title,
        description: parse.data.description,
        price: parse.data.price,
        location: parse.data.location,
        images: parse.data.images,
        owner_id: parse.data.owner_id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.log('Error de Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('Propiedad creada exitosamente:', data);

    return NextResponse.json({ success: true, property: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Error interno' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ownerId = url.searchParams.get('owner_id');

    const supabase = createServerClient();

    let query = supabase.from('properties').select('*');
    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, properties: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Error interno' }, { status: 500 });
  }
}
