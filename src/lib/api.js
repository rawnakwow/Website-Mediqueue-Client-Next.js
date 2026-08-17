import { authClient } from "@/lib/auth-client";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

const TOKEN_KEY = "mediqueue-jwt";

let tokenRequest = null;

function removeStoredToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function decodeTokenPayload(token) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Malformed JWT");
  }

  const base64URL = parts[1];
  const base64 = base64URL
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const paddedBase64 = base64.padEnd(
    Math.ceil(base64.length / 4) * 4,
    "="
  );

  return JSON.parse(atob(paddedBase64));
}

function readCachedToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return null;
  }

  try {
    const payload = decodeTokenPayload(token);

    const expiresAt = Number(payload.exp) * 1000;

    if (
      Number.isFinite(expiresAt) &&
      expiresAt > Date.now() + 30_000
    ) {
      return token;
    }
  } catch {
    // The invalid token is removed below.
  }

  removeStoredToken();

  return null;
}

export async function getAccessToken({
  force = false,
} = {}) {
  if (!force) {
    const cachedToken = readCachedToken();

    if (cachedToken) {
      return cachedToken;
    }
  }

  if (!tokenRequest) {
    tokenRequest = (async () => {
      try {
        const { data, error } =
          await authClient.token();

        if (error || !data?.token) {
          removeStoredToken();
          return null;
        }

        if (typeof window !== "undefined") {
          localStorage.setItem(
            TOKEN_KEY,
            data.token
          );
        }

        return data.token;
      } catch {
        removeStoredToken();
        return null;
      } finally {
        tokenRequest = null;
      }
    })();
  }

  return tokenRequest;
}

async function readResponse(response) {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => ({}));
  }

  const text = await response.text().catch(() => "");

  return text ? { message: text } : {};
}

export async function apiFetch(
  path,
  options = {}
) {
  const {
    public: isPublic = false,
    headers = {},
    ...requestOptions
  } = options;

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  let token = isPublic
    ? null
    : await getAccessToken();

  /*
   * Do not send protected API requests without a JWT.
   */
  if (!isPublic && !token) {
    throw new Error(
      "Please log in before using this feature"
    );
  }

  async function makeRequest() {
    const bodyIsFormData =
      requestOptions.body instanceof FormData;

    const hasBody =
      requestOptions.body !== undefined &&
      requestOptions.body !== null;

    return fetch(`${API_URL}${normalizedPath}`, {
      ...requestOptions,

      cache:
        requestOptions.cache || "no-store",

      headers: {
        ...(hasBody && !bodyIsFormData
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...headers,
      },
    });
  }

  let response = await makeRequest();

  /*
   * Refresh the JWT once if the API rejects it.
   */
  if (
    response.status === 401 &&
    !isPublic
  ) {
    removeStoredToken();

    token = await getAccessToken({
      force: true,
    });

    if (!token) {
      throw new Error(
        "Your session has expired. Please log in again"
      );
    }

    response = await makeRequest();
  }

  const payload = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      payload.message ||
        `Request failed with status ${response.status}`
    );
  }

  return payload;
}

export async function uploadImage(file) {
  const apiKey =
    process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_IMGBB_API_KEY is not configured"
    );
  }

  if (!file) {
    throw new Error(
      "Please select an image"
    );
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body,
    }
  );

  const result = await response
    .json()
    .catch(() => ({}));

  if (
    !response.ok ||
    !result.success ||
    !result.data?.display_url
  ) {
    throw new Error(
      result?.error?.message ||
        "Image upload failed"
    );
  }

  return result.data.display_url;
}