import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arthena - AI Research Assistant',
  description: 'Your personal AI research assistant',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ✅ Anti-FOUC Script: 
          สคริปต์นี้จะรันทันทีที่ Browser อ่านเจอ บรรทัดนี้ (ก่อน render body)
          เพื่ออ่าน LocalStorage และเปลี่ยนสีพื้นหลังให้ถูกต้องทันที ไม่ต้องรอ React
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}