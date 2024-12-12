'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import TestimonialForm from '@/components/admin/forms/TestimonialForm';
import { toast } from 'react-hot-toast';

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [testimonial, setTestimonial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTestimonial();
  }, [params.id]);

  const loadTestimonial = async () => {
    try {
      const response = await fetch(`/api/testimonials/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch testimonial');
      const data = await response.json();
      setTestimonial(data);
    } catch (error) {
      toast.error('Failed to load testimonial');
      router.push('/admin/testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to update a testimonial');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/testimonials/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update testimonial');

      toast.success('Testimonial updated successfully');
      router.push('/admin/testimonials');
    } catch (error) {
      toast.error('Failed to update testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Testimonial</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <TestimonialForm
          initialData={testimonial}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 