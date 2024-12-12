'use client';
import { useEffect } from 'react';

export default function ClickTracker() {
  useEffect(() => {
    const trackClick = async (e: MouseEvent) => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: 'click',
            clickX: e.clientX,
            clickY: e.clientY,
            pageUrl: window.location.pathname,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Failed to track click:', error);
      }
    };

    window.addEventListener('click', trackClick);
    return () => window.removeEventListener('click', trackClick);
  }, []);

  return null;
} 