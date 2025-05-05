// components/Sidebar.tsx
import { BsHouseDoor, BsBuilding, BsCalendar2Check, BsX } from "react-icons/bs";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Sidebar Mobile (drawer) */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-zinc-800/30 backdrop-blur-md border-r border-zinc-700/50 shadow-lg p-4">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto py-4 px-2">
                <nav className="mt-4 space-y-1">
                  <a
                    href="/"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-emerald-600"
                  >
                    <BsHouseDoor className="mr-3 h-6 w-6 text-emerald-400" />
                    Inicio
                  </a>
                  <a
                    href="/hoteles"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-emerald-600 hover:text-white"
                  >
                    <BsBuilding className="mr-3 h-6 w-6 text-gray-400 group-hover:text-white" />
                    Hoteles
                  </a>
                  <a
                    href="/reservas"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-emerald-600 hover:text-white"
                  >
                    <BsCalendar2Check className="mr-3 h-6 w-6 text-gray-400 group-hover:text-white" />
                    Reservas
                  </a>
                </nav>
              </div>
              <div className="flex-shrink-0 p-4 border-t border-zinc-700/50">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <BsX className="mr-2 h-4 w-4" />
                  Cerrar
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
