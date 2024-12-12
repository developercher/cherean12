'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import ImageUpload from '@/components/common/ImageUpload';

interface ProfessionalInfo {
  title: string;
  company: string;
  skills: string[];
  experience: string;
}

interface SocialLinks {
  twitter: string;
  linkedin: string;
  github: string;
}

interface UserPreferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  publicProfile: boolean;
}

interface Profile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  socialLinks: SocialLinks;
  preferences: UserPreferences;
  professionalInfo?: ProfessionalInfo;
}

// Add interface for Activity
interface Activity {
  id: string;
  description: string;
  timestamp: string;
  icon?: any; // You might want to define a more specific type for icon
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    location: '',
    website: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
    },
    preferences: {
      emailNotifications: true,
      marketingEmails: false,
      publicProfile: true,
    },
    professionalInfo: {
      title: '',
      company: '',
      skills: [],
      experience: '',
    }
  });

  // Initialize activities as an empty array with proper typing
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadProfile();
    loadActivities();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      setProfile({
        ...data,
        socialLinks: data.socialLinks || {
          twitter: '',
          linkedin: '',
          github: '',
        },
        preferences: data.preferences || {
          emailNotifications: true,
          marketingEmails: false,
          publicProfile: true,
        },
        professionalInfo: data.professionalInfo || {
          title: '',
          company: '',
          skills: [],
          experience: '',
        },
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const response = await fetch('/api/user/activities');
      const data = await response.json();
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
      setActivities(data);
      } else {
        setActivities([]); // Set empty array if data is not in expected format
        console.error('Activities data is not an array:', data);
      }
    } catch (error) {
      toast.error('Failed to load activities');
      setActivities([]); // Set empty array on error
    }
  };

  const updateProfile = async (updates: Partial<typeof profile>) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedProfile = await response.json();
      setProfile(prev => ({ ...prev, ...updatedProfile }));
      
      // Update session if name or avatar changed
      if (updates.name || updates.avatar) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: updates.name || session?.user?.name,
            image: updates.avatar || session?.user?.image,
          },
        });
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    await updateProfile({ avatar: url });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-primary to-primary/60">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <img
                src={profile.avatar || '/default-avatar.png'}
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800"
              />
              <button
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="absolute bottom-0 right-0 p-1 rounded-full bg-white dark:bg-gray-800 shadow"
              >
                <CameraIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <ImageUpload
                id="avatar-upload"
                className="hidden"
                currentImage={profile.avatar}
                onUpload={handleAvatarUpload}
              />
            </div>
          </div>
        </div>
        <div className="pt-16 pb-6 px-8">
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-gray-500">
            {profile.professionalInfo?.title || 'No title set'}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              onBlur={() => updateProfile({ name: profile.name })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              onBlur={() => updateProfile({ email: profile.email })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              onBlur={() => updateProfile({ phone: profile.phone })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              onBlur={() => updateProfile({ location: profile.location })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            onBlur={() => updateProfile({ bio: profile.bio })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title
            </label>
            <input
              type="text"
              value={profile.professionalInfo?.title || ''}
              onChange={(e) => setProfile({
                ...profile,
                professionalInfo: {
                  ...profile.professionalInfo,
                  title: e.target.value
                }
              })}
              onBlur={() => updateProfile({
                professionalInfo: {
                  ...profile.professionalInfo,
                  title: profile.professionalInfo?.title || ''
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company
            </label>
            <input
              type="text"
              value={profile.professionalInfo?.company || ''}
              onChange={(e) => setProfile({
                ...profile,
                professionalInfo: {
                  ...profile.professionalInfo,
                  company: e.target.value
                }
              })}
              onBlur={() => updateProfile({
                professionalInfo: {
                  ...profile.professionalInfo,
                  company: profile.professionalInfo?.company || ''
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
        <div className="space-y-4">
          {Object.entries(profile.socialLinks || {}).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {platform}
              </label>
              <input
                type="url"
                value={url || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  socialLinks: {
                    ...profile.socialLinks,
                    [platform]: e.target.value
                  }
                })}
                onBlur={() => updateProfile({
                  socialLinks: {
                    ...profile.socialLinks,
                    [platform]: profile.socialLinks[platform as keyof SocialLinks]
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity: Activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 py-3 border-b last:border-0"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {activity.icon && <activity.icon className="w-4 h-4 text-primary" />}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No recent activities
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 