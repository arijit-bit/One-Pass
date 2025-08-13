import { Bebas_Neue, Geist, Geist_Mono, Oswald, Poppins } from 'next/font/google';

// Configure fonts with proper fallbacks and offline support
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'fallback', // Better for offline scenarios
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});

export const oswald = Oswald({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-oswald',
  display: 'fallback', // Better for offline scenarios
  fallback: ['Impact', 'Arial Black', 'Helvetica', 'sans-serif'],
});

export const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'fallback', // Better for offline scenarios
  fallback: ['Impact', 'Arial Black', 'Helvetica', 'sans-serif'],
});

export const geistSans = Geist({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist-sans',
  display: 'fallback', // Better for offline scenarios
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist-mono',
  display: 'fallback', // Better for offline scenarios
  fallback: ['Monaco', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
});
