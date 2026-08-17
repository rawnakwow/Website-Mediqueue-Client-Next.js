"use client";
import { TriangleAlert } from "lucide-react";
export default function ErrorPage({ retry, reset }){ const recover = retry || reset; return <section className="state-page"><TriangleAlert/><h1>Something went wrong</h1><p>Please try the request again.</p><button className="btn btn-primary" onClick={recover}>Try again</button></section>; }
