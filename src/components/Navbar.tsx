// components/Navbar.tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import MobileMenuButton from "./MobileMenuButton";

export default function Navbar({ onOpen }: { onOpen: () => void }) {
  return (
    <nav className="fixed w-full z-40 bg-stone-100/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-stone-800">Hoteles</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <a href="/" className="text-stone-600 hover:text-stone-800 px-3 py-2 rounded-md text-sm font-medium">
                Inicio
              </a>
              <a href="/hoteles" className="text-stone-600 hover:text-stone-800 px-3 py-2 rounded-md text-sm font-medium">
                Hoteles
              </a>
              <a href="/reservas" className="text-stone-600 hover:text-stone-800 px-3 py-2 rounded-md text-sm font-medium">
                Reservas
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-stone-600 hover:text-stone-800 px-3 py-2 rounded-md text-sm font-medium">
                  Iniciar sesión
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="text-stone-600 hover:text-stone-800 px-3 py-2 rounded-md text-sm font-medium">
                  Crear cuenta
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <div className="md:hidden">
            <MobileMenuButton onClick={onOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
}
