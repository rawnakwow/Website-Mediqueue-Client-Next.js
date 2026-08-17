"use client";

import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import { authClient } from "@/lib/auth-client";

function validatePassword(value) {
  if (value.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(value)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(value)) return "Password must contain a lowercase letter";
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const submittedPassword = String(form.get("password"));
    const validation = validatePassword(submittedPassword);
    setPasswordError(validation || "");
    if (validation) return;

    setLoading(true);
    const result = await authClient.signUp.email({
      name: form.get("name"),
      email: form.get("email"),
      password: submittedPassword,
      image: form.get("image") || undefined,
      callbackURL: "/login",
    });

    if (result.error) {
      setLoading(false);
      toast.error(result.error.message || "Registration failed");
      return;
    }

    await authClient.signOut();
    setLoading(false);
    toast.success("Registration successful. Please login.");
    router.push("/login");
    router.refresh();
  }

  async function google() {
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
      if (result?.error) toast.error(result.error.message || "Google sign-in is not configured yet");
    } catch {
      toast.error("Google sign-in is not configured yet");
    }
  }

  const passwordChecks = [
    { label: "6 or more characters", pass: password.length >= 6 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "One lowercase letter", pass: /[a-z]/.test(password) },
  ];

  return (
    <AuthShell title="Register" subtitle="Create your student or tutor account.">
      <Form className="auth-fields" onSubmit={submit}>
        <TextField isRequired name="name">
          <Label>Name</Label>
          <Input placeholder="Your full name" variant="secondary" />
          <FieldError />
        </TextField>

        <TextField isRequired name="email" type="email">
          <Label>Email</Label>
          <Input placeholder="you@example.com" variant="secondary" />
          <FieldError />
        </TextField>

        <TextField name="image" type="url">
          <Label>Photo URL</Label>
          <Input placeholder="https://example.com/photo.jpg" variant="secondary" />
          <FieldError />
        </TextField>

        <TextField isRequired name="password" type="password" minLength={6}>
          <Label>Password</Label>
          <Input
            placeholder="Uppercase + lowercase + 6 characters"
            variant="secondary"
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordError(validatePassword(event.target.value) || "");
            }}
          />
          <FieldError />
          {passwordError && <small className="form-error">{passwordError}</small>}
        </TextField>

        <div className="password-checks" aria-label="Password requirements">
          {passwordChecks.map((check) => <span className={check.pass ? "pass" : ""} key={check.label}>{check.pass ? <Check /> : <Circle />} {check.label}</span>)}
        </div>

        <Button type="submit" isPending={loading} isDisabled={Boolean(passwordError)} className="w-full auth-submit">
          Register
        </Button>
      </Form>

      <div className="or"><span>or</span></div>

      <Button className="google-btn" variant="secondary" onPress={google}>
        <span className="google-g" aria-hidden="true">G</span> Continue with Google
      </Button>

      <p className="auth-switch">Already registered? <Link href="/login">Login here</Link></p>
    </AuthShell>
  );
}
