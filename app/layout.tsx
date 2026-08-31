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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F7F7F3] text-[#162630] min-h-screen flex flex-col antialiased selection:bg-[#00C98B]/20 selection:text-[#162630]">
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
