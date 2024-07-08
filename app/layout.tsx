
'use client'
import StyledComponentsRegistry from "../lib/registry";
import './globals.css'
import AuthContextProvider from '../context/authContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <AuthContextProvider>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </AuthContextProvider>
      </body>
    </html>
  );
}
