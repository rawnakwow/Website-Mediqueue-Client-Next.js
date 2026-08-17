"use client";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Laptop2,
  MapPin,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import TutorCard from "./TutorCard";
import SectionTitle from "./SectionTitle";
import ScrollReveal from "./ScrollReveal";
import { API_URL } from "@/lib/api";

const slides = [
  {
    tag: "Personalized learning",
    title: "Great tutors. Clear schedules. Better learning.",
    text: "Explore tutor profiles, compare real availability, and reserve a session without the usual message chase.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=88",
    tutor: "Ayesha Rahman",
    subject: "Mathematics",
    place: "Dhanmondi · Both modes",
    time: "Sun–Thu · 5:00–8:00 PM",
    slots: "12 slots open",
    initials: "AR",
  },
  {
    tag: "Conflict-free booking",
    title: "One booking flow. Zero schedule confusion.",
    text: "MediQueue checks the session start date and remaining capacity before every reservation, then creates your token instantly.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=88",
    tutor: "Nafis Ahmed",
    subject: "Physics",
    place: "Uttara · Online",
    time: "Sat–Wed · 6:00–9:00 PM",
    slots: "8 slots open",
    initials: "NA",
  },
  {
    tag: "Learn your way",
    title: "Choose by subject, place, mode, and experience.",
    text: "From exam preparation to programming, find a tutor who matches how, when, and where you want to learn.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=2000&q=88",
    tutor: "Fahim Chowdhury",
    subject: "ICT & Programming",
    place: "Banani · Online",
    time: "Fri–Tue · 7:00–10:00 PM",
    slots: "7 slots open",
    initials: "FC",
  },
];

const subjects = [
  { icon: BrainCircuit, name: "Mathematics", text: "Problem solving, algebra, calculus", tone: "mint" },
  { icon: BookOpen, name: "English", text: "Language, writing, exam prep", tone: "violet" },
  { icon: UsersRound, name: "Physics", text: "Mechanics, electricity, exam prep", tone: "sky" },
  { icon: Laptop2, name: "ICT", text: "Programming and digital skills", tone: "amber" },
];

