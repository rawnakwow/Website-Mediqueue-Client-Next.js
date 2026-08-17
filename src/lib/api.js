import { authClient } from "@/lib/auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

let tokenRequest = null;

function readCachedToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("mediqueue-jwt");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp * 1000 > Date.now() + 30_000) return token;
  } catch {
    // A malformed or legacy token is replaced below.
  }

  localStorage.removeItem("mediqueue-jwt");
  return null;
}

export async function getAccessToken({ force = false } = {}) {
  if (!force) {
    const cached = readCachedToken();
    if (cached) return cached;
  }

  if (!tokenRequest) {
    tokenRequest = authClient
      .token()
      .then(({ data, error }) => {
        if (error || !data?.token) return null;
        if (typeof window !== "undefined") localStorage.setItem("mediqueue-jwt", data.token);
        return data.token;
      })
      .finally(() => {
        tokenRequest = null;
      });
  }

  return tokenRequest;
}

export async function apiFetch(path, options = {}) {
  const { public: isPublic = false, headers, ...requestOptions } = options;
  let token = isPublic ? null : await getAccessToken();

  const request = () =>
    fetch(`${API_URL}${path}`, {
      ...requestOptions,
      cache: requestOptions.cache || "no-store",
      headers: {
        ...(requestOptions.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

  let response = await request();
  if (response.status === 401 && !isPublic) {
    if (typeof window !== "undefined") localStorage.removeItem("mediqueue-jwt");
    token = await getAccessToken({ force: true });
    if (token) response = await request();
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Request failed");
  return payload;
}

export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_IMGBB_API_KEY is not configured");
  const body = new FormData();
  body.append("image", file);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
  const result = await response.json();
  if (!result.success) throw new Error("Image upload failed");
  return result.data.display_url;
}
