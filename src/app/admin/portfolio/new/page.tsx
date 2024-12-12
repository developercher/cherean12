'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PortfolioForm from '@/components/admin/forms/PortfolioForm';
import { toast } from 'react-hot-toast';

export default function NewPortfolioPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to create a portfolio item');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authorId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portfolio item');
      }

      toast.success('Portfolio item created successfully');
      router.push('/admin/portfolio');
    } catch (error) {
      toast.error('Failed to create portfolio item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Portfolio Item
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <PortfolioForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 