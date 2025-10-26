import { request } from "./client";

interface ChatData {
  query: string;
  sessionId: string | null;
}

export const postChatQuery = async (data: ChatData) => {
  try {
    const res = await request.post({
      url: `/chat/query`,
      data: data,
    });
    console.log("챗봇 성공", res);
    return res;
  } catch (error) {
    console.error("챗봇 오류:", error);
    throw error;
  }
};

export const getChatSession = async () => {
  try {
    const res = await request.get({
      url: `/chat/session`,
      params: {},
    });
    const sessionId = res.data;
    localStorage.setItem("chatSessionId", sessionId);
    console.log("세션 아이디 발급 성공", res);
    return res;
  } catch (error) {
    console.error("세션 아이디 발급 오류 :", error);
    throw error;
  }
};
