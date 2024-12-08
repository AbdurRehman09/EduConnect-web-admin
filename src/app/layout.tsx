'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import AntdProvider from '@/components/providers/AntdProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AntdProvider>
            {children}
          </AntdProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
