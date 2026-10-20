import { WorkspaceRole } from "@/features/workspace/schemas/workspace.schema";
import { Badge } from "@/components/ui/badge";
import { snakeToSpaces } from "@/helpers/snake-to-spaces";

type RoleBadgeProps = {
  role: WorkspaceRole
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  let className;

  switch (role) {
    case "Project_Manager":
      className = "bg-blue-50 text-blue-700";
      break;
    case "Developer" :
      className = "bg-violet-50 text-violet-700";
      break;
    case "Quality_Assurance" :
      className = "bg-rose-50 text-rose-700";
      break;
    default :
      className = "bg-gray-50 text-gray-700";
      break;
  }

  return (
    <Badge className={className}>
      {snakeToSpaces(role)}
    </Badge>
  )
}