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

import type { Project } from "../types/project.type";
import { UpdateProjectDialog } from "./update-project-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";

type Props = {
  project: Project;
};

export function ProjectActions({ project }: Props) {
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
              aria-label="Open project actions"
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
      <UpdateProjectDialog
        project={project}
        open={editOpen}
        onOpenChangeAction={setEditOpen}
      />

      <DeleteProjectDialog
        project={project}
        open={deleteOpen}
        onOpenChangeAction={setDeleteOpen}
      />
    </>
  );
}
