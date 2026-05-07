import { create } from "zustand";
import { Session } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

type User = NonNullable<Session["user"]>;

type UserRole = "SuperAdmin" | "ProjectManager" | "Facilitator" | "Reviewer" | "QualityAssurance";
interface ExtendedUser {
  id: string;
  role: UserRole;
  profile_picture: string | null;
  email: string;
  name?: string | null;
  username: string;
  access_token: string;
  first_name: string;
  last_name: string;
  middle_name: string;
}

interface AuthState {
  user: ExtendedUser | null;
  expires_at: number | null;
  setAuth: (user: ExtendedUser | null, expires_at: number | null) => void;
  setUser: (user: ExtendedUser | null) => void;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isFacilitator: () => boolean;
  isReviewer: () => boolean;
  isQualityAssurance: () => boolean;
  checkSessionExpiry: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  expires_at: null,
  setAuth: (user, expires_at) => set({ user, expires_at }),
  setUser: (user) => set({ user }),
  isSuperAdmin: () => get().user?.role === "SuperAdmin",
  isAdmin: () => get().user?.role === "ProjectManager",
  isFacilitator: () => get().user?.role === "Facilitator",
  isReviewer: () => get().user?.role === "Reviewer",
  isQualityAssurance: () => get().user?.role === "QualityAssurance",
  checkSessionExpiry: () => {
    const { expires_at } = get();
    if (!expires_at) return false;
    return Date.now() >= expires_at;
  },
}));

export const useSyncAuthStore = () => {
  const { data: session, status } = useSession();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Use expires_at from session if available, otherwise calculate 24 hours from now
      const expiryTime = session.user.expires_at || (Date.now() + (24 * 60 * 60 * 1000));
      setAuth(session.user as ExtendedUser, expiryTime);
    } else if (status === "unauthenticated") {
      setAuth(null, null);
    }
  }, [session, status, setAuth]);

  // Don't check for expiry here - let useSessionExpiry hook handle it
  // This prevents duplicate logout attempts
};