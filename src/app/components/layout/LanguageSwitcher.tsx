"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/context/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();

  const [open, setOpen] = useState(true); // 👈 force open
 const { data: session } = useSession();
  const handleLanguageChange = (value: string) => {
   
    setLanguage(value);
    if (!session?.access_token) {
      throw new Error("No authentication token available");
    }
    axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/iam/users/preferred-language`,
      {
        language_key: value,
      },
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    );
    setOpen(false); // close after select (optional)
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div onMouseDown={handleMouseDown} onClick={(e) => e.stopPropagation()}>
      <Select
        value={currentLanguage}
        onValueChange={handleLanguageChange}
        open={open} // 👈 CONTROLLED
        onOpenChange={setOpen} // 👈 CONTROLLED
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>

        <SelectContent className="p-1">
          {availableLanguages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="
                cursor-pointer rounded-md px-2 py-2 text-sm
                data-[state=checked]:bg-[#095FAF]
                data-[state=checked]:text-white
                hover:bg-gray-100
              "
            >
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
