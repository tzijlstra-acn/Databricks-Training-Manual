import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { BeginnerModeProvider } from "@/context/BeginnerModeContext";
import { PresentationProvider } from "@/context/PresentationContext";
import { AudioReader } from "@/components/shared/AudioReader";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Databricks Learning Platform",
  description: "5-day interactive guide to Databricks — from raw data to trusted business insight",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geist.className}`}>
        <BeginnerModeProvider>
          <PresentationProvider>
            <div className="flex h-screen overflow-hidden bg-surface">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <TopNavigation />
                <main className="flex-1 overflow-y-auto p-6">
                  {children}
                </main>
                <AudioReader />
              </div>
            </div>
          </PresentationProvider>
        </BeginnerModeProvider>
      </body>
    </html>
  );
}
