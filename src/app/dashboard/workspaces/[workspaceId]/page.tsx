
import { Suspense } from "react";
import { WorkspaceDetail } from "@/features/workspace/components/workspace-detail";

type PageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

function WorkspaceDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <div className="h-8 w-1/3 animate-pulse rounded-md bg-muted" />
      <div className="h-24 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

async function WorkspaceDetailRoute({ params }: PageProps) {
  const { workspaceId } = await params;

  return <WorkspaceDetail workspaceId={workspaceId} />;
}

export default function WorkspaceDetailPage({
                                              params,
                                            }: PageProps) {
  return (
    <Suspense fallback={<WorkspaceDetailSkeleton />}>
      <WorkspaceDetailRoute params={params} />
    </Suspense>
  );
}
