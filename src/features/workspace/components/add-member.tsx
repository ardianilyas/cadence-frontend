"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAvailableUsers } from "@/features/workspace/hooks/use-get-available-users";
import { useAddMember } from "@/features/workspace/hooks/use-add-member";
import {
  addMemberSchema,
  type AddMemberSchema,
  WorkspaceRole,
} from "@/features/workspace/schemas/workspace.schema";
import type { AvailableUser } from "@/features/workspace/types/workspace.type";
import { snakeToSpaces } from "@/helpers/snake-to-spaces";

type AddMemberProps = {
  workspaceId: string;
};

export default function AddMember({ workspaceId }: AddMemberProps) {
  const [open, setOpen] = useState(false);
  const { data: users, isPending: isLoadingUsers } =
    useGetAvailableUsers(workspaceId);
  const addMemberMutation = useAddMember(workspaceId);

  const selectItems = useMemo(
    () => users?.map((user) => ({ value: user.id, label: user.name })) ?? [],
    [users],
  );

  const roleSelectItems = useMemo(
    () =>
      Object.values(WorkspaceRole).map((role) => ({
        value: role,
        label: snakeToSpaces(role),
      })),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMemberSchema>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      userId: "",
      role: WorkspaceRole.Developer,
    },
  });

  function onSubmit(values: AddMemberSchema) {
    addMemberMutation.mutate(
      { payload: values },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      },
    );
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && addMemberMutation.isPending) return;

    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon /> Add Member
          </Button>
        }
      />
      <DialogContent className="min-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Add a new member to your workspace
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="user-select">User</Label>
            <Controller
              control={control}
              name="userId"
              render={({ field }) => (
                <Select
                  items={selectItems}
                  value={field.value || null}
                  onValueChange={(val) => field.onChange(val ?? "")}
                  disabled={isLoadingUsers || addMemberMutation.isPending}
                >
                  <SelectTrigger
                    id="user-select"
                    className="w-full"
                    aria-invalid={!!errors.userId}
                  >
                    <SelectValue
                      placeholder={
                        isLoadingUsers ? "Loading users..." : "Select user"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {users?.map((user: AvailableUser) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} -{" "}
                          <p className="text-neutral-500">{user.email}</p>
                        </SelectItem>
                      ))}
                      {users && users.length === 0 && (
                        <div className="py-2 px-3 text-sm text-muted-foreground text-center">
                          No available users
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.userId && (
              <p className="text-sm text-destructive">
                {errors.userId.message}
              </p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="role-select">Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  items={roleSelectItems}
                  value={field.value || null}
                  onValueChange={(val) =>
                    field.onChange(val ?? WorkspaceRole.Developer)
                  }
                  disabled={addMemberMutation.isPending}
                >
                  <SelectTrigger
                    id="role-select"
                    className="w-full"
                    aria-invalid={!!errors.role}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {roleSelectItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={addMemberMutation.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addMemberMutation.isPending || isLoadingUsers}
            >
              {addMemberMutation.isPending ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
