import type { Metadata } from "next";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.formilo.in"),
  title: "Formilo — Government Form Photo, Signature & PDF Tools",
  description:
    "Free photo, signature and PDF tools for government forms and online applications. Resize files to exact KB, dimensions and formats with Formilo.",
  alternates: {
    canonical: "https://www.formilo.in",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Formilo — Government Form Document & Photo Tools",
    description: "Resize, compress, and format government form photos, signatures, and PDFs in seconds.",
    url: "https://www.formilo.in",
    siteName: "Formilo",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Formilo Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F7F7F3] text-[#17262E] min-h-screen flex flex-col antialiased selection:bg-[#00C98B]/20 selection:text-[#17262E]">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
