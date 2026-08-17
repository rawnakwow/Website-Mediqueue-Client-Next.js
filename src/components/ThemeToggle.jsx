"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return <button className="icon-btn" title={`Use ${dark ? "light" : "dark"} theme`} aria-label={`Use ${dark ? "light" : "dark"} theme`} onClick={() => setTheme(dark ? "light" : "dark")}>{dark ? <Sun size={18}/> : <Moon size={18}/>}<span className="icon-tooltip">{dark ? "Light" : "Dark"}</span></button>;
}
