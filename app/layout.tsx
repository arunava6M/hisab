import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hisab - track & decide expense',
  description: 'Hisab - track & decide expense',
  generator: 'Next.js',
  manifest: '/manifest.json',
  themeColor: '#5f9ea0',
  keywords: ['nextjs', 'nextjs13', 'next13', 'pwa', 'next-pwa'],
  authors: [
    { name: 'Arunava Mondal' },
    {
      name: 'Arunava Mondal',
    },
  ],

  icons: [
    { rel: 'apple-touch-icon', url: '/icon512_maskable.png' },
    { rel: 'icon', url: '/icon512_maskable.png' },
  ],
  other: {
    viewport:
      'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  },
};

// export const generateViewport = () => ({
//   themeColor: [{ media: '(prefers-color-scheme: light)', color: '#fff' }],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
