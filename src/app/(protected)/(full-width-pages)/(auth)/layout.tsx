import GridShape from "@/components/common/GridShape";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <ThemeProvider>
        <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
          {children}
          <div className="relative hidden h-full w-full lg:block lg:w-1/2">
            <Image
              src="/images/MallBg.png"
              alt="Mall Background"
              fill
              className="object-cover"
              priority
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 flex h-full items-center justify-center">
              <GridShape />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
