import { Button } from "@/components/ui/button";
import { usePutDynamicBasedata } from "@/lib/hooks/useBasedata";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
interface basedataDetailsModalProps {
  intialdata: {
    id?: string;
    name?: string;
    code?: string;
    description?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  servicename?: string;
  coloumn_name?: string;
  foriegnData?: string;
}
interface resultdata {
  result: dynamicResponse[];
}
interface dynamicResponse {
  id: string;
  name: string;
  code: string;
  continent: string;
  created_by: string;
  updated_by: string;
  created_date: string;
  updated_date: string;
}
interface dynamicResponsedata {
  message: string;
  code: number;
  data: resultdata;
}

export default function UpdateBasedataFormDynamic({
  isOpen,
  intialdata,
  onClose,
  servicename,
  coloumn_name,
  foriegnData,
}: basedataDetailsModalProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    id: intialdata?.id || "",
    name: intialdata?.name || "",
    code: intialdata?.code || "",
    description: intialdata?.description || "",
    [coloumn_name || ""]: coloumn_name
      ? intialdata?.[coloumn_name as keyof typeof intialdata] || ""
      : "",
  });

  // Fetch roles from API
  const { data: dynamicResponsedata, isLoading: rolesLoading } =
    useQuery<dynamicResponsedata>({
      queryKey: [`${foriegnData}`],
      queryFn: async () => {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get<dynamicResponsedata>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting/${foriegnData}/${servicename === "annotation" ? "" : "all"}`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );
        return response.data;
      },
      enabled: !!session?.access_token,
    });

  const addbasedataMutation = usePutDynamicBasedata(servicename || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addbasedataMutation.mutateAsync({
        id: formData.id,
        name: formData.name,
        code: formData.code,
        description: formData.description,
        [coloumn_name || ""]: formData[coloumn_name || ""],
      });
      onClose();
    } catch (error) {}
  };
  return (
    <div className="it" onClick={onClose}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Update this {servicename}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 mb-2"> Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                required
              />
            </div>

            {servicename === "dialect" ||
            servicename === "sector" ||
            servicename === "annotation" ||
            servicename === "annotation-type" ||
            servicename === "flag-type" ||
            servicename === "rejection-type" ? (
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-gray-700 mb-2">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </>
            )}
            {servicename === "sector" ||
            servicename === "annotation-type" ||
            servicename === "rejection-type" ||
            servicename === "flag-type" ? (
              <></>
            ) : (
              <div>
                <label className="block text-gray-700 mb-2">
                  {foriegnData}*
                </label>
                <select
                  value={formData[coloumn_name || ""]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [coloumn_name || ""]: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  required
                  disabled={rolesLoading}
                >
                  <option value="">Select {foriegnData}</option>
                  {Array.isArray(dynamicResponsedata?.data) &&
                    dynamicResponsedata.data.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
                {rolesLoading && (
                  <p className="text-sm text-gray-500">Loading ...</p>
                )}
              </div>
            )}
          </div>

          <div className="fixed bottom-0 right-0 p-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addbasedataMutation.isPending}>
              {addbasedataMutation.isPending ? "Updating..." : ` update  `}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
