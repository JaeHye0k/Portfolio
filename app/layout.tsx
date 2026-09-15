import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const title = "이재혁 | Frontend Web Developer";
const description =
  "임팩트와 효율을 만드는 개발자. 필요하다면 분야를 가리지 않고 빠르게 배우고 적용합니다.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
