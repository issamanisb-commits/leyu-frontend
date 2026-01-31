import { Button } from "@/components/ui/button";
import { usePutUser } from "@/lib/hooks/useFetchUser"; // Ensure the path and export are correct
import { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Role {
  id: string;
  name: string;
  description: string; // Added description property
}
interface RolesResponse {
  message: string;
  code: number;
  data: Role[];
}
interface UserFormProps {
  onClose: () => void;
  initialData?: {
    id?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    birth_date: string;
    gender: string;
    role_id: string;
    project?: string;
    role?: string;
    status?: string;
    created_date?: string;
    password?: string;
    is_active?: boolean; // Added is_active property
  };
}
export default function UpdateUserForm({
  onClose,
  initialData,
}: UserFormProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    birth_date: "",
    gender: "",
    role_id: "",
  });
  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name,
        middle_name: initialData.middle_name || "",
        last_name: initialData.last_name,
        email: initialData.email,
        password: "",
        birth_date: initialData.birth_date,
        gender: initialData.gender,
        role_id: initialData.role_id,
      });
    }
  }, [initialData]);

  const { data: rolesResponse, isLoading: rolesLoading } =
    useQuery<RolesResponse>({
      queryKey: ["roles"],
      queryFn: async () => {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get<RolesResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/iam/auth/roles`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );
        return response.data;
      },
      enabled: !!session?.access_token,
    });

  const updateUserMutation = usePutUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserMutation.mutateAsync({
        id: initialData?.id || "",
        created_date: initialData?.created_date || "",
        status: initialData?.status ?? "",
        is_active: initialData?.is_active ?? true,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        email: formData.email,
        birth_date: JSON.stringify(formData.birth_date),
        gender: formData.gender,
        role_id: formData.role_id,
        password: formData.password,
        ...(!initialData && { password: formData.password }),
      });
      onClose();
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">First Name*</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Middle Name (Father Name)</label>
          <input
            type="text"
            value={formData.middle_name}
            onChange={(e) =>
              setFormData({ ...formData, middle_name: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Last Name (Grandfather Name)*</label>
        <input
          type="text"
          value={formData.last_name}
          onChange={(e) =>
            setFormData({ ...formData, last_name: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Email*</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Password*</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          required
          minLength={6}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Birth Date*</label>
        <input
          type="date"
          value={formData.birth_date}
          onChange={(e) =>
            setFormData({ ...formData, birth_date: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Gender*</label>
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Role*</label>
        <select
          value={formData.role_id}
          onChange={(e) =>
            setFormData({ ...formData, role_id: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          required
          disabled={rolesLoading}
        >
          <option value="">Select Role</option>
          {rolesResponse?.data?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name} - {role.description}
            </option>
          ))}
        </select>
        {rolesLoading && (
          <p className="text-sm text-gray-500">Loading roles...</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateUserMutation.isPending || rolesLoading}
        >
          {updateUserMutation.isPending ? "Creating..." : "Update User"}
        </Button>
      </div>
    </form>
  );
}
