// components/MobileMenuButton.tsx
import { BsList } from "react-icons/bs";

export default function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="md:hidden fixed top-4 right-4 z-50 border border-zinc-800 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer p-2 rounded-full shadow"
      onClick={onClick}
      aria-label="Abrir menú"
    >
      <BsList className="h-6 w-6" />
    </button>
  );
}
