import './globals.css';

export const metadata = {
  title: 'Adnos',
  description: 'Interactive space ship visualization',
  icons: {
    icon: '/favicon.ico',
    apple: '/Ico/favicon_180x180.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 