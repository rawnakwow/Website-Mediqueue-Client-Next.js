"use client";
import { CalendarRange, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import TutorCard from "@/components/TutorCard";
import { API_URL } from "@/lib/api";

const subjects = ["", "Mathematics", "Physics", "Chemistry", "Biology", "English", "ICT", "Accounting", "Bangla", "Other"];

function TutorsDirectory(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = {
    name: searchParams.get("name") || "",
    subject: searchParams.get("subject") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  };
  const [query,setQuery] = useState(initial);
  const [applied,setApplied] = useState(initial);
  const [tutors,setTutors] = useState([]);
  const [loading,setLoading] = useState(true);
  const [failed,setFailed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(applied).forEach(([key,value]) => value && params.set(key,value));
    fetch(`${API_URL}/tutors?${params}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load tutors");
        return response.json();
      })
      .then(setTutors)
      .catch(() => {
        setTutors([]);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, [applied]);

  function submit(event){
    event.preventDefault();
    if (query.startDate && query.endDate && query.startDate > query.endDate) {
      toast.error("The start date must be before the end date");
      return;
    }
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key,value]) => value && params.set(key,value));
    router.replace(params.size ? `/tutors?${params}` : "/tutors", { scroll: false });
    setLoading(true);
    setFailed(false);
    setApplied(query);
  }

  function reset(){
    const empty={name:"",subject:"",startDate:"",endDate:""};
    setQuery(empty);
    setLoading(true);
    setFailed(false);
    setApplied(empty);
    router.replace("/tutors", { scroll: false });
  }

  const hasFilters = Object.values(applied).some(Boolean);

  return <><section className="page-head tutor-directory-head"><div className="page-head-orb"/><div className="container"><span className="eyebrow"><Sparkles/> Tutor directory</span><h1>Find your next learning partner.</h1><p>Search by name, explore a subject, or filter tutors by their registration date.</p><form className="tutor-search surface" onSubmit={submit}><label><span>Tutor name</span><input value={query.name} onChange={event=>setQuery({...query,name:event.target.value})} placeholder="e.g. Ayesha Rahman"/></label><label><span>Subject</span><select value={query.subject} onChange={event=>setQuery({...query,subject:event.target.value})}>{subjects.map((subject)=><option value={subject} key={subject || "all"}>{subject || "All subjects"}</option>)}</select></label><label><span>Added from</span><input type="date" value={query.startDate} onChange={event=>setQuery({...query,startDate:event.target.value})}/></label><label><span>Added to</span><input type="date" value={query.endDate} onChange={event=>setQuery({...query,endDate:event.target.value})}/></label><button className="btn btn-accent"><Search size={17}/> Search</button></form></div></section><section className="section"><div className="container"><div className="results-row"><div><span className="results-kicker"><CalendarRange/> Updated directory</span><p><b>{tutors.length}</b> {tutors.length === 1 ? "tutor" : "tutors"} found {hasFilters && <small>with your filters</small>}</p></div>{hasFilters&&<button className="link-btn" onClick={reset}>Clear all filters</button>}</div>{loading ? <div className="grid-cards">{[1,2,3,4,5,6].map(item=><div className="skeleton-card" key={item}/>)}</div> : failed ? <div className="empty"><SlidersHorizontal/><h3>The tutor directory is unavailable</h3><p>Make sure the Express API is running, then try again.</p></div> : tutors.length ? <div className="grid-cards">{tutors.map(tutor=><TutorCard key={tutor._id} tutor={tutor}/>)}</div> : <div className="empty"><SlidersHorizontal/><h3>No tutors found</h3><p>Try another tutor name, subject, or a wider date range.</p><button className="btn btn-secondary" onClick={reset}>Reset filters</button></div>}</div></section></>;
}

export default function TutorsPage(){
  return <Suspense fallback={<div className="page-loader"><div className="spinner"/><p>Preparing tutor search…</p></div>}><TutorsDirectory/></Suspense>;
}
