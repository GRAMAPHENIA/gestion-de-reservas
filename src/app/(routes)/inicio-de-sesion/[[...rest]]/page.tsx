import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left side - Login */}
      <div className="flex-1 flex items-center justify-center p-12">
        <SignIn
          forceRedirectUrl="/tablero"
          signUpUrl="/registro"
          appearance={{
            elements: {
              "cl-footerAction": {
                display: "none"
              }
            }
          }}
        />
      </div>

      {/* Right side - Information */}
      <div className="flex-1 flex items-center justify-center p-12 bg-white">
        <div className="max-w-sm text-center">
          <h2 className="text-3xl font-light text-stone-800 mb-4">
            Tu viaje comienza aquí
          </h2>
          <p className="text-stone-600 mb-6 leading-relaxed">
            Accede a tu cuenta para gestionar reservas y explorar propiedades únicas con facilidad.
          </p>
          <div className="space-y-3 text-stone-700 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
              <span>Historial de reservas</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
              <span>Favoritos guardados</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
              <span>Notificaciones</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}