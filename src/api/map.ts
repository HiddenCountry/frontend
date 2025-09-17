import { request } from "./client";

export type ContentTypeApi =
  | "TOURIST_SPOT"
  | "CULTURAL_FACILITY"
  | "EVENT"
  | "TRAVEL_COURSE"
  | "LEISURE_SPORTS"
  | "ACCOMMODATION"
  | "SHOPPING"
  | "RESTAURANT";

export type CountryRegionApi =
  | "NORTH_AMERICA"
  | "EUROPE"
  | "ASIA"
  | "AFRICA"
  | "SOUTH_AMERICA"
  | "OCEANIA"
  | "TURKEY"
  | "CHINA"
  | "MONGOLIA"
  | "ARAB"
  | "INDIA"
  | "SOUTHEAST_ASIA"
  | "JAPAN";

export interface GetPlacesMapParams {
  contentTypes: ContentTypeApi[];     // 복수
  countryRegions: CountryRegionApi[]; // 복수
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  userLat?: number;
  userLng?: number;
}

export interface PlaceMapItem {
  id: number;
  firstImage: string | null;
  contentId: number;
  reviewScoreAverage: number;
  reviewCount: number;
  addr1: string;
  season: string;
  hashtags: string[];
  isBookmarked: boolean;
  title: string;
  contentTypeName: ContentTypeApi;
  contentTypeId: number;
  longitude: number;
  latitude: number;
  contentTypeKoreanName: string;
  countryRegionKoreanNames: string[];
  distance: number; // (m)
}

export interface PlaceMapResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: PlaceMapItem[];
}

/** 배열 파라미터를 key=..&key=..로 직렬화 */
function toQueryString(params: GetPlacesMapParams) {
  const qs = new URLSearchParams();

  params.contentTypes?.forEach((v) => qs.append("contentTypes", v));
  params.countryRegions?.forEach((v) => qs.append("countryRegions", v));

  qs.append("swLat", String(params.swLat));
  qs.append("swLng", String(params.swLng));
  qs.append("neLat", String(params.neLat));
  qs.append("neLng", String(params.neLng));

  if (typeof params.userLat === "number") qs.append("userLat", String(params.userLat));
  if (typeof params.userLng === "number") qs.append("userLng", String(params.userLng));

  return qs.toString();
}

/** GET /places/map */
export const getPlacesOnMap = async (
  params: GetPlacesMapParams
): Promise<PlaceMapResponse> => {
  const query = toQueryString(params);
  const res = await request.get({ url: `/places/map?${query}`, params: {} });
  return res as PlaceMapResponse;
};
