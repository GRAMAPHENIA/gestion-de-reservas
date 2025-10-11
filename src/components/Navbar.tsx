// components/Navbar.tsx
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="site-container flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-semibold text-gray-900">Reservas</Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Inicio</Link>
            <Link href="/hoteles" className="text-sm text-gray-600 hover:text-gray-900">Hoteles</Link>
            <Link href="/reservas" className="text-sm text-gray-600 hover:text-gray-900">Reservas</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <Link href="/inicio-de-sesion" className="text-sm text-gray-600 hover:text-gray-900">Iniciar sesión</Link>
            <Link href="/registro" className="btn-primary hidden md:inline-block">Crear cuenta</Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* Mobile menu button */}
          <button
            aria-expanded={open}
            aria-label="Abrir menú"
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            <span className="sr-only">Abrir menú</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
          <div className={`${open ? 'block' : 'hidden'} md:hidden bg-white/95 border-t border-gray-100` }>
        <div className="px-4 pt-4 pb-4 space-y-3">
          <Link href="/" className="block text-gray-700 py-2">Inicio</Link>
          <Link href="/hoteles" className="block text-gray-700 py-2">Hoteles</Link>
          <Link href="/reservas" className="block text-gray-700 py-2">Reservas</Link>
          <SignedOut>
            <Link href="/inicio-de-sesion" className="block text-gray-700 py-2">Iniciar sesión</Link>
            <Link href="/registro" className="block text-gray-700 py-2">Crear cuenta</Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
