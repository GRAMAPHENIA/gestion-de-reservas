// components/PropertyCard.tsx
import GlassCard from "./GlassCard";
import Image from "next/image";

interface Property {
  images: string[];
  title: string;
  price: number;
  location: string;
  // Add other property fields as needed
}

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-zinc-800 text-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-400 mb-2">{property.location}</p>
        <div className="flex items-center justify-between">
          <span className="text-emerald-400 font-semibold">${property.price}</span>
          <button className="btn-primary px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <GlassCard>
      <div className="overflow-hidden rounded-xl mb-4">
        <Image
          src={property.images[0]}
          alt={property.title}
          width={400}
          height={250}
          className="object-cover w-full h-48"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">${property.price}/noche</span>
        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-600 transition">
          Reservar
        </button>
      </div>
    </GlassCard>
  );
}
