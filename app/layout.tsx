
'use client'
import StyledComponentsRegistry from "../lib/registry";
import './globals.css'
import { AuthContextProvider } from '../context/AuthContext'

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
