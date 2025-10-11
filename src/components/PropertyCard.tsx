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
      <h3 className="text-xl font-semibold mb-2 text-stone-700">{property.title}</h3>
      <p className="text-stone-600 mb-2">{property.location}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-stone-700">${property.price}/noche</span>
        <button className="bg-stone-600 text-stone-50 px-4 py-2 rounded-lg shadow hover:bg-stone-700 transition">
          Reservar
        </button>
      </div>
    </GlassCard>
  );
}
