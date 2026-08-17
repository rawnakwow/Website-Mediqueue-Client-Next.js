"use client";

import Link from "next/link";
import { BadgeCheck, BookOpenCheck, CalendarCheck2, Mail, PlusCircle, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState({ tutors: 0, bookings: 0 });

  useEffect(() => {
    if (!session?.user) return;
    Promise.allSettled([apiFetch("/tutors/mine"), apiFetch("/bookings/mine")]).then(([tutors, bookings]) => {
      setStats({
        tutors: tutors.status === "fulfilled" ? tutors.value.length : 0,
        bookings: bookings.status === "fulfilled" ? bookings.value.length : 0,
      });
    });
  }, [session?.user]);

  if (isPending || !session?.user) return <div className="page-loader"><div className="spinner" /><p>Loading your profile…</p></div>;
  const user = session.user;

  return (
    <section className="section profile-page-section">
      <div className="container profile-page-grid">
        <article className="profile-identity surface">
          <div className="profile-cover"><span /><span /><span /></div>
          <div className="profile-avatar-large"><UserAvatar name={user.name} src={user.image} size={112} /><i><BadgeCheck /></i></div>
          <span className="eyebrow">MediQueue member</span>
          <h1>{user.name}</h1>
          <p><Mail /> {user.email}</p>
          <div className="profile-security"><ShieldCheck /><span><b>Protected account</b><small>Better Auth session + JWT-secured API access</small></span></div>
        </article>

        <div className="profile-dashboard">
          <div className="profile-welcome surface"><span className="eyebrow">Your learning space</span><h2>Everything you manage, in one calm view.</h2><p>Your private pages stay connected to this signed-in account—even after a route reload.</p><div className="profile-actions"><Link className="btn btn-primary" href="/tutors"><Sparkles /> Find a tutor</Link><Link className="btn btn-secondary" href="/add-tutor"><PlusCircle /> Add tutor</Link></div></div>
          <div className="profile-stat-grid">
            <Link className="profile-stat surface" href="/my-bookings"><CalendarCheck2 /><div><b>{stats.bookings}</b><span>Booked sessions</span></div></Link>
            <Link className="profile-stat surface" href="/my-tutors"><UsersRound /><div><b>{stats.tutors}</b><span>Created tutors</span></div></Link>
          </div>
          <article className="profile-note surface"><BookOpenCheck /><div><span className="eyebrow">Quick tip</span><h3>Keep every tutor schedule accurate.</h3><p>Update availability and total slots from My Tutors so students always see a reliable booking window.</p></div></article>
        </div>
      </div>
    </section>
  );
}
