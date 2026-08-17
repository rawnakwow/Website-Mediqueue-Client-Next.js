import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
export default function Footer() {
  return <footer className="footer"><div className="footer-glow"/><div className="container footer-grid">
    <div className="footer-about"><Link className="brand footer-brand" href="/"><span className="brand-mark"><BookOpenCheck size={20}/><i /></span><span>Medi<span>Queue</span></span></Link><p>A calmer way to discover tutors and reserve learning sessions without schedule confusion.</p><Link className="footer-cta" href="/tutors">Explore tutors <ArrowUpRight /></Link></div>
    <div><h3>Learning services</h3><Link href="/tutors">Browse tutors</Link><Link href="/add-tutor">List a tutor</Link><Link href="/my-bookings">My sessions</Link><Link href="/my-tutors">Manage tutors</Link></div>
    <div><h3>Contact</h3><p><Mail size={15}/> hello@mediqueue.com</p><p><Phone size={15}/> +880 1700-000000</p><p><MapPin size={15}/> Dhaka, Bangladesh</p></div>
    <div><h3>Follow the journey</h3><div className="socials"><a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook/></a><a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram/></a><a className="x-social" aria-label="X" href="https://x.com" target="_blank" rel="noreferrer">𝕏</a><a aria-label="LinkedIn" href="https://linkedin.com" target="_blank" rel="noreferrer"><Linkedin/></a></div></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} MediQueue. All rights reserved.</span><span>Built for focused learning.</span></div></footer>;
}
