import { request } from "./client";

export const patchNickname = async (data: { nickname: string }) => {
  try {
    const res = await request.patch({
      url: `/nickname`,
      data: data,
    });
    console.log("닉네임 수정 성공", res);
    return res;
  } catch (error) {
    console.error("닉네임 수정 오류:", error);
    throw error;
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
