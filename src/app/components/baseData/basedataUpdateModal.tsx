// components/basedata-details-modal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogLeft";
import { Basedata } from "@/app/types/basedate";
import { useState, useEffect } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { usePutBasedata } from "@/lib/hooks/useBasedata";
import { useSession } from "next-auth/react";
interface basedataDetailsModalProps {
  initialData: Basedata | null;
  isOpen: boolean;
  onClose: () => void;
  servicename?: string;
}
interface basedataUpdateModal {
  onClose: () => void;
  initialData?: Basedata;
  servicename?: string;
  isOpen?: boolean;
}

export function BasedataUpdateModal({
  onClose,
  initialData,
  servicename,
  isOpen,
}: basedataDetailsModalProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    ...(servicename === "country" && { continent: "" }),
  });
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code || "",
        description: initialData.description || "",
        ...(servicename === "country" && { continent: formData.continent }),
      });
    }
  }, [initialData]);

  const updateBasedataMutation = usePutBasedata(servicename || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBasedataMutation.mutateAsync({
        id: initialData?.id || "",
        name: formData.name,
        code: formData.code,
        description: formData.description,
      });
      onClose();
    } catch (error) {}
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <p className="mb-8 font-bold ">Basedata Information</p>
          </DialogHeader>
        </DialogContent>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2"> Name*</label>
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

              {servicename === "dialect" ? (
                <div>
                  <label className="block text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              ) : (
                <div>
                  {" "}
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
              )}
            </div>

            <div className="fixed bottom-0 right-0 p-4 flex justify-end space-x-2 ">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateBasedataMutation.isPending}>
                {updateBasedataMutation.isPending ? "Creating..." : `Update`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
