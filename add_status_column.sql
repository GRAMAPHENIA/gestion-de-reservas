-- Agregar columna status a la tabla properties
ALTER TABLE properties 
ADD COLUMN status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published'));

-- Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);