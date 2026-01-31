// components/ui/Card.tsx
import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-white p-4  ${className}`}>
      {children}
    </div>
  );
}
