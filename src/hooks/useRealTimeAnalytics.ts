import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useRealTimeAnalytics() {
  const pathname = usePathname();
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const trackPageView = async () => {
      if (isTracking) return;
      
      try {
        setIsTracking(true);
        const userAgent = window.navigator.userAgent;
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageUrl: pathname,
            userAgent,
            browser: detectBrowser(userAgent),
            device: detectDevice(userAgent),
            os: detectOS(userAgent),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to track analytics');
        }
      } catch (error) {
        console.error('Analytics tracking error:', error);
      } finally {
        setIsTracking(false);
      }
    };

    trackPageView();
  }, [pathname]);
}

function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
}

function detectDevice(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function detectOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'MacOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/ios/i.test(userAgent)) return 'iOS';
  return 'Other';
} 