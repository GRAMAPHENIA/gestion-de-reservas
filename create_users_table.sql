-- Crear la tabla 'users' en Supabase
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver su propio registro
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Política para que los usuarios puedan insertar su propio registro (durante registro)
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para que los usuarios puedan actualizar su propio registro
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);