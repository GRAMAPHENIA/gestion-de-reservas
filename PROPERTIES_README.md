Properties / Dashboard - Instrucciones
===================================

1) Crear la tabla `properties`

  - Ejecuta `create_properties_table.sql` en la consola SQL de Supabase o en psql contra tu BD.

2) Políticas (RLS)

  - Si quieres proteger accesos desde el cliente, aplica `policies_properties_rls.sql`.
  - Nota: las políticas usan `auth.uid()` de Supabase. Si usas Clerk para autenticar en el frontend, debes asegurarte que el `owner_id` que guardas en la tabla coincida con el uid que espera Supabase (habitualmente el uid generado por Supabase Auth). En este repo, los inserts se hacen desde el servidor (service role key), por lo tanto el server puede establecer `owner_id` con el uid que tengas disponible (de Clerk). RLS protege requests directos desde clientes que no pasen por el servidor.

3) Storage para imágenes

  - El formulario actual acepta URLs. Si quieres permitir subidas desde el cliente, crea un bucket (p. ej. `property-images`) en Supabase Storage y sigue uno de estos enfoques:
    - Subida directa desde el cliente con una URL firmada generada por el servidor.
    - Subida desde el servidor usando la service role key.

4) Endpoints añadidos

  - POST /api/dashboard/properties  => crea una propiedad
  - GET  /api/dashboard/properties?owner_id=<id> => lista propiedades (filtra por owner_id si se pasa)
  - DELETE /api/dashboard/properties/:id => elimina propiedad por id

5) Siguientes mejoras sugeridas

  - Añadir edición (PUT/PATCH) de propiedades.
  - Mejorar UX al crear/editar (mensajes inline, preview de imágenes).
  - Configurar RLS con roles más finos si necesitas que administradores puedan gestionar todas las propiedades.
