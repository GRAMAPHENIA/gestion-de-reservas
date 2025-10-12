// Script para agregar la columna status a la tabla properties
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://szqkglngoykkqivlzhrv.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWtnbG5nb3lra3Fpdmx6aHJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA5MTUwNywiZXhwIjoyMDc1NjY3NTA3fQ.zRH3GIglZ0rbVmd7ZNWmCdbO50PYS3tDKQ0nRIe0yc4';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  try {
    console.log('Ejecutando migración para agregar columna status...');
    
    // Leer el archivo SQL
    const sql = fs.readFileSync('add_status_column.sql', 'utf8');
    
    // Ejecutar cada comando SQL por separado
    const commands = sql.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        console.log('Ejecutando:', command.trim().substring(0, 50) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql: command.trim() });
        
        if (error) {
          console.error('Error ejecutando comando:', error);
        } else {
          console.log('✓ Comando ejecutado exitosamente');
        }
      }
    }
    
    console.log('Migración completada');
    
    // Verificar que la columna se agregó correctamente
    const { data, error } = await supabase
      .from('properties')
      .select('id, status')
      .limit(1);
    
    if (error) {
      console.error('Error verificando migración:', error);
    } else {
      console.log('✓ Verificación exitosa. Columna status agregada correctamente');
      console.log('Ejemplo de datos:', data);
    }
    
  } catch (err) {
    console.error('Error en migración:', err);
  }
}

runMigration();