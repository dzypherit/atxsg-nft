import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { ChakraProvider } from '@chakra-ui/react'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATxSG Digital Collectible Claim Portal",
  description:
    "ATxSG Digital Collectible Claim Portal",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ChakraProvider>
        <ThirdwebProvider>{children}</ThirdwebProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
