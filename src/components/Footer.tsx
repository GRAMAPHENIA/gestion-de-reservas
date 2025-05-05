"use client";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Reservas</h3>
            <p className="text-gray-400">
              Reserva tu alojamiento favorito con facilidad y seguridad.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/hoteles" className="text-gray-400 hover:text-white">
                  Hoteles
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-gray-400 hover:text-white">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Email: info@reservas.com</li>
              <li className="text-gray-400">Teléfono: (506) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Reservas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
