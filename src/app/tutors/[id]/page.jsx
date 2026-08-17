"use client";
/* eslint-disable @next/next/no-img-element -- tutor photos accept arbitrary user-provided URLs */
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, GraduationCap, Laptop2, MapPin, Phone, TicketCheck, WalletCards } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { API_URL, apiFetch } from "@/lib/api";

export default function TutorDetailsPage(){
  const {id}=useParams(); const router=useRouter(); const {data:session}=authClient.useSession(); 
  const [tutor,setTutor]=useState(null);
   const [loading,setLoading]=useState(true);
   const [open,setOpen]=useState(false); 
   const [booking,setBooking]=useState(false);
  useEffect(()=>{ fetch(`${API_URL}/tutors/${id}`,
    {headers:{}}).then(r=>r.ok?r.json():Promise.reject()).then(setTutor).catch(()=>router.replace("/not-found")).finally(()=>setLoading(false)); },[id,router]);
  
  const availability=useMemo(()=>{ if(!tutor) return {blocked:true,message:"Unavailable"}; if(Number(tutor.totalSlot)<=0) return {blocked:true,message:"No available slots left."}; 
  if(new Date()<new Date(tutor.sessionStartDate)) return {blocked:true,message:"Booking is not available yet for this tutor"}; return {blocked:false,message:"Book Session"}; },[tutor]);
  async function submit(e){ e.preventDefault(); const form=new FormData(e.currentTarget); setBooking(true); 
    try { const result=await apiFetch("/bookings",{method:"POST",body:JSON.stringify({tutorId:tutor._id,studentName:form.get("studentName"),phone:form.get("phone")})});
     toast.success(`Session booked. Token: ${result.sessionToken}`); setTutor({...tutor,totalSlot:Math.max(0,tutor.totalSlot-1)}); setOpen(false); router.push("/my-bookings"); }
      catch(error){ toast.error(error.message); } finally{setBooking(false);} }
  if(loading) return <div className="page-loader"><div className="spinner"/></div>; if(!tutor) return null;
  return <section className="section"><div className="container"><button className="back-link" onClick={()=>router.back()}>
    <ArrowLeft size={17}/> Back to tutors</button><div className="details-grid"><div className="profile-panel surface"><div className="profile-photo">
      <img src={tutor.photo} alt={tutor.tutorName}/><span>{tutor.subject}</span></div><div className="profile-copy"><span className="eyebrow">Tutor profile</span>
      <h1>{tutor.tutorName}</h1><p><GraduationCap/> {tutor.institutionExperience}</p>
      <div className="detail-list"><span><MapPin/> {tutor.location}</span><span><Laptop2/> {tutor.teachingMode}</span><span><CalendarDays/> {tutor.availableDays}</span><span><Clock3/> {tutor.availableTimeSlot}</span><span><WalletCards/> ৳{Number(tutor.hourlyFee).toLocaleString()} per hour</span></div></div></div>
      <aside className="booking-panel surface"><span className="eyebrow">Session availability</span><h2>Reserve a learning slot.</h2>
      <div className="slot-count"><b>{tutor.totalSlot}</b><span>slots remaining</span></div><p>Session booking opens from <b>{new Date(tutor.sessionStartDate).toLocaleDateString()}</b>.
      </p><button className="btn btn-primary book-button" disabled={availability.blocked} onClick={()=>setOpen(true)}>{availability.message}</button>{Number(tutor.totalSlot)<=0 && <p className="notice danger">This session is fully booked. You can’t join at the moment.</p>}</aside></div></div>{open&&<div className="modal-backdrop" onMouseDown={()=>setOpen(false)}>
        <form className="booking-modal surface" onSubmit={submit} onMouseDown={e=>e.stopPropagation()}><span className="eyebrow">Book session</span><h2>{tutor.tutorName}</h2><label className="field"><span>Student Name</span><input className="input" name="studentName" defaultValue={session?.user?.name||""} required/></label><label className="field"><span><Phone size={14}/> Phone</span><input className="input" name="phone" required placeholder="01XXXXXXXXX"/></label><label className="field"><span>Tutor ID</span><input className="input" readOnly value={tutor._id}/></label><label className="field"><span>Tutor Name</span><input className="input" readOnly value={tutor.tutorName}/></label><label className="field"><span>Student Email</span><input className="input" readOnly value={session?.user?.email||""}/></label><div className="modal-actions"><button className="btn btn-secondary" type="button" onClick={()=>setOpen(false)}>Cancel</button><button className="btn btn-primary" disabled={booking} type="submit"><TicketCheck size={17}/>{booking?"Booking…":"Confirm Booking"}
      </button></div></form></div>}</section>;
}
