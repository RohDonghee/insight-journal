import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Insight Journal",
  description: "컨설팅 리포트 분석 & 개인 인사이트 기록",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
