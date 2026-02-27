import { request } from "./client";

export const postLogout = async () => {
  return request.post({
    url: "/auth/logout",
    credentials: "include",
  });
};
