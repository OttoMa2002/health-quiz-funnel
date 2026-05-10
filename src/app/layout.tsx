import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nDetector } from "@/components/I18nDetector";
import { ThemeManager } from "@/components/ThemeManager";
import "./globals.css";

// Inline script: applies the persisted theme (or browser preference) to <html>
// BEFORE React hydrates. Prevents a flash of light mode on dark-mode users.
const themeBootstrap = `(function(){try{var raw=localStorage.getItem("hqf:quiz");var theme=null;if(raw){var data=JSON.parse(raw);theme=data&&data.state&&data.state.theme;}if(theme==="dark"){document.documentElement.classList.add("dark");}else if(theme!=="light"){if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.classList.add("dark");}}}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "健康测评 · Health Quiz",
  description: "5 分钟生成你的个性化健身方案",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#faf9f5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <I18nDetector />
        <ThemeManager />
        {children}
      </body>
    </html>
  );
}
