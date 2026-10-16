import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wayfare — taste-matched travel, powered by Qloo",
  description:
    "An AI concierge agent that turns what you love into a taste-matched city trip, justified by Qloo's cross-domain taste graph.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
