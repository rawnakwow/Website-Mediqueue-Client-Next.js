import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- tutor photos can use examiner-provided arbitrary hosts */
import { ArrowUpRight, BadgeCheck, CalendarClock, GraduationCap, Laptop2, MapPin, WalletCards } from "lucide-react";

export default function TutorCard({ tutor }) {
  const slots = Math.max(0, Number(tutor.totalSlot) || 0);

  return (
    <article className="tutor-card surface">
      <div className="tutor-photo-wrap">
        <img className="tutor-photo" src={tutor.photo} alt={`${tutor.tutorName}, ${tutor.subject} tutor`} />
        <div className="card-photo-shade" />
        <span className="subject-chip">{tutor.subject}</span>
        <span className="mode-chip"><Laptop2 /> {tutor.teachingMode}</span>
      </div>
      <div className="tutor-body">
        <div className="tutor-heading">
          <div><h3>{tutor.tutorName} <BadgeCheck aria-label="Verified profile" /></h3><p className="muted"><GraduationCap size={15} /> {tutor.institutionExperience}</p></div>
        </div>
        <div className="tutor-meta">
          <span><MapPin /> {tutor.location}</span>
          <span><CalendarClock /> {tutor.availableDays} · {tutor.availableTimeSlot}</span>
          <span><WalletCards /> ৳{Number(tutor.hourlyFee).toLocaleString()}/hour</span>
        </div>
        <div className="card-foot">
          <span className={slots ? "slots-open" : "slots-closed"}><i /> <b>{slots}</b> {slots === 1 ? "slot" : "slots"} left</span>
          <Link className="btn btn-primary card-book-btn" href={`/tutors/${tutor._id}`}>Book Session <ArrowUpRight /></Link>
        </div>
      </div>
    </article>
  );
}
