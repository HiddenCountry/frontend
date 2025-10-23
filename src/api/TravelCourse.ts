import { request } from "./client";

export const getTravelCourse = async () => {
  try {
    const res = await request.get({
      url: `/travel-courses`,
      params: {},
    });
    console.log("여행 코스 리스트 조회 성공", res);
    return res;
  } catch (error) {
    console.error("여행 코스 리스트 조회 오류 :", error);
    throw error;
  }
};

interface TravelCourseData {
  name: string;
  placeIds: number[];
}
export const postTravelCourse = async (data: TravelCourseData) => {
  try {
    const res = await request.post({
      url: `/travel-courses`,
      data: data,
    });
    console.log("여행 코스 등록 성공", res);
    return res;
  } catch (error) {
    console.error("여행 코스 등록 오류:", error);
    throw error;
  }
};

export const getTravelCourseDetail = async (id: number) => {
  try {
    const res = await request.get({
      url: `/travel-courses/${id}`,
      params: {},
    });
    console.log("여행 코스 상세 조회 성공", res);
    return res;
  } catch (error) {
    console.error("여행 코스 상세 조회 오류 :", error);
    throw error;
  }
};

export const deleteTravelCourseDetail = async (id: number) => {
  try {
    const res = await request.delete({
      url: `/travel-courses/${id}`,
      params: {},
    });
    console.log("여행 코스 삭제 성공", res);
    return res;
  } catch (error) {
    console.error("여행 코스 삭제 오류:", error);
    throw error;
  }
};

export const getTravelCourseMine = async () => {
  try {
    const res = await request.get({
      url: `/travel-courses/mine`,
      params: {},
    });
    console.log("마이페이지 - 여행 코스 상세 조회 성공", res);
    return res;
  } catch (error) {
    console.error("마이페이지 - 여행 코스 상세 조회 오류 :", error);
    throw error;
  }
};
