import { request } from "./client";
export const getPlaces = async (
  page: number,
  size: number,
  areaCode: string[],
  contentType: string[],
  season: string[],
  countryRegion: string,
  sortType: string,
  userLat: number,
  userLng: number,
  title: string
) => {
  try {
    // 배열 파라미터 처리
    const areaCodeParams = areaCode.map((code) => `areaCode=${code}`).join("&");
    const contentTypeParams = contentType
      .map((type) => `contentType=${type}`)
      .join("&");
    const seasonParams = season.map((s) => `season=${s}`).join("&");

    // 전체 query string 조합
    const queryString = [
      `page=${page}`,
      `size=${size}`,
      areaCodeParams,
      contentTypeParams,
      seasonParams,
      `countryRegion=${countryRegion}`,
      `sortType=${sortType}`,
      `userLat=${userLat}`,
      `userLng=${userLng}`,
      `title=${title}`,
    ]
      .filter(Boolean) // 빈 값 제거
      .join("&");

    const res = await request.get({
      url: `/places?${queryString}`,
    });

    console.log("장소 리스트 조회 성공", res);
    return res;
  } catch (error) {
    console.error("장소 리스트 조회 실패 :", error);
    throw error;
  }
};

// 이색 관광지(id!=null) 상세 정보 조회
export const getPlace = async (
  contentId: number,
  contentTypeId: number,
  id: number,
  userLat: number,
  userLng: number
) => {
  try {
    const res = await request.get({
      url: `/place?contentId=${contentId}&contentTypeId=${contentTypeId}&id=${id}&userLat=${userLat}&userLng=${userLng}`,
      params: {},
    });
    console.log("이색 관광지 상세 조회 성공", res);
    return res;
  } catch (error) {
    console.error("이색 관광지 상세 조회 성공 :", error);
    throw error;
  }
};

// 인근 관광지(id==null) 상세 정보 조회
export const getPlaceNear = async (
  contentId: number,
  contentTypeId: number,
  userLat: number,
  userLng: number
) => {
  try {
    const res = await request.get({
      url: `/place?contentId=${contentId}&contentTypeId=${contentTypeId}&userLat=${userLat}&userLng=${userLng}`,
      params: {},
    });
    console.log("인근 관광지 상세 조회 성공", res);
    return res;
  } catch (error) {
    console.error("인근 관광지 상세 조회 성공 :", error);
    throw error;
  }
};
