"use client"

import { useQuery } from "@tanstack/react-query";
import { workspaceKeys } from "@/features/workspace/hooks/use-workspaces";
import { getWorkspace } from "@/features/workspace/api/get-workspace";
import { useEffect } from "react";
import { handleApiError } from "@/lib/handle-api-error";

export function useWorkspace(workspaceId: string) {
  const query = useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => getWorkspace(workspaceId),
    enabled: Boolean(workspaceId),
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      handleApiError(query.error);
    }
  }, [query.isError, query.error]);

  return query;
}