const proof = [
  { icon: UsersRound, value: "6", label: "featured tutors loaded with $limit" },
  { icon: ShieldCheck, value: "3", label: "availability checks per booking" },
  { icon: TicketCheck, value: "1", label: "unique session token after booking" },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setSlide((current) => (current + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/tutors/featured`, { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load featured tutors");
        return response.json();
      })
      .then((data) => setTutors(Array.isArray(data) ? data : []))
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const current = slides[slide];

  function move(direction) {
    setSlide((currentSlide) => (currentSlide + direction + slides.length) % slides.length);
  }

  return (
    <>
      <section
        className="hero-slider"
        aria-roledescription="carousel"
        aria-label="MediQueue learning highlights"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
      >
        <div className="hero-slides" aria-hidden="true">
          {slides.map((item, index) => (
            <div
              className={`hero-slide-bg ${index === slide ? "active" : ""}`}
              key={item.title}
              style={{ backgroundImage: `url(${item.image})` }}
            />
          ))}
        </div>
        <div className="hero-shade" />
        <div className="hero-aurora hero-aurora-one" />
        <div className="hero-aurora hero-aurora-two" />

        <div className="container hero-layout">
          <div className="hero-copy" key={current.title}>
            <span className="hero-badge"><Sparkles size={14} /> {current.tag}</span>
            <h1>{current.title}</h1>
            <p>{current.text}</p>
            <div className="hero-actions">
              <Link className="btn btn-accent btn-large" href="/tutors">
                <Search size={18} /> Explore tutors <ArrowRight size={17} />
              </Link>
              <a className="hero-link" href="#how">See how it works <ArrowRight size={17} /></a>
            </div>
            <div className="hero-trust">
              <div className="avatar-stack" aria-hidden="true"><span>AR</span><span>NA</span><span>SK</span></div>
              <p><BadgeCheck size={16} /> Real schedules, protected bookings, clear status.</p>
            </div>
          </div>

          <aside className="hero-schedule-card" key={`${current.tutor}-${slide}`} aria-label="Example tutor availability">
            <div className="schedule-card-top">
              <span><i /> Available to book</span>
              <small>Live preview</small>
            </div>
            <div className="schedule-person">
              <span className="schedule-avatar">{current.initials}</span>
              <div><h2>{current.tutor}</h2><p>{current.subject}</p></div>
              <BadgeCheck aria-label="Verified tutor" />
            </div>
            <div className="schedule-facts">
              <span><MapPin /> {current.place}</span>
              <span><Clock3 /> {current.time}</span>
            </div>
            <div className="schedule-slot">
              <div><small>Next step</small><b>Pick your tutor</b></div>
              <span>{current.slots}</span>
            </div>
            <div className="schedule-token"><TicketCheck /><span><small>After booking</small><b>MQ-session token generated</b></span></div>
          </aside>
        </div>

        <div className="container hero-carousel-bar">
          <button type="button" aria-label="Previous banner" onClick={() => move(-1)}><ChevronLeft /></button>
          <div className="hero-dots" role="tablist" aria-label="Choose banner">
            {slides.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={index === slide}
                aria-label={`Show banner ${index + 1}: ${item.tag}`}
                className={index === slide ? "active" : ""}
                key={item.tag}
                onClick={() => setSlide(index)}
              ><span /></button>
            ))}
          </div>
          <button type="button" aria-label={paused ? "Resume banner autoplay" : "Pause banner autoplay"} onClick={() => setPaused((value) => !value)}>
            {paused ? <Play size={17} /> : <Pause size={17} />}
          </button>
          <span className="slide-count">0{slide + 1} / 0{slides.length}</span>
          <button type="button" aria-label="Next banner" onClick={() => move(1)}><ChevronRight /></button>
        </div>
        <p className="sr-only" aria-live="polite">Banner {slide + 1} of {slides.length}: {current.title}</p>
      </section>

      <section className="proof-strip" aria-label="MediQueue booking safeguards">
        <div className="container proof-grid">
          {proof.map(({ icon: Icon, value, label }, index) => (
            <ScrollReveal className="proof-item" delay={index * 80} key={label}>
              <Icon /> <b>{value}</b><span>{label}</span>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <ScrollReveal>
            <SectionTitle eyebrow="Available tutors" title="Book someone who fits your learning style." text="Six recently added tutors are loaded directly from the database." />
          </ScrollReveal>
          {loading ? (
            <div className="grid-cards" aria-label="Loading featured tutors">{[1,2,3,4,5,6].map((item) => <div className="skeleton-card" key={item} />)}</div>
          ) : loadError ? (
            <div className="empty compact-empty"><UsersRound /><h3>Featured tutors are taking a short break</h3><p>Start the MediQueue API and refresh this page.</p></div>
          ) : tutors.length ? (
            <div className="grid-cards">
              {tutors.map((tutor, index) => <ScrollReveal delay={(index % 3) * 90} key={tutor._id}><TutorCard tutor={tutor} /></ScrollReveal>)}
            </div>
          ) : (
            <div className="empty compact-empty"><UsersRound /><h3>No tutors are listed yet</h3><p>Add the first tutor profile or run the included demo seed.</p></div>
          )}
          <ScrollReveal className="center-action"><Link className="btn btn-secondary" href="/tutors">View all tutors <ArrowRight size={17} /></Link></ScrollReveal>
        </div>
      </section>

      <section className="section alt-section subject-section">
        <div className="container">
          <ScrollReveal><SectionTitle eyebrow="Popular subjects" title="Start with what you want to improve." text="Focused tutors for school, university, language, and practical digital skills." /></ScrollReveal>
          <div className="subject-grid">
            {subjects.map(({ icon: Icon, name, text, tone }, index) => (
              <ScrollReveal delay={index * 80} key={name}>
                <Link className={`subject-card surface tone-${tone}`} href={`/tutors?subject=${encodeURIComponent(name)}`}>
                  <span className="subject-icon"><Icon /></span><span className="subject-arrow"><ArrowRight /></span><h3>{name}</h3><p>{text}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="section how-section">
        <div className="container how-grid">
          <ScrollReveal className="how-copy"><span className="eyebrow">How MediQueue works</span><h2>Three steps from search to session.</h2><p className="muted">No manual schedule chasing. Every reservation passes the same availability rules before a slot is reduced.</p><Link className="btn btn-primary" href="/tutors">Find a tutor <ArrowRight size={17} /></Link></ScrollReveal>
          <div className="steps">
            <ScrollReveal as="article" delay={0}><span>01</span><Search /><div><h3>Discover</h3><p>Compare subject, fee, teaching mode, location, and availability.</p></div></ScrollReveal>
            <ScrollReveal as="article" delay={100}><span>02</span><CalendarCheck2 /><div><h3>Book</h3><p>Your session date and remaining tutor slots are checked atomically.</p></div></ScrollReveal>
            <ScrollReveal as="article" delay={200}><span>03</span><ShieldCheck /><div><h3>Manage</h3><p>Use your private dashboard to view tokens or cancel a session.</p></div></ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
