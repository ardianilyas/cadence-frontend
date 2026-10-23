"use client";

import { useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Workspace } from "../types/workspace.type";
import { UpdateWorkspaceDialog } from "./update-workspace-dialog";
import { DeleteWorkspaceDialog } from "./delete-workspace-dialog";

type Props = {
  workspace: Workspace;
};

export function WorkspaceActions({ workspace }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const pendingAction = useRef<"edit" | "delete" | null>(null);

  return (
    <>
      <DropdownMenu
        onOpenChangeComplete={(open) => {
          // After the dropdown has fully closed and animated out, open the pending dialog
          if (!open && pendingAction.current) {
            const action = pendingAction.current;
            pendingAction.current = null;
            if (action === "edit") {
              setEditOpen(true);
            } else {
              setDeleteOpen(true);
            }
          }
        }}
      >
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open workspace actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              pendingAction.current = "edit";
            }}
          >
            <Pencil />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              pendingAction.current = "delete";
            }}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Keep dialogs outside DropdownMenu */}
      <UpdateWorkspaceDialog
        workspace={workspace}
        open={editOpen}
        onOpenChangeAction={setEditOpen}
      />

      <DeleteWorkspaceDialog
        workspace={workspace}
        open={deleteOpen}
        onOpenChangeAction={setDeleteOpen}
      />
    </>
  );
}
