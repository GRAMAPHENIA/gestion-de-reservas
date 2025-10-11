-- migrate_ownerid_to_text.sql
-- Si la columna owner_id existe como uuid, convertirla a text safely.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'owner_id' AND data_type = 'uuid'
  ) THEN
    -- Crear columna temporal
    ALTER TABLE public.properties ADD COLUMN owner_id_text text;
    -- Copiar valores
    UPDATE public.properties SET owner_id_text = owner_id::text;
    -- Eliminar columna antigua y renombrar
    ALTER TABLE public.properties DROP COLUMN owner_id;
    ALTER TABLE public.properties RENAME COLUMN owner_id_text TO owner_id;
  END IF;
END$$;
