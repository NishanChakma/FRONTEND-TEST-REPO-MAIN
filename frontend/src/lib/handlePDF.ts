import { toast } from "sonner";
import { api } from "./api";

export const handlePDF = async (id: string) => {
  try {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: "blob",
    });

    const text = await response.data.text();

    const MAX_LENGTH = 131872; //free openrouter model has character limit

    if (text.length > MAX_LENGTH) {
      return text.slice(0, MAX_LENGTH);
    }

    return text;
  } catch (error: unknown) {
    toast.error("Failed to load document!");
    return "";
  }
};
