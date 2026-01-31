import { Button } from "@/components/ui/button";
import { usePutOrganiztionBasedata } from "@/lib/hooks/useBasedata";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { countryCodes } from "@/app/types/countryCodes";
import { X } from "lucide-react";

interface basedataDetailsModalProps {
  intialdata: {
    id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  servicename?: string;
  coloumn_name?: string;
  foriegnData?: string;
}
interface country {
  id: string;
  name: string;
  description: string;
}
interface countryResponse {
  message: string;
  code: number;
  data: country[];
}
interface region {
  id: string;
  name: string;
  description: string;
}
interface regionResponse {
  message: string;
  code: number;
  data: region[];
}
interface zone {
  id: string;
  name: string;
  description: string;
}
interface zoneResponse {
  message: string;
  code: number;
  data: zone[];
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

export default function UpdateOrganiztionBasedata({
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
    phone: intialdata?.phone || "",
    address: intialdata?.address || "",
    email: intialdata?.email || "",
    city: "",
    country: "",
    region: "",
    subCity: "",
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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting/${foriegnData}`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );
        return response.data;
      },
      enabled: !!session?.access_token,
    });

  const addbasedataMutation = usePutOrganiztionBasedata(servicename || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addbasedataMutation.mutateAsync({
        id: formData.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      });
      onClose();
    } catch (error) {}
  };
  return (
    <div className="it" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg w-full h-full max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Update 
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2"> Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-0 flex-row">
              <div>
                <label className="block text-gray-700 mb-2">
                  Contact number
                </label>
                <div className="flex">
                  <select
                    className="p-2 border border-gray-300 rounded-l focus:outline-none focus:border-primary"
                    style={{ minWidth: "120px" }}
                  >
                    <option disabled value="">
                      Search country code...
                    </option>
                    {countryCodes.map((country) => (
                      <option
                        key={country.code}
                        value={country.dial_code}
                        style={{
                          background: "white",
                          border: "1px solid #D1D5DB",
                          color: "black",
                        }}
                      >
                        {country.name}, {country.dial_code}, {country.flag}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-r focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 mb-2"> Address</label>
                <input
                  type="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addbasedataMutation.isPending}>
              {addbasedataMutation.isPending
                ? "Creating..."
                : ` update ${servicename} basedata`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
