"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("stockflow-theme");
    setDark(saved === "dark");
  }, []);

  // Apply and save theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);

    localStorage.setItem("stockflow-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content */}
      <div
        className={[
          "min-h-screen transition-[margin] duration-300 ease-in-out",
          sidebarCollapsed ? "md:ml-[76px]" : "md:ml-[260px]",
        ].join(" ")}
      >
        {/* Topbar */}
        <Topbar
          onMenu={() => setOpen(true)}
          onTheme={() => setDark((prev) => !prev)}
          dark={dark}
        />

        {/* Page Content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
