"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import { authClient } from "@/lib/auth-client";
import { getAccessToken } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);
  const requestedCallback = search.get("callbackUrl") || "/";
  const callbackURL = requestedCallback.startsWith("/") && !requestedCallback.startsWith("//") ? requestedCallback : "/";

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: form.get("email"),
      password: form.get("password"),
      callbackURL,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error.message || "Login failed");
      return;
    }

    await getAccessToken({ force: true });
    toast.success("Welcome back");
    router.push(callbackURL);
    router.refresh();
  }

  async function google() {
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL });
      if (result?.error) toast.error(result.error.message || "Google sign-in is not configured yet");
    } catch {
      toast.error("Google sign-in is not configured yet");
    }
  }

  return (
    <AuthShell title="Login" subtitle="Access your tutor and session dashboard.">
      <Button className="google-btn" variant="secondary" onPress={google}>
        <span className="google-g" aria-hidden="true">G</span> Continue with Google
      </Button>

      <div className="or"><span>or use email</span></div>

      <Form className="auth-fields" onSubmit={submit}>
        <TextField isRequired name="email" type="email">
          <Label>Email</Label>
          <Input placeholder="you@example.com" variant="secondary" />
          <FieldError />
        </TextField>

        <TextField isRequired name="password" type="password">
          <Label>Password</Label>
          <Input placeholder="Your password" variant="secondary" />
          <FieldError />
        </TextField>

        <Button
          type="button"
          variant="ghost"
          className="forgot"
          onPress={() => toast("Password recovery is intentionally disabled for assignment review.")}
        >
          Forgot Password?
        </Button>

        <Button type="submit" isPending={loading} className="w-full auth-submit">
          Login
        </Button>
      </Form>

      <p className="auth-switch">New to MediQueue? <Link href="/register">Register here</Link></p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
