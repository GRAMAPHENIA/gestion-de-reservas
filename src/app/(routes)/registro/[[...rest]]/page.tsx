import { SignUp } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left side - Registration */}
      <div className="flex-1 flex items-center justify-center p-12">
        <SignUp
          forceRedirectUrl="/tablero"
          signInUrl="/inicio-de-sesion"
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
            Reserva tu alojamiento ideal
          </h2>
          <p className="text-stone-600 mb-6 leading-relaxed">
            Descubre propiedades únicas en destinos increíbles con reservas instantáneas y soporte completo.
          </p>
          <div className="space-y-3 text-stone-700 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
              <span>Propiedades verificadas</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
              <span>Reservas instantáneas</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}