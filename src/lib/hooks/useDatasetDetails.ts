import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";

export const useDatasetDetails = (datasetId: string | null) => {
  const { data: session } = useSession();

  console.log("[useDatasetDetails] Hook called with datasetId:", datasetId, "session available:", !!session?.access_token);

  return useQuery({
    queryKey: ["datasetDetails", datasetId],
    queryFn: async () => {
      if (!datasetId) {
        console.log("[useDatasetDetails] No datasetId provided");
        return null;
      }

      if (!session?.access_token) {
        console.log("[useDatasetDetails] No access token available");
        return null;
      }

      try {
        console.log("[useDatasetDetails] Fetching dataset details for:", datasetId);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/data-set/details/${datasetId}`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );

        console.log("[useDatasetDetails] Dataset details fetched successfully:", response.data.data);
        return response.data.data;
      } catch (error) {
        console.error("[useDatasetDetails] Error fetching dataset details:", error);
        return null;
      }
    },
    enabled: !!datasetId && !!session?.access_token,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
};
