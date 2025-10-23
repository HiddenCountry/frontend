import { request } from "./client";

interface InquiryData {
  title: string;
  content: string;
}

export const postInquiry = async (data: InquiryData) => {
  try {
    const res = await request.post({
      url: `/inquiry`,
      data: data,
    });
    console.log("장소 등록 요청 성공", res);
    return res;
  } catch (error) {
    console.error("장소 등록 요청 오류:", error);
    throw error;
  }
};
