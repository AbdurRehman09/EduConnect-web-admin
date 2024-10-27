'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import AntdProvider from '../components/AntdProvider';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: '#D4E2B6' }}>
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
