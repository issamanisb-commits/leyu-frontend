import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDeleteTask } from "@/lib/hooks/useProject";

interface DeleteTaskProps {
  isOpen: boolean;
  onClose: () => void;
  task_id: string;
  task_name?: string; // Add task name for better confirmation message
}

export function DeleteTask({
  isOpen,
  onClose,
  task_id,
  task_name,
}: DeleteTaskProps) {
  const deleteTaskMutation = useDeleteTask(task_id);

  const handleDeleteTask = async () => {
    try {
      await deleteTaskMutation.mutateAsync();
      onClose();
    } catch (error) {}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will delete the task
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="!bg-white !text-primary !border-[0.5px] !border-primary !hover:bg-red-100 !rounded-lg !px-4 !py-2 flex items-center gap-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteTask}
            disabled={deleteTaskMutation.isPending}
            className="!bg-white !text-red-500 !border-[0.5px] !border-red-500 !hover:bg-red-100 !rounded-lg !px-4 !py-2 flex items-center gap-2"
          >
            {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
