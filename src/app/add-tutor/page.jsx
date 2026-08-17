"use client";
/* eslint-disable @next/next/no-img-element -- previews can use local blob URLs or arbitrary user-provided hosts */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, CheckCircle2, ImagePlus, PlusCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { apiFetch, uploadImage } from "@/lib/api";

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "ICT", "Accounting", "Bangla", "Other"];

export default function AddTutorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const file = form.get("photoFile");
      const url = String(form.get("photo") || "").trim();
      if (!file?.size && !url) throw new Error("Upload a tutor photo or add a photo URL");

      const photo = file?.size ? await uploadImage(file) : url;
      const payload = {
        tutorName: form.get("tutorName"),
        photo,
        subject: form.get("subject"),
        availableDays: form.get("availableDays"),
        availableTimeSlot: form.get("availableTimeSlot"),
        hourlyFee: Number(form.get("hourlyFee")),
        totalSlot: Number(form.get("totalSlot")),
        sessionStartDate: form.get("sessionStartDate"),
        institutionExperience: form.get("institutionExperience"),
        location: form.get("location"),
        teachingMode: form.get("teachingMode"),
      };

      await apiFetch("/tutors", { method: "POST", body: JSON.stringify(payload) });
      toast.success("Tutor added successfully");
      router.push("/my-tutors");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section add-tutor-section">
      <div className="container form-page">
        <div className="form-intro">
          <span className="eyebrow"><Sparkles /> Create tutor profile</span>
          <h1>Add a tutor to MediQueue.</h1>
          <p className="muted">Share accurate availability, fee, and teaching details. Your signed-in account is attached automatically.</p>
          <div className="form-trust-row">
            <span><ShieldCheck /> Private, authenticated submission</span>
            <span><CalendarDays /> Date-aware booking rules</span>
          </div>
        </div>

        <div className="form-layout">
          <aside className="form-aside surface">
            <div className="photo-preview">
              {photoPreview ? <img src={photoPreview} alt="Tutor preview" /> : <><ImagePlus /><span>Photo preview</span></>}
            </div>
            <h2>A complete profile books faster.</h2>
            <ul>
              <li><CheckCircle2 /> Use a clear, professional portrait</li>
              <li><CheckCircle2 /> Add the exact available days and hours</li>
              <li><CheckCircle2 /> Keep the slot count realistic</li>
            </ul>
          </aside>

          <form className="main-form surface" onSubmit={submit}>
            <div className="form-grid">
              <label className="field form-wide"><span>Tutor Name</span><input className="input" name="tutorName" required placeholder="e.g. Ayesha Rahman" /></label>
              <label className="field"><span>Subject / Category</span><select className="input" name="subject" required>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
              <label className="field"><span>Teaching Mode</span><select className="input" name="teachingMode"><option>Online</option><option>Offline</option><option>Both</option></select></label>
              <label className="field"><span>Available Days</span><input className="input" name="availableDays" required placeholder="Sun - Thu" /></label>
              <label className="field"><span>Available Time Slot</span><input className="input" name="availableTimeSlot" required placeholder="5:00 PM - 8:00 PM" /></label>
              <label className="field"><span>Hourly Fee (BDT)</span><input className="input" type="number" min="1" name="hourlyFee" required placeholder="900" /></label>
              <label className="field"><span>Total Slot</span><input className="input" type="number" min="1" name="totalSlot" required placeholder="12" /></label>
              <label className="field"><span>Session Start Date</span><input className="input" type="date" min={today} name="sessionStartDate" required /></label>
              <label className="field"><span>Location (Area/City)</span><input className="input" name="location" required placeholder="Dhanmondi, Dhaka" /></label>
              <label className="field form-wide"><span>Institution & Experience</span><textarea className="input" rows="3" name="institutionExperience" required placeholder="BUET graduate · 4 years teaching experience" /></label>
              <label className="field"><span><ImagePlus size={15} /> Upload Photo (ImgBB)</span><input className="input file-input" type="file" accept="image/*" name="photoFile" onChange={(event) => { const file = event.target.files?.[0]; setPhotoPreview(file ? URL.createObjectURL(file) : ""); }} /></label>
              <label className="field"><span>Or Photo URL</span><input className="input" type="url" name="photo" placeholder="https://..." onChange={(event) => setPhotoPreview(event.target.value)} /></label>
            </div>
            <Button type="submit" isPending={loading} className="btn btn-primary submit-tutor-btn"><PlusCircle size={17} />{loading ? "Adding tutor…" : "Submit Tutor"}</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
