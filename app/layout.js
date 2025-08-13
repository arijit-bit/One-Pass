import { poppins, oswald, bebas, geistSans, geistMono } from './fonts';
import "./globals.css";
export const metadata = {
  title: "ONE PASS - Password Manager",
  description: "Secure password management application",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${bebas.variable} ${poppins.variable}`}>
      <head>
        {/* Font preconnect for Google Fonts - helps with loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
