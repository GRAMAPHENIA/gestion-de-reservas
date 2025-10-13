# 🚀 Configuración de Variables de Entorno en Vercel

## ❗ Error Actual
`MIDDLEWARE_INVOCATION_FAILED` - Indica que el middleware de Clerk no puede ejecutarse correctamente.

## 🔧 Solución: Configurar Variables de Entorno

### 1. Ve a tu proyecto en Vercel
- Abre https://vercel.com/dashboard
- Selecciona tu proyecto
- Ve a **Settings** → **Environment Variables**

### 2. Agrega estas variables de entorno:

#### Variables de Clerk (OBLIGATORIAS):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cGVhY2VmdWwtbW9uYXJjaC01My5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_2vDhfzIwi2An5MYXzm8lW13iOx7FFR6hlTW80Lfrmq
```

#### Variables de Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://szqkglngoykkqivlzhrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWtnbG5nb3lra3Fpdmx6aHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE1MDcsImV4cCI6MjA3NTY2NzUwN30.z0uv-UeyJE8jNkbO5BPDRsnaO_DLkV87mJ3bmRSsZB4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWtnbG5nb3lra3Fpdmx6aHJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA5MTUwNywiZXhwIjoyMDc1NjY3NTA3fQ.zRH3GIglZ0rbVmd7ZNWmCdbO50PYS3tDKQ0nRIe0yc4
```

### 3. Configuración importante:
- ✅ Asegúrate de que todas las variables estén en **Production**, **Preview** y **Development**
- ✅ No incluyas espacios antes o después de los valores
- ✅ Guarda cada variable individualmente

### 4. Redeploy
Después de agregar las variables:
- Ve a **Deployments**
- Haz clic en los 3 puntos del último deployment
- Selecciona **Redeploy**

## 🔍 Verificación
Una vez redeployado, la aplicación debería funcionar correctamente sin el error de middleware.

## 🆘 Si el problema persiste:
1. Verifica que las URLs de Clerk estén configuradas correctamente
2. Asegúrate de que el dominio de Vercel esté agregado en Clerk Dashboard
3. Revisa los logs de Vercel para más detalles del error