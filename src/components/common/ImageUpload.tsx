'use client';
import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { CameraIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  currentImage?: string;
  onUpload: (url: string, cloudinaryId?: string) => void;
}

const DEFAULT_AVATAR = `https://res.cloudinary.com/dovrz0lef/image/upload/v1/samples/people/placeholder`;

export default function ImageUpload({ currentImage, onUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      onUpload(data.secure_url, data.public_id);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24">
          <Image
            src={currentImage || DEFAULT_AVATAR}
            alt="Upload preview"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/90
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
          <p className="mt-1 text-sm text-gray-500">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>
    </div>
  );
} 