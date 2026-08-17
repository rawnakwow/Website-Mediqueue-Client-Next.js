import Link from "next/link";
import { SearchX } from "lucide-react";
export default function NotFound(){ return <section className="state-page"><SearchX/><h1>404</h1><h2>Page not found</h2><p>The page you requested is not available.</p><Link className="btn btn-primary" href="/">Back home</Link></section>; }
