import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskTitleMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskTitle = ({
  title,
  taskId,
}: {
  title: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { mutate, isPending } = useUpdateTaskTitleMutation();
  const updateTitle = () => {
    mutate(
      { taskId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Title updated successfully");
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      {isEditing ? (
        <Input
          className="flex-1 text-xl font-semibold"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <h2 className="text-xl flex-1 font-semibold truncate">{title}</h2>
      )}

      {isEditing ? (
        <Button
          className="shrink-0"
          size="sm"
          onClick={updateTitle}
          disabled={isPending}
        >
          Save
        </Button>
      ) : (
        <Edit
          className="size-4 shrink-0 cursor-pointer"
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};
