import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Inter,
  Noto_Sans_KR,
  Noto_Serif_KR,
} from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-serif-kr",
  weight: ["300", "400", "500", "600", "700"],
  preload: false,
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-sans-kr",
  weight: ["300", "400", "500", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Issue - 모던 모바일 청첩장",
  description: "트렌디하고 단정한 세리프 기반 모바일 청첩장을 만들고 공유하는 플랫폼.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${display.variable} ${inter.variable} ${notoSerifKr.variable} ${notoSansKr.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
