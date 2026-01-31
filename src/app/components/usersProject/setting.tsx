"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useChangePassword } from "@/lib/hooks/useFetchUser";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { toast } from "sonner";
import axios from "axios";
import { countryCodes } from "@/app/types/countryCodes";

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
export default function SettingsDetailPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const [profile, setProfile] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ")[1] || "",
    country: "",
    region: "",
    zone: "",
    phone: "",
    city: "",
    subCity: "",
    country_id: "",
    region_id: "",
    zone_id: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(200);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [verificationStatus, setVerificationStatus] = useState<string>();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  };

  const { data: countryResponseData, isLoading: countriesLoading } =
    useQuery<countryResponse>({
      queryKey: ["roles"],
      queryFn: async () => {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get<countryResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting/country/all`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );
        return response.data;
      },
      enabled: !!session?.access_token,
    });

  const { data: regionResponseData, isLoading: regionLoading } =
    useQuery<regionResponse>({
      queryKey: ["region"],
      queryFn: async () => {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get<regionResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting/region/all`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );
        return response.data;
      },
      enabled: !!session?.access_token,
    });
  const { data: zoneRponseData, isLoading: zoneoading } =
    useQuery<zoneResponse>({
      queryKey: ["zone"],
      queryFn: async () => {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get<zoneResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting/zone/all`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );
        return response.data;
      },
      enabled: !!session?.access_token,
    });
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryId = e.target.value;
    setProfile((prev) => ({ ...prev, country: selectedCountryId }));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/iam/users/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Image uploaded successfully!");
        setIsModalOpen(false);
        setSelectedImage(null);
        setPreviewImage(null);
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the image.");
    }
  };

  const updatePasswordataMutation = useChangePassword();
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePasswordataMutation.mutateAsync({
        current_password: security.currentPassword,
        new_password: security.newPassword,
      });
    } catch (error) {}
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSecurityChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex border-b border-gray-100 mb-6">
        <button
          className={`pb-2 px-4 font-semibold ${
            activeTab === "profile"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
        <button
          className={`pb-2 px-4 font-semibold ${
            activeTab === "security"
              ? "primary-button border-b-2 border-primary"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>

      {activeTab === "profile" ? (
        <div className="bg-white p-6 rounded-lg ">
          <div className="flex items-center mb-6">
            <Image
              src={session?.user?.profile_picture || "/default-avatar.png"}
              alt="User"
              width={80}
              height={80}
              className="rounded-full mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">{session?.user?.name}</h2>
              <p className="text-gray-600">{session?.user?.email}</p>
              <input
                type="file"
                accept="image/*"
                multiple={false}
                id="imageUpload"
                className="hidden"
                onChange={(e) => {
                  handleImageChange(e);
                  setIsModalOpen(true);
                }}
              />
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-lg font-semibold mb-4">
                      Preview Image
                    </h3>
                    {previewImage && (
                      <div className="mb-4">
                        <Image
                          src={previewImage}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="rounded"
                        />
                      </div>
                    )}
                    <div className="flex justify-end space-x-4">
                      <button
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsModalOpen(false);
                          setSelectedImage(null);
                          setPreviewImage(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
                        onClick={handleImageUpload}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <label
                htmlFor="imageUpload"
                className="mt-2 text-primary border border-primary rounded-full px-4 py-1 hover:bg-blue-50 cursor-pointer"
              >
                Change Image
              </label>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <div className="flex">
                  <select className="p-2 border border-gray-300 rounded-l focus:outline-none focus:border-primary">
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.name}) ({country.flag})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 rounded-r focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Address Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Country</label>
                <select
                  name="country"
                  onChange={(e) =>
                    setProfile({ ...profile, country_id: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                >
                  {countryResponseData?.data.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Region</label>
                <select
                  name="country"
                  onChange={(e) =>
                    setProfile({ ...profile, region_id: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                >
                  {regionResponseData?.data.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Zone</label>
                <select
                  name="zone"
                  onChange={(e) =>
                    setProfile({ ...profile, zone_id: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                >
                  {zoneRponseData?.data.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleProfileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Sub City</label>
                <input
                  type="text"
                  name="subCity"
                  value={profile.subCity}
                  onChange={handleProfileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
              >
                Update Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg ">
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <p className="text-gray-600 mb-6">
            Ensure your account’s security by regularly updating your password.
            Use the form below to create a strong and unique password.
          </p>
          <form onSubmit={handleSecuritySubmit}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={security.currentPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={security.newPassword}
                  onChange={(e) =>
                    setSecurity({ ...security, newPassword: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={security.confirmPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
              >
                Update Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
