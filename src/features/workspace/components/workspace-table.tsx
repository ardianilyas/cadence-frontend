import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Workspace } from "@/features/workspace/types/workspace.type";
import { formatDate } from "@/lib/format-date";
import { WorkspaceActions } from "@/features/workspace/components/workspace-actions";

type WorkspaceTableProps = {
  workspaces: Workspace[]
}

export default function WorkspaceTable({ workspaces }: WorkspaceTableProps) {
  return (
    <div className="p-2">
      <Table>
        <TableCaption>Workspace list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-55">No</TableHead>
            <TableHead className="w-55">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-55">Members</TableHead>
            <TableHead className="w-55">Created At</TableHead>
            <TableHead className="w-55">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaces?.map((workspace, i) => (
            <TableRow key={workspace.id}>
              <TableCell className="font-medium">
                {i + 1}
              </TableCell>

              <TableCell className="font-medium">
                {workspace.name}
              </TableCell>

              <TableCell className="max-w-75 truncate text-muted-foreground">
                {workspace.description || "—"}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {workspace._count.workspaceMembers}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {formatDate(workspace.createdAt)}
              </TableCell>

              <TableCell>
                <WorkspaceActions workspace={workspace} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
    </Table>
    </div>
  )
}