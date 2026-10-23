"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { useRemoveMember } from "../hooks/use-remove-member";
import { WorkspaceMember } from "@/features/workspace/types/workspace.type";

type MemberRowActionsProps = {
  workspaceId: string;
  member: WorkspaceMember;
};

export function MemberRowActions({
  workspaceId,
  member,
}: MemberRowActionsProps) {
  const [open, setOpen] = useState(false);
  const removeMutation = useRemoveMember(workspaceId);

  function handleConfirm() {
    removeMutation.mutate(member.userId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  return (
    <>
      {member.role !== "Project_Manager" && (
        <>
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
            Remove
          </Button>

          <RemoveMemberDialog
            open={open}
            onOpenChange={setOpen}
            memberName={member.user.name}
            isPending={removeMutation.isPending}
            onConfirm={handleConfirm}
          />

          {removeMutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              Failed to remove member. Please try again.
            </p>
          )}
        </>
      )}
    </>
  );
}
