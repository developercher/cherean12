'use client';
import { ThemeProvider } from "./ThemeProvider";
import AuthProvider from "./SessionProvider";
import { SearchProvider } from "@/contexts/SearchContext";
import { Toaster } from 'react-hot-toast';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          {children}
          <Toaster position="top-right" />
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 