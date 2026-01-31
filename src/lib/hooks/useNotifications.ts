import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface NotificationCountResponse {
  message: string;
  code: number;
  data: number;
}

interface Notification {
  id: string;
  user_id: string;
  role_id: string | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  is_actionable: boolean;
  action_url: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_date: string;
  updated_date: string;
}

interface NotificationsResponse {
  message: string;
  code: number;
  data: {
    result: Notification[];
    total: number;
    page: string;
    limit: string;
    totalPages: number;
  };
}

// Hook to get notification count
export const useNotificationCount = () => {
  const { data: session } = useSession();

  return useQuery<NotificationCountResponse>({
    queryKey: ["notificationCount"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/count-new`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notification count");
      }

      return response.json();
    },
    enabled: !!session?.access_token,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook to get notifications list
export const useNotifications = (page: number = 1, limit: number = 10) => {
  const { data: session } = useSession();

  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/me?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      return response.json();
    },
    enabled: !!session?.access_token,
  });
};

// Hook to mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notification queries
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
    },
  });
};

// Hook to mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/mark-all-read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notification queries
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
    },
  });
};

export type { Notification, NotificationCountResponse, NotificationsResponse };