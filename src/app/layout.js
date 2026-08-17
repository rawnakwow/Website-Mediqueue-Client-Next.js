import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteTitle from "@/components/RouteTitle";
export const metadata = { title: "MediQueue | Tutor Booking", description: "Tutor booking and learning session management platform" };
export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><body><Providers><a className="skip-link" href="#main-content">Skip to content</a><RouteTitle/><Navbar/><main id="main-content">{children}</main><Footer/></Providers></body></html>;
}
