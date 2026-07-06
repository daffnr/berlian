"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const activeTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setTheme(nextTheme);
  };

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder untuk menghindari pergeseran tata letak
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 shrink-0 shadow-sm"
      title={theme === "light" ? "Aktifkan Mode Gelap" : "Aktifkan Mode Terang"}
    >
      {theme === "light" ? (
        <Moon className="h-4.5 w-4.5 text-cyan-600 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun className="h-4.5 w-4.5 text-yellow-400 transition-transform duration-500 hover:rotate-45" />
      )}
    </button>
  );
}
