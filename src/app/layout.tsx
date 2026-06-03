import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Space_Mono,
  Noto_Serif_KR,
  Noto_Sans_KR,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  preload: false,
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-sans-kr",
  weight: ["300", "400", "500", "700", "900"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Issue — 하객마다 다른, 잡지처럼 완성되는 모바일 청첩장",
  description:
    "실제 웨딩 사진으로 완성하는 잡지형 모바일 청첩장 스튜디오. 하객 그룹별 맞춤 링크와 실시간 에디터를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${spaceMono.variable} ${notoSerifKr.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
