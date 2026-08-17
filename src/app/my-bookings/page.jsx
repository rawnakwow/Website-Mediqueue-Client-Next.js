"use client";
import { CalendarX2, TicketCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
export default function MyBookingsPage(){
  const [bookings,setBookings]=useState([]); const [loading,setLoading]=useState(true); const [cancel,setCancel]=useState(null);
  useEffect(()=>{apiFetch("/bookings/mine").then(setBookings).catch(e=>toast.error(e.message)).finally(()=>setLoading(false));},[]);
  async function confirmCancel(){ try{const updated=await apiFetch(`/bookings/${cancel._id}/cancel`,{method:"PATCH"}); setBookings(list=>list.map(b=>b._id===cancel._id?updated:b)); setCancel(null); toast.success("Booking cancelled");}catch(e){toast.error(e.message);} }
  return <section className="section">
    <div className="container">
      <div className="page-title-row">
        <div><span className="eyebrow">Your learning schedule</span><h1>My Booked Sessions</h1><p className="muted">Only sessions booked with your logged-in account appear here.</p></div></div>{loading?<div className="page-loader compact"><div className="spinner"/></div>:bookings.length?<div className="table-wrap surface"><table><thead><tr><th>Tutor Name</th><th>Student Name</th><th>Email</th><th>Session Token</th><th>Status</th><th>Action</th></tr></thead><tbody>{bookings.map(b=><tr key={b._id}><td><b>{b.tutorName}</b><small>{b.subject}</small></td><td>{b.studentName}</td><td>{b.studentEmail}</td><td><code>{b.sessionToken}</code></td><td><span className={`status-pill ${b.status}`}>{b.status}</span></td><td><button className="mini-btn danger-btn" disabled={b.status==="cancelled"} onClick={()=>setCancel(b)}><XCircle/> Cancel</button></td></tr>)}</tbody></table></div>:<div className="empty"><CalendarX2/><h3>No booked sessions yet</h3><p>Book a tutor and your digital session token will appear here.</p></div>}</div>{cancel&&<div className="modal-backdrop"><div className="confirm-modal surface"><TicketCheck/><h2>Cancel this session?</h2><p>Your booking with <b>{cancel.tutorName}</b> will be marked as cancelled.</p><div className="modal-actions"><button className="btn btn-secondary" onClick={()=>setCancel(null)}>Go back</button><button className="btn btn-danger" onClick={confirmCancel}>Confirm Cancel</button></div></div></div>}</section>;
}
