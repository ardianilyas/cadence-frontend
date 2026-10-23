import { ProjectDetailRoute } from "./project-detail-route";
import { Suspense } from "react";
import { ProjectDetailSkeleton } from "@/features/project/components/project-detail-skeleton";

type PageProps = {
  params: Promise<{ projectId: string; workspaceId: string }>;
};

export default function ProjectDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailRoute params={params} />
    </Suspense>
  );
}
