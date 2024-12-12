'use client';
import { useEffect, useRef, useState } from 'react';
import { NOTIFICATION_SOUNDS, NotificationSoundType } from '@/constants/notificationSounds';

interface NotificationSoundProps {
  play: boolean;
  type?: NotificationSoundType;
  volume?: number;
  onPlay?: () => void;
  onEnd?: () => void;
}

export default function NotificationSound({
  play,
  type = 'default',
  volume = 0.5,
  onPlay,
  onEnd,
}: NotificationSoundProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.load();
      setIsLoaded(true);
    }
  }, [volume]);

  useEffect(() => {
    if (play && isLoaded && audioRef.current) {
      const playSound = async () => {
        try {
          await audioRef.current?.play();
          onPlay?.();
        } catch (error) {
          console.error('Failed to play notification sound:', error);
        }
      };
      playSound();
    }
  }, [play, isLoaded, onPlay]);

  return (
    <audio
      ref={audioRef}
      src={NOTIFICATION_SOUNDS[type]}
      preload="auto"
      onEnded={onEnd}
      className="hidden"
    />
  );
} 