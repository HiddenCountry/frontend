import { request } from "./client";

export const postBookmarkPlace = async (id: number) => {
  try {
    const res = await request.post({
      url: `/bookmark/place?id=${id}`,
      params: {},
    });
    console.log("북마크 추가 성공", res);
    return res;
  } catch (error) {
    console.error("북마크 추가 오류:", error);
    throw error;
  }
};

export const deleteDictionary = async (id: number) => {
  try {
    const res = await request.delete({
      url: `/bookmark/place?id=${id}`,
      params: {},
    });
    console.log("북마크 해제 성공", res);
    return res;
  } catch (error) {
    console.error("북마크 해제 오류:", error);
    throw error;
  }
};

export const getBookmarkPlaces = async (page: number, size: number) => {
  try {
    const res = await request.get({
      url: `/bookmark/places?page=${page}&size=${size}`,
      params: {},
    });
    console.log("북마크 리스트 조회 성공", res);
    return res;
  } catch (error) {
    console.error("북마크 리스트 조회 오류 :", error);
    throw error;
  }
};
