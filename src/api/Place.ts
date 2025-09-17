import { request } from "./client";
export const getPlaces = async (
  page?: number,
  size?: number,
  areaCode?: string[],
  contentType?: string[],
  season?: string[],
  countryRegion?: string,
  sortType?: string,
  userLat?: number,
  userLng?: number,
  title?: string
) => {
  try {
    const params: Record<string, string> = {};

    if (page != null) params.page = String(page);
    if (size != null) params.size = String(size);
    if (areaCode && areaCode.length > 0) params.areaCode = areaCode.join(",");
    if (contentType && contentType.length > 0)
      params.contentType = contentType.join(",");
    if (season && season.length > 0) params.season = season.join(",");
    if (countryRegion) params.countryRegion = countryRegion;
    if (sortType) params.sortType = sortType;
    if (userLat != null) params.userLat = String(userLat);
    if (userLng != null) params.userLng = String(userLng);
    if (title) params.title = title;

    const res = await request.get({
      url: "/places",
      params,
    });
    console.log("장소 리스트 조회 성공", res);
    return res;
  } catch (error) {
    console.error("장소 리스트 조회 실패 :", error);
    throw error;
  }
};

// 이색 관광지(id!=null), 근처 관광지(id==null) 상세 정보 조회
export const getPlace = async (
  contentId: number,
  contentTypeId: number,
  id: number,
  userLat: number,
  userLng: number
) => {
  try {
    const res = await request.get({
      url: `/places?contentId=${contentId}&contentTypeId=${contentTypeId}&id=${id}&userLat=${userLat}&useLng=${userLng}`,
      params: {},
    });
    console.log("이색/근처 관광지 상세 조회 성공", res);
    return res;
  } catch (error) {
    console.error("이색/근처 관광지 상세 조회 성공 :", error);
    throw error;
  }
};
