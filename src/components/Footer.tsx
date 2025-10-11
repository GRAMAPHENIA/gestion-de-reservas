"use client";

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Reservas</h3>
            <p>
              Reserva tu alojamiento favorito con facilidad y seguridad.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">Inicio</a>
              </li>
              <li>
                <a href="/hoteles" className="text-gray-300 hover:text-white">Hoteles</a>
              </li>
              <li>
                <a href="/contacto" className="text-gray-300 hover:text-white">Contacto</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@reservas.com</li>
              <li>Teléfono: (506) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Reservas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
