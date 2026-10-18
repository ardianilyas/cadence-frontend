import { WorkspaceMember } from "@/features/workspace/types/workspace.type";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { snakeToSpaces } from "@/helpers/snake-to-spaces";
import { useAuthStore } from "@/features/auth/store/auth-store";

type WorkspaceMembersTableProps = {
  workspaceMembers: WorkspaceMember[];
}

export default function WorkspaceMembersTable({ workspaceMembers }: WorkspaceMembersTableProps) {
  const username = useAuthStore((state) => state.user?.username);

  return (
    <div className="rounded-md border p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaceMembers.map((member, index) => {
            const isCurrentUser = member.user.name === username;

            return (
              <TableRow key={member.userId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {member.user.name}
                  {isCurrentUser && <span className="text-muted-foreground"> (you)</span>}
                </TableCell>
                <TableCell>{snakeToSpaces(member.role)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}