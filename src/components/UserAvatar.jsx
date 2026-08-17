/* eslint-disable @next/next/no-img-element -- profile URLs can come from Google or any user-provided host */
export default function UserAvatar({ name = "User", src, size = 36 }) {
  const initials = String(name || "U").split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();
  if (src) return <img className="avatar" src={src} alt={name || "User"} referrerPolicy="no-referrer" style={{ width: size, height: size }} />;
  return <span className="avatar avatar-fallback" style={{ width: size, height: size }}>{initials}</span>;
}
