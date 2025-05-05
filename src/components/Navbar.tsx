// components/Navbar.tsx
import MobileMenuButton from "./MobileMenuButton";

export default function Navbar({ onOpen }: { onOpen: () => void }) {
  return (
    <nav className="fixed w-full z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">Hoteles</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <a href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Inicio
              </a>
              <a href="/hoteles" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Hoteles
              </a>
              <a href="/reservas" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Reservas
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="/inicio-de-sesion" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Iniciar sesión
            </a>
            <a href="/registro" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Crear cuenta
            </a>
          </div>
          <div className="md:hidden">
            <MobileMenuButton onClick={onOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
}
