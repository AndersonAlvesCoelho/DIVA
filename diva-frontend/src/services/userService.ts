import type { GraphUser } from "@/types/user";
import { graphApi } from "./graphApi";

export const userService = {
  getMe: async (): Promise<GraphUser> => {
    const { data } = await graphApi.get<GraphUser>("/me");
    return data;
  },

  getUserPhoto: async (): Promise<string | null> => {
    try {
      const { data } = await graphApi.get<Blob>("/me/photo/$value", {
        responseType: "blob",
      });
      return URL.createObjectURL(data);
    } catch {
      return null;
    }
  },
};
