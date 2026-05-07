"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import TopBar from "@/app/components/layout/TopBar";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isMobile={isMobile} />
      <div className={`flex-1 flex flex-col ${isSidebarOpen && !isMobile ? "ml-64" : "ml-0 w-full"}`}>
        <TopBar
          title={t('helpSupport')}
          toggleSidebarAction={() => setIsSidebarOpen(!isSidebarOpen)}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 px-4 py-4 bg-white">{children}</main>
      </div>
    </div>
  );
}
