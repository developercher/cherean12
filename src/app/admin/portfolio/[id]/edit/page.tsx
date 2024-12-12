'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PortfolioForm from '@/components/admin/forms/PortfolioForm';
import { toast } from 'react-hot-toast';

export default function EditPortfolioPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, [params.id]);

  const loadPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolio/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch portfolio item');
      const data = await response.json();
      setPortfolio(data);
    } catch (error) {
      toast.error('Failed to load portfolio item');
      router.push('/admin/portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to update a portfolio item');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/portfolio/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update portfolio item');

      toast.success('Portfolio item updated successfully');
      router.push('/admin/portfolio');
    } catch (error) {
      toast.error('Failed to update portfolio item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Portfolio Item
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <PortfolioForm 
          initialData={portfolio}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 