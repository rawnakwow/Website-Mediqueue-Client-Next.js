import { headers } from "next/headers";
import { auth } from "@/lib/auth";
export async function GET() {
  try {
    const { token } = await auth.api.getToken({ headers: await headers() });
    return Response.json({ token: token || null }, { status: token ? 200 : 401 });
  } catch {
    return Response.json({ token: null }, { status: 401 });
  }
}
