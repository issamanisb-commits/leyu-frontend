"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import TopBar from "@/app/components/layout/TopBar";
export default function DashboardLayout({
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
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen && !isMobile ? "ml-64" : "ml-0 w-full"
        }`}
      >
        <TopBar
          title="Account Setting"
          toggleSidebarAction={toggleSidebar}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
        />
        <main className={`flex-1 px-3 py-4 bg-white transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
}
