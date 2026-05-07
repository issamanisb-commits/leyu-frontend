import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteInstruction } from "@/lib/hooks/useProjectManager";
import { toast } from "sonner";

interface DeleteBasedataProps {
  onCancel: () => void;
  id: string;
  task_id: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteInstruction({
  isOpen,
  onClose,
  id,
  onCancel,
  task_id,
}: DeleteBasedataProps) {
  // Use isPending instead of isLoading
  const { mutateAsync, isPending } = useDeleteInstruction({
    id,
    task_id,
  });

  const handleDeleteBasedata = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await mutateAsync();

      onClose();
    } catch (error) {}
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle>
            <p className="mb-2">Delete Instruction</p>
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Are you sure you want to delete this Instruction?
          </p>

          <div className="flex flex-row items-end">
            <div className="flex justify-end mr-4">
              <button
                className="!bg-white !text-primary !border-[0.5px] !border-primary !hover:bg-red-100 !rounded-lg !px-4 !py-2 flex items-center gap-2"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="!bg-white !text-red-500 !border-[0.5px] !border-red-500 !hover:bg-red-100 !rounded-lg !px-4 !py-2 flex items-center gap-2"
                onClick={handleDeleteBasedata}
                disabled={isPending} // Use isPending here
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
