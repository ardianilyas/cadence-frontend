import { WorkspaceMember } from "@/features/workspace/types/workspace.type";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { MemberRowActions } from "@/features/workspace/components/remove-member-action";
import RoleBadge from "@/components/role-badge";

type WorkspaceMembersTableProps = {
  workspaceId: string;
  workspaceMembers: WorkspaceMember[];
}

export default function WorkspaceMembersTable({ workspaceId, workspaceMembers }: WorkspaceMembersTableProps) {
  const username = useAuthStore((state) => state.user?.username);

  return (
    <div className="rounded-md border p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
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
                <TableCell>
                  <RoleBadge role={member.role} />
                </TableCell>
                <TableCell>
                  <MemberRowActions workspaceId={workspaceId} member={member} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}