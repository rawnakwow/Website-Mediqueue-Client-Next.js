"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
const titles = { "/": "MediQueue | Tutor Booking", "/tutors": "Tutors | MediQueue", "/add-tutor": "Add Tutor | MediQueue", "/my-tutors": "My Tutors | MediQueue", "/my-bookings": "My Booked Sessions | MediQueue", "/profile": "My Profile | MediQueue", "/login": "Login | MediQueue", "/register": "Register | MediQueue" };
export default function RouteTitle() { const pathname = usePathname(); useEffect(() => { document.title = titles[pathname] || (pathname.startsWith("/tutors/") ? "Tutor Details | MediQueue" : "MediQueue"); }, [pathname]); return null; }
