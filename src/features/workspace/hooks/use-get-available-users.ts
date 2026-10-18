"use client"

import { useQuery } from "@tanstack/react-query";
import { workspaceKeys } from "@/features/workspace/hooks/use-workspaces";
import { getAvailableUsers } from "@/features/workspace/api/get-available-users";
import { useEffect } from "react";
import { handleApiError } from "@/lib/handle-api-error";

export function useGetAvailableUsers(workspaceId: string) {
 const query = useQuery({
   queryKey: workspaceKeys.availableUsers(workspaceId),
   queryFn: () => getAvailableUsers(workspaceId),
   enabled: Boolean(workspaceId),
   retry: false
 });

  useEffect(() => {
    if (query.isError) {
      handleApiError(query.error);
    }
  }, [query.isError, query.error]);

  return query;
}
