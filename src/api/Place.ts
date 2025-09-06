import { request } from "./client";

export const getPlaces = async (
  page: number,
  size: number,
  areaCode: string[],
  contentType: string[],
  season: string[],
  countryRegion: string,
  sortType: string,
  latitude: number,
  longitude: number,
  title: string
) => {
  try {
    const res = await request.get({
      url: `/places?page=${page}&size=${size}&areaCode=${areaCode}&contentType=${contentType}&season=${season}&countryRegion=${countryRegion}&sortType=${sortType}&latitude=${latitude}&longitude=${longitude}&title=${title}`,
      params: {},
    });
    console.log("장소 리스트 조회 성공", res);
    return res;
  } catch (error) {
    console.error("장소 리스트 조회 성공 :", error);
    throw error;
  }
};

// 이색 관광지(id!=null), 근처 관광지(id==null) 상세 정보 조회
export const getPlace = async (
  contentId: number,
  contentTypeId: number,
  id: number,
  latitude: number,
  longitude: number
) => {
  try {
    const res = await request.get({
      url: `/places?contentId=${contentId}&contentTypeId=${contentTypeId}&id=${id}&latitude=${latitude}&longitude=${longitude}`,
      params: {},
    });
    console.log("이색/근처 관광지 상세 조회 성공", res);
    return res;
  } catch (error) {
    console.error("이색/근처 관광지 상세 조회 성공 :", error);
    throw error;
  }
};
