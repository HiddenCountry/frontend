import { request } from "./client";

interface ChatData {
  query: string;
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
