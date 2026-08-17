"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ImagePlus,
  PlusCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { apiFetch, uploadImage } from "@/lib/api";

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "ICT",
  "Accounting",
  "Bangla",
  "Other",
];

export default function AddTutorPage() {
  const router = useRouter();
  const sessionDateRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    const now = new Date();

    const localToday = new Date(
      now.getTime() - now.getTimezoneOffset() * 60_000
    )
      .toISOString()
      .slice(0, 10);

    if (sessionDateRef.current) {
      sessionDateRef.current.min = localToday;
    }
  }, []);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    const form = new FormData(event.currentTarget);

    try {
      const file = form.get("photoFile");
      const photoUrl = String(form.get("photo") || "").trim();

      if (!file?.size && !photoUrl) {
        throw new Error(
          "Upload a tutor photo or provide a photo URL"
        );
      }

      const photo = file?.size
        ? await uploadImage(file)
        : photoUrl;

      const payload = {
        tutorName: String(form.get("tutorName") || "").trim(),
        photo,
        subject: form.get("subject"),
        teachingMode: form.get("teachingMode"),
        availableDays: String(
          form.get("availableDays") || ""
        ).trim(),
        availableTimeSlot: String(
          form.get("availableTimeSlot") || ""
        ).trim(),
        hourlyFee: Number(form.get("hourlyFee")),
        totalSlot: Number(form.get("totalSlot")),
        sessionStartDate: form.get("sessionStartDate"),
        location: String(form.get("location") || "").trim(),
        institutionExperience: String(
          form.get("institutionExperience") || ""
        ).trim(),
      };

      await apiFetch("/tutors", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Tutor added successfully");
      router.push("/my-tutors");
    } catch (error) {
      toast.error(error.message || "Could not add tutor");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview("");
    }
  }

  return (
    <section className="section add-tutor-section">
      <div className="container form-page">
        <div className="form-intro">
          <span className="eyebrow">
            <Sparkles />
            Create tutor profile
          </span>

          <h1>Add a tutor to MediQueue.</h1>

          <p className="muted">
            Share accurate availability, fee, and teaching
            details. Your signed-in account is attached
            automatically.
          </p>

          <div className="form-trust-row">
            <span>
              <ShieldCheck />
              Private, authenticated submission
            </span>

            <span>
              <CalendarDays />
              Date-aware booking rules
            </span>
          </div>
        </div>

        <div className="form-layout">
          <aside className="form-aside surface">
            <div className="photo-preview">
              {photoPreview ? (
                <img src={photoPreview} alt="Tutor preview" />
              ) : (
                <>
                  <ImagePlus />
                  <span>Photo preview</span>
                </>
              )}
            </div>

            <h2>A complete profile books faster.</h2>

            <ul>
              <li>
                <CheckCircle2 />
                Use a clear, professional portrait
              </li>

              <li>
                <CheckCircle2 />
                Add the exact available days and hours
              </li>

              <li>
                <CheckCircle2 />
                Keep the slot count realistic
              </li>
            </ul>
          </aside>

          <form
            className="main-form surface"
            onSubmit={submit}
          >
            <div className="form-grid">
              <label className="field form-wide">
                <span>Tutor Name</span>
                <input
                  className="input"
                  name="tutorName"
                  required
                  placeholder="e.g. Ayesha Rahman"
                />
              </label>

              <label className="field">
                <span>Subject / Category</span>
                <select
                  className="input"
                  name="subject"
                  required
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Teaching Mode</span>
                <select
                  className="input"
                  name="teachingMode"
                  required
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Both">Both</option>
                </select>
              </label>

              <label className="field">
                <span>Available Days</span>
                <input
                  className="input"
                  name="availableDays"
                  required
                  placeholder="Saturday, Monday, Wednesday"
                />
              </label>

              <label className="field">
                <span>Available Time Slot</span>
                <input
                  className="input"
                  name="availableTimeSlot"
                  required
                  placeholder="5:00 PM - 8:00 PM"
                />
              </label>

              <label className="field">
                <span>Hourly Fee (BDT)</span>
                <input
                  className="input"
                  type="number"
                  min="1"
                  name="hourlyFee"
                  required
                  placeholder="900"
                />
              </label>

              <label className="field">
                <span>Total Slot</span>
                <input
                  className="input"
                  type="number"
                  min="1"
                  name="totalSlot"
                  required
                  placeholder="12"
                />
              </label>

              <label className="field">
                <span>Session Start Date</span>
                <input
                  ref={sessionDateRef}
                  className="input"
                  type="date"
                  name="sessionStartDate"
                  required
                />
              </label>

              <label className="field">
                <span>Location (Area/City)</span>
                <input
                  className="input"
                  name="location"
                  required
                  placeholder="Dhanmondi, Dhaka"
                />
              </label>

              <label className="field form-wide">
                <span>Institution &amp; Experience</span>
                <textarea
                  className="input"
                  rows="3"
                  name="institutionExperience"
                  required
                  placeholder="BUET graduate · 4 years teaching experience"
                />
              </label>

              <label className="field">
                <span>
                  <ImagePlus size={15} />
                  Upload Photo (ImgBB)
                </span>

                <input
                  className="input file-input"
                  type="file"
                  accept="image/*"
                  name="photoFile"
                  onChange={handleFileChange}
                />
              </label>

              <label className="field">
                <span>Or Photo URL</span>

                <input
                  className="input"
                  type="url"
                  name="photo"
                  placeholder="https://example.com/photo.jpg"
                  onChange={(event) =>
                    setPhotoPreview(event.target.value)
                  }
                />
              </label>
            </div>

            <Button
              type="submit"
              isPending={loading}
              isDisabled={loading}
              className="btn btn-primary submit-tutor-btn"
            >
              <PlusCircle size={17} />
              {loading ? "Adding tutor…" : "Submit Tutor"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}