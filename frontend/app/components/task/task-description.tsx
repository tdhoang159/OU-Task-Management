import { useUpdateTaskDescriptionMutation } from "@/hooks/use-task";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const TaskDescription = ({
  description,
  taskId,
}: {
  description: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const { mutate, isPending } = useUpdateTaskDescriptionMutation();
  const updateDescription = () => {
    mutate(
      { taskId, description: newDescription },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Description updated successfully");
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
    <div className="flex items-start gap-2 min-w-0">
      {isEditing ? (
        <Textarea
          className="flex-1 text-sm md:text-base"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={isPending}
          rows={4}
        />
      ) : (
        <div className="flex-1 text-sm md:text-base text-muted-foreground whitespace-pre-wrap">
          {description || "No description"}
        </div>
      )}

      {isEditing ? (
        <Button
          className="shrink-0"
          size="sm"
          onClick={updateDescription}
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
