"use client";
import { SessionProvider } from "next-auth/react";
import { ReactQueryProvider } from "@/providers";
import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useEffect } from "react";
import TopBar from "@/app/components/layout/TopBar";
import {AuthInitializer} from "@/app/components/auth/AuthInitializer";

export default function ClientLayout({
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
        const mobile = window.innerWidth <= 768; // Assuming 768px as the mobile breakpoint
        setIsMobile(mobile);
        if (mobile) {
          setIsSidebarOpen(false); // Close sidebar by default on mobile
        } else {
          setIsSidebarOpen(true); // Open sidebar by default on larger screens
        }
      }
    };

    if (typeof window !== "undefined") {
      handleResize(); // Initial check
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    
      <ReactQueryProvider>
        <AuthInitializer />
        <div className="flex">
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
          <div className={`flex-1 flex flex-col  ${
                isSidebarOpen && !isMobile ? "ml-64" : "ml-0 w-full"
              }` }>
            <TopBar
              title=""
              
              toggleSidebarAction={toggleSidebar}
              isMobile={isMobile}
              isSidebarOpen={isSidebarOpen}
            />
            <main
              className={`flex-1 p-8 bg-white transition-all duration-300`}
            >
              {children}
            </main>
          </div>
        </div>
      </ReactQueryProvider>
    
  );
}
