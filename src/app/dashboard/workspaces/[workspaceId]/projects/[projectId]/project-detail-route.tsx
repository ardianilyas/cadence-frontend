"use client";

import { use } from "react";
import { ProjectDetail } from "@/features/project/components/project-detail";

type ProjectDetailRouteProps = {
  params: Promise<{ projectId: string; workspaceId: string }>;
};

export function ProjectDetailRoute({ params }: ProjectDetailRouteProps) {
  const { projectId, workspaceId } = use(params);
  return <ProjectDetail projectId={projectId} workspaceId={workspaceId} />;
}
