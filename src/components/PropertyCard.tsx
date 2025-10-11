// components/PropertyCard.tsx
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
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          width={400}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-1 text-stone-800">{property.title}</h3>
        <p className="text-stone-600 text-sm mb-4">{property.location}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-stone-800">${property.price}/noche</span>
          <button className="bg-stone-700 text-white px-4 py-2 rounded font-medium hover:bg-stone-800 transition-colors">
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}
