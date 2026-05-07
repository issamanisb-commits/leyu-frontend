// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {

  interface User {
    id: string;
    role: "SuperAdmin" | "ProjectManager" | "Facilitator" | "Reviewer" | "QualityAssurance";
  }


  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "SuperAdmin" | "ProjectManager" | "Facilitator" | "Reviewer" | "QualityAssurance";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {

  interface JWT {
    id: string;
    role: "SuperAdmin" | "ProjectManager" | "Facilitator" | "Reviewer" | "QualityAssurance";
  }
}