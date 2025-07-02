import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { JSX } from "react";
import { ToastContainer } from "react-toastify";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { auth0 } from "@/lib/auth0.ts";
import { $$, AnalyticsScripts } from "@monorepo/lib";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: $$.APP_NAME,
  description: $$.TAG_LINE
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props): Promise<JSX.Element> {
  const session = await auth0.getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Auth0Provider user={session?.user}>
          {children}
          <ToastContainer position={"bottom-right"} />
        </Auth0Provider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
