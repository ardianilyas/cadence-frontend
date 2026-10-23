import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project } from "@/features/project/types/project.type";
import { formatDate } from "@/lib/format-date";
import { ProjectStatusBadge } from "@/components/project-status-badge";
import { ProjectActions } from "@/features/project/components/project-actions";
import Link from "next/link";

type ProjectsTableProps = {
  projects: Project[];
  workspaceId: string;
};

export function ProjectsTable({ projects, workspaceId }: ProjectsTableProps) {
  return (
    <div className="p-2">
      <Table>
        <TableCaption>Project list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">No</TableHead>
            <TableHead className="w-48">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-32">Start Date</TableHead>
            <TableHead className="w-32">Due Date</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects?.map((project, i) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{i + 1}</TableCell>

              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/workspaces/${workspaceId}/projects/${project.id}`}
                  className="hover:underline"
                >
                  {project.name}
                </Link>
              </TableCell>

              <TableCell className="max-w-75 truncate text-muted-foreground">
                {project.description || "—"}
              </TableCell>

              <TableCell>
                <ProjectStatusBadge status={project.status as any} />
              </TableCell>

              <TableCell className="text-muted-foreground">
                {formatDate(project.startDate)}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {formatDate(project.dueDate)}
              </TableCell>

              <TableCell>
                <ProjectActions project={project} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
