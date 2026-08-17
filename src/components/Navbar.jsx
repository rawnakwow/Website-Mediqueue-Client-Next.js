"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenCheck, CalendarCheck2, ChevronDown, CircleUserRound, LogOut, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const user = session?.user;
  const links = [
    { href: "/", label: "Home" },
    { href: "/tutors", label: "Tutors" },
    ...(user ? [
      { href: "/add-tutor", label: "Add Tutor" },
      { href: "/my-tutors", label: "My Tutors" },
      { href: "/my-bookings", label: "My Booked Sessions" },
    ] : []),
  ];

  useEffect(() => {
    function close(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    }
    function escape(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function logout() {
    localStorage.removeItem("mediqueue-jwt");
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="site-nav glass">
      <div className="container nav-inner">
        <Link className="brand" href="/" aria-label="MediQueue home">
          <span className="brand-mark"><BookOpenCheck size={20} /><i /></span>
          <span>Medi<span>Queue</span></span>
        </Link>

        <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={isActive(link.href) ? "active" : ""}>
              {link.label}<i />
            </Link>
          ))}
          {!user && <div className="mobile-auth"><Link className="btn btn-secondary" href="/login">Login</Link><Link className="btn btn-primary" href="/register">Get started</Link></div>}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          {!user ? (
            <div className="desktop-auth"><Link href="/login">Login</Link><Link className="btn btn-primary" href="/register"><Sparkles size={16} /> Get started</Link></div>
          ) : (
            <div className="profile-menu" ref={profileRef}>
              <button className="profile-trigger" aria-expanded={profileOpen} aria-haspopup="menu" onClick={() => setProfileOpen((value) => !value)}>
                <UserAvatar name={user.name} src={user.image} size={36} />
                <span>{user.name?.split(" ")[0] || "Profile"}</span>
                <ChevronDown className={profileOpen ? "rotate" : ""} size={15} />
              </button>
              {profileOpen && (
                <div className="profile-pop surface" role="menu">
                  <div className="profile-pop-head"><UserAvatar name={user.name} src={user.image} size={42} /><p><b>{user.name}</b><small>{user.email}</small></p></div>
                  <div className="profile-pop-links">
                    <Link href="/profile" role="menuitem" onClick={() => setProfileOpen(false)}><CircleUserRound /> My profile</Link>
                    <Link href="/my-bookings" role="menuitem" onClick={() => setProfileOpen(false)}><CalendarCheck2 /> My bookings</Link>
                    <button onClick={logout} role="menuitem"><LogOut /> Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
          <button className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
