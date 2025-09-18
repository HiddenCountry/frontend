import { request } from "./client";

export interface BookmarkPlace {
  id: number;
  firstImage: string | null;
  contentId: number;
  reviewScoreAverage: number;
  reviewCount: number;
  addr1: string | null;
  season: string | null;
  hashtags: string[];
  isBookmarked: boolean;
  title: string;
  contentTypeName: string;
  contentTypeId: number;
  longitude: number;
  latitude: number;
  contentTypeKoreanName?: string;
  countryRegionKoreanNames?: string[];
  distance?: number | null;
}

/** 페이징 컨테이너 */
export interface BookmarkPage {
  content: BookmarkPlace[];
  totalPage: number;
  totalElement: number;
  currentPage: number;
  currentSize: number;
}

/** 공통 응답 래퍼 */
interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}

/** 서버 오류 처리 유틸 */
function ensureSuccess<T>(res: any): ApiEnvelope<T> {
  if (!res) throw new Error("네트워크 오류 또는 빈 응답");
  if (res.isSuccess) return res as ApiEnvelope<T>;
  throw new Error(res.message || "요청 실패");
}


/** 마이페이지 북마크 목록 (GET /bookmark/places?page=&size=) */
export async function fetchBookmarkPlaces(
  page = 0,
  size = 9
): Promise<BookmarkPage> {
  const res = await request.get({
    url: `/bookmark/places?page=${page}&size=${size}`,
  });
  const ok = ensureSuccess<BookmarkPage>(res);
  return ok.data;
}