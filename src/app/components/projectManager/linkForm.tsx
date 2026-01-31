"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const submitEmail = async ({
  invitationLinkId,
  email,
}: {
  invitationLinkId: string;
  email: string;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/project-mgmt/invitation/${invitationLinkId}/submit-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );
  if (!response.ok) throw new Error("Failed to submit email");
  return response.json();
};

const LinkForm: React.FC = () => {
  const router = useRouter();
  const { invitation_link_id } = useParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

//   const mutation = useMutation({
//     mutationFn: submitEmail,
//     onSuccess: () => {
//       router.push("/login?message=Email submitted successfully");
//     },
//     onError: (err: Error) => {
//       setError(err.message || "Invalid or expired invitation link");
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }
//     setError(null);
//     mutation.mutate({ invitationLinkId: invitation_link_id as string, email });
//   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Join Project
        </h2>
        <form  className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          After submitting, you will be redirected to log in or sign up.
        </p>
      </div>
    </div>
  );
};

export default LinkForm;
