"use client";

import { useState, useRef } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          alert(`El archivo ${file.name} no es una imagen válida`);
          continue;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB`);
          continue;
        }

        // Convertir a base64
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }

      // Agregar las nuevas imágenes sin exceder el límite
      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      onChange(updatedImages);
    } catch (error) {
      console.error('Error al procesar imágenes:', error);
      alert('Error al procesar las imágenes');
    } finally {
      setUploading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-stone-700">
          Imágenes del alojamiento ({images.length}/{maxImages})
        </label>
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center px-3 py-2 border border-stone-300 shadow-sm text-sm leading-4 font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-50"
          >
            <FiUpload className="mr-2 h-4 w-4" />
            {uploading ? 'Subiendo...' : 'Agregar imágenes'}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Grid de imágenes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
              <img
                src={image}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Placeholder para agregar más imágenes */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-500 hover:bg-stone-100 hover:border-stone-400 transition-colors disabled:opacity-50"
          >
            <FiImage className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">
              {uploading ? 'Subiendo...' : 'Agregar imagen'}
            </span>
          </button>
        )}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-stone-300 rounded-lg">
          <FiImage className="mx-auto h-12 w-12 text-stone-400" />
          <h3 className="mt-2 text-sm font-medium text-stone-900">No hay imágenes</h3>
          <p className="mt-1 text-sm text-stone-500">
            Agrega imágenes de tu alojamiento para atraer más huéspedes
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-50"
            >
              <FiUpload className="mr-2 h-4 w-4" />
              {uploading ? 'Subiendo...' : 'Subir imágenes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}