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

/** 내가 작성한 리뷰 한 건 */
export interface MyReviewItem {
  id: number;
  placeId: number;
  placeTitle: string;
  contentId: number;
  contentTypeId: number;
  content: string;
  score: number;
  placeImageUrl: string | null;
}

/** 서버 원본 페이로드 */
interface RawMyReviewsPayload {
  myPageReviewResponses: MyReviewItem[];
  reviewCount: number;
  hasNext: boolean;
  page: number;  // 0-based
  size: number;
}

/** 공통 응답 래퍼 */
interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}

/** 페이지네이션 형태로 가공한 결과 */
export interface MyReviewsPage {
  items: MyReviewItem[];    // 목록
  totalCount: number;       // 전체 개수
  totalPages: number;       // 전체 페이지 수 (1 이상)
  page: number;             // 1-based
  size: number;
  hasNext: boolean;
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

/** 마이페이지 내가 작성한 리뷰 (GET /review/mypage?page=&size=) */
export async function fetchMyReviews(
  page = 0,   // 0-based
  size = 5
): Promise<MyReviewsPage> {
  const res = await request.get({
    url: `/review/mypage?page=${page}&size=${size}`,
  });

  const ok = ensureSuccess<RawMyReviewsPayload>(res);
  const data = ok.data;

  const totalPages = Math.max(
    1,
    Math.ceil((data.reviewCount || 0) / (data.size || size))
  );

  return {
    items: data.myPageReviewResponses ?? [],
    totalCount: data.reviewCount ?? 0,
    totalPages,
    page: (data.page ?? page) + 1,  // 1-based로 변환
    size: data.size ?? size,
    hasNext: !!data.hasNext,
  };
}