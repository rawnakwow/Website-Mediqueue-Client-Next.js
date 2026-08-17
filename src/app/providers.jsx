"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import SessionTokenSync from "@/components/SessionTokenSync";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SessionTokenSync />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          className: "mediqueue-toast",
        }}
      />
    </ThemeProvider>
  );
}
