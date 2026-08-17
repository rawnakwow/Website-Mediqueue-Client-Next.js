import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
export async function proxy(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/add-tutor", "/my-tutors", "/my-bookings", "/profile", "/tutors/:id"],
};
