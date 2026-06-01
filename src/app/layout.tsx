import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "ToolClub · 互联网创业者的AI工具百宝箱",
  description: "ToolClub 为互联网创业者提供AI驱动的效率工具，涵盖短视频文案、跨境营销、数据分析等核心场景，助力一人公司规模化增长。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
