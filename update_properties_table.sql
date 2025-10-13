-- Agregar nuevas columnas a la tabla properties
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS max_guests INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS property_type TEXT DEFAULT 'house',
ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}';

-- Agregar restricciones
ALTER TABLE properties 
ADD CONSTRAINT check_max_guests CHECK (max_guests > 0 AND max_guests <= 20),
ADD CONSTRAINT check_bedrooms CHECK (bedrooms > 0),
ADD CONSTRAINT check_bathrooms CHECK (bathrooms > 0),
ADD CONSTRAINT check_property_type CHECK (property_type IN ('house', 'apartment', 'cabin', 'villa', 'other'));