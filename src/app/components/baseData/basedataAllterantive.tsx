import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialogLeft";
import { Basedata } from "@/app/types/basedate";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAletrantiveNameBasedata } from "@/lib/hooks/useBasedata";
import { useSession } from "next-auth/react";

type LanguageKey =
  | "en"
  | "am"
  | "om"
  | "sid"
  | "tg"
  | "som";

// =========================
// OPTIONS
// =========================
const languageOptions: { value: LanguageKey; label: string }[] = [
  { value: "en", label: "English" },
  { value: "am", label: "Amharic" },
  { value: "om", label: "Afan Oromo" },
  { value: "sid", label: "Sidama" },
  { value: "tg", label: "Tigrigna" },
  { value: "som", label: "Af-Soomaali" },
];

interface Props {
  initialData: Basedata | null;
  isOpen: boolean;
  onClose: () => void;
  servicename?: string;
}

// =========================
// NORMALIZER (key -> language_key)
// =========================
const normalize = (data: any[] = []) => {
  return data.map((item) => ({
    language_key: item.language_key ?? item.key,
    name: item.name,
  }));
};

// =========================
// COMPONENT
// =========================
export function BasedataAllterantiveUpdateModal({
  onClose,
  initialData,
  servicename,
  isOpen,
}: Props) {
  const { data: session } = useSession();

  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    description: string;
    continent?: string;
    alternative_names:
      | { language_key: LanguageKey; name: string }[]
      | null;
  }>({
    name: "",
    code: "",
    description: "",
    alternative_names: null,
     ...(servicename === "country" && { continent: "" }),
  });

  const updateBasedataMutation =
    useAletrantiveNameBasedata(servicename || "");

  // =========================
  // LOAD DATA (normalize backend)
  // =========================
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code || "",
        description: initialData.description || "",
        alternative_names: initialData.alternative_names
          ? normalize(initialData.alternative_names)
          : null,
         ...(servicename === "country" && { continent: initialData.continent ?? undefined }),
      });
    }
  }, [initialData]);

  const safeAlt = formData.alternative_names || [];

  // =========================
  // HANDLERS
  // =========================
  const handleChange = (
    index: number,
    field: "language_key" | "name",
    value: string
  ) => {
    const updated = [...safeAlt];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      alternative_names: updated,
    });
  };

  const addRow = () => {
    setFormData({
      ...formData,
      alternative_names: [
        ...safeAlt,
        { language_key: "en", name: "" },
      ],
    });
  };

  const removeRow = (index: number) => {
    const updated = safeAlt.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      alternative_names:
        updated.length > 0 ? updated : null,
    });
  };

  // =========================
  // SUBMIT (convert back: language_key -> key)
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateBasedataMutation.mutateAsync({
      id: initialData?.id || "",
      name: formData.name,
      code: formData.code,
      description: formData.description,
...(servicename === "country" && { continent: formData.continent}),
      alternative_names: safeAlt.length
        ? safeAlt.map((item) => ({
            key: item.language_key, // 👈 backend expects "key"
            name: item.name,
          }))
        : null,
    });

    onClose();
  };

  // =========================
  // UI
  // =========================
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <p className="font-bold text-lg mb-4">
            Basedata Information
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME + CODE */}
          <div className="grid grid-cols-2 gap-4">
            <input
              value={formData.name}
              readOnly
              className="p-2 border rounded"
            />

            <input
              value={formData.code}
              readOnly
              className="p-2 border rounded"
            />
          </div>

          {/* ALTERNATIVE NAMES */}
          <div>
            <label className="block mb-2 font-medium">
              Alternative Names
            </label>

            {safeAlt.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                {/* LANGUAGE SELECT */}
                <select
                  value={item.language_key}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "language_key",
                      e.target.value
                    )
                  }
                  className="w-1/3 p-2 border rounded"
                >
                  {languageOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* NAME */}
                <input
                  value={item.name}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className="w-2/3 p-2 border rounded"
                  placeholder="Name"
                />

                {/* REMOVE */}
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              className="text-blue-500 mt-2"
            >
              + Add Alternative Name
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={updateBasedataMutation.isPending}
            >
              {updateBasedataMutation.isPending
                ? "Updating..."
                : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}