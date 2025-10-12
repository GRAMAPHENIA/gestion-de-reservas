# 🔧 Instrucciones para Agregar Columna Status

## ❗ Problema Resuelto
La aplicación ahora funciona correctamente, pero necesitas agregar la columna `status` para tener funcionalidad completa de publicación/borrador.

## 📋 Pasos para completar la migración:

### 1. Ve al Dashboard de Supabase
- Abre https://supabase.com/dashboard
- Selecciona tu proyecto
- Ve a "SQL Editor" en el menú lateral

### 2. Ejecuta el SQL
Copia y pega este código en el SQL Editor:

```sql
-- Agregar columna status a la tabla properties
ALTER TABLE properties 
ADD COLUMN status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published'));

-- Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
```

### 3. Ejecuta la query
- Haz clic en "Run" o presiona Ctrl+Enter
- Deberías ver un mensaje de éxito

### 4. Verifica que funcionó
Ejecuta esta query para verificar:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'properties' AND column_name = 'status';
```

## ✅ Estado Actual
- ✅ La aplicación carga correctamente
- ✅ Las propiedades se muestran en la página principal
- ✅ El código está listo para usar la columna `status`
- ⏳ Solo falta ejecutar el SQL para agregar la columna

## 🎯 Después de la migración
Una vez que ejecutes el SQL, tendrás:
- Sistema completo de borradores/publicados
- Filtrado automático de propiedades publicadas en la página principal
- Funcionalidad completa del dashboard de propiedades