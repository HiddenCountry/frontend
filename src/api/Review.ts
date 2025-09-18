import { request } from "./client";
import axios from "axios";

export const getReview = async (
  placeId: number,
  sort: string,
  size: number
) => {
  try {
    const res = await request.get({
      url: `/review/${placeId}?sort=${sort}&size=${size}`,
      params: {},
    });
    console.log("리뷰 리스트 조회 성공", res);
    return res;
  } catch (error) {
    console.error("리뷰 리스트 조회 오류 :", error);
    throw error;
  }
};

interface ReviewRequest {
  score: number;
  tags: string[];
  content: string;
  images?: File[];
  token: string;
}

export const postReview = async (placeId: number, data: ReviewRequest) => {
  const formData = new FormData();

  // JSON 부분을 Blob으로 만들어서 formData에 append
  const jsonBlob = new Blob(
    [
      JSON.stringify({
        score: data.score,
        tags: data.tags,
        content: data.content,
      }),
    ],
    { type: "application/json" }
  );

  formData.append("request", jsonBlob);

  // 이미지 추가
  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  const response = await axios.post(
    `http://3.36.94.121:8080/review/${placeId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${data.token}`,
      },
    }
  );

  return response.data;
};
