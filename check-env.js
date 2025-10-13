// Script para verificar variables de entorno
console.log('🔍 Verificando variables de entorno...\n');

const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let allPresent = true;

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${envVar}: NO CONFIGURADA`);
    allPresent = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allPresent) {
  console.log('✅ Todas las variables de entorno están configuradas');
} else {
  console.log('❌ Faltan variables de entorno');
  console.log('📋 Configúralas en Vercel Dashboard → Settings → Environment Variables');
}
console.log('='.repeat(50));