import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nomi | Ad Creative",
  description:
    "Generate polished creative directions from one image, without opening a design tool.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html
        lang="en"
        className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body
          suppressHydrationWarning
          className="min-h-full flex flex-col bg-background text-foreground font-sans"
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
