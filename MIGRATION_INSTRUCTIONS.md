# Instrucciones para Agregar Columna Status

## Problema
La aplicación está intentando usar una columna `status` que no existe en la tabla `properties`.

## Solución
Ejecutar el siguiente SQL en el dashboard de Supabase (SQL Editor):

```sql
-- 1. Agregar columna status a la tabla properties
ALTER TABLE properties 
ADD COLUMN status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published'));

-- 2. Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
```

## Pasos:
1. Ve al dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "SQL Editor" en el menú lateral
4. Crea una nueva query
5. Pega el SQL de arriba
6. Ejecuta la query

## Verificación
Después de ejecutar el SQL, puedes verificar que funcionó ejecutando:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'properties' AND column_name = 'status';
```

## Después de la migración
Una vez que hayas ejecutado el SQL, descomenta las líneas en el código que usan la columna `status`.