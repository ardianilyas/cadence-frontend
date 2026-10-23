import axios from "axios";
import { toast } from "sonner";

type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
};

export function handleApiError(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response?.data;

    const message =
      response?.errors?.[0]?.message ?? response?.message ?? error.message;

    toast.error(message);
    return;
  }

  toast.error("An unexpected error occurred.");
}
