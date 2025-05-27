import ClientProvider from '@molecules/clientProvider';
import { cookies } from 'next/headers';

// export const metadata: Metadata = {
//   title: 'Hisab - track & decide expense',
//   description: 'Hisab - track & decide expense',
//   generator: 'Next.js',
//   manifest: '/manifest.json',
//   keywords: ['nextjs', 'nextjs13', 'next13', 'pwa', 'next-pwa'],
//   authors: [
//     { name: 'Arunava Mondal' },
//     {
//       name: 'Arunava Mondal',
//     },
//   ],

//   icons: [
//     { rel: 'apple-touch-icon', url: 'icons/icon-192x192.png' },
//     { rel: 'icon', url: 'icons/icon-192x192.png' },
//   ],
//   other: {
//     viewport:
//       'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
//   },
// };

// export const generateViewport = () => ({
//   themeColor: [{ media: '(prefers-color-scheme: light)', color: '#fff' }],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('authToken')?.value;
  return (
    <html lang="en">
      <body>
        <ClientProvider authToken={authToken}>{children}</ClientProvider>
      </body>
    </html>
  );
}
