'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ExclamationTriangleIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface NotFoundPageProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function NotFoundPage({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  showBackButton = true,
  showHomeButton = true,
}: NotFoundPageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-9xl font-bold text-gray-200 dark:text-gray-800"
            >
              404
            </motion.div>
            <ExclamationTriangleIcon className="w-20 h-20 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            {description}
          </p>

          <div className="mt-8 space-y-3">
            {showHomeButton && (
              <button
                onClick={() => router.push('/')}
                className="btn btn-primary inline-flex items-center group"
              >
                <HomeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Go to Homepage</span>
              </button>
            )}
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="btn btn-outline-primary inline-flex items-center ml-4"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                <span>Go Back</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 