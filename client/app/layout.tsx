import "./globals.css";
import Navbar from "@/component/layout/Navbar";
import Footer from "@/component/layout/Footer";
import { Providers } from "@/components/Providers";
import ServerStatus from "@/components/ServerStatus";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ServerStatus />
        </Providers>
      </body>
    </html>
  );
}
