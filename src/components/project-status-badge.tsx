import { ProjectStatus } from "@/features/project/schemas/project.schema";
import { Badge } from "@/components/ui/badge";
import { snakeToSpaces } from "@/helpers/snake-to-spaces";

type ProjectStatusBadgeProps = {
  status: ProjectStatus
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  let className;

  switch (status) {
    case "DRAFT":
      className = "bg-gray-50 text-gray-700";
      break;
    case "ACTIVE":
      className = "bg-green-50 text-green-700";
      break;
    case "DELAYED":
      className = "bg-amber-50 text-amber-700";
      break;
    case "COMPLETED":
      className = "bg-blue-50 text-blue-700";
      break;
    default:
      className = "bg-gray-50 text-gray-700";
      break;
  }

  return (
    <Badge className={className}>
      {snakeToSpaces(status)}
    </Badge>
  )
}
