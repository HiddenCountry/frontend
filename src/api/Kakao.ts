import { request } from "./client";
const baseURL = process.env.REACT_APP_BASE_URL;

export const patchNickname = async (data: { nickname: string }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const response = await fetch(baseURL + `/nickname`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();
    return resData;
  } catch (err) {
    console.error("닉네임 변경 오류:", err);
    throw err;
  }
};

export const getCallback = async (code: string) => {
  try {
    const res = await request.get({
      url: `/callback?code=${code}`,
      params: {},
    });
    console.log("카카오 로그인 성공", res);
    return res;
  } catch (error) {
    console.error("카카오 로그인 성공 :", error);
    throw error;
  }
};
