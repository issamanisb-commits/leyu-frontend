"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import TopBar from "@/app/components/layout/TopBar";

export default function LinkFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        if (mobile) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      }
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
