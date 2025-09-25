import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import ListSection, { CardList } from "../components/mypage/ListSection";
import ListItem from "../components/mypage/ListItem";
import { ReactComponent as ProfileSvg } from "../assets/mypage/profile.svg";
import { getBookmarkPlaces } from "../api/Bookmark";
import { useNavigate } from "react-router-dom";
import { fetchMyReviews } from "../api/Mypage";
import { getUserInfo } from "../api/Kakao";

/** ====== 북마크 타입 ====== */
type BookmarkPlace = {
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
  contentTypeName: string;
  contentTypeId: number;
  longitude: number;
  latitude: number;
  contentTypeKoreanName?: string;
  countryRegionKoreanNames?: string[];
  distance?: number | null;
};

type BookmarkResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    content: BookmarkPlace[];
    totalPage: number;
    totalElement: number;
    currentPage: number; // 0-based
    currentSize: number;
  };
};

/** ====== 리뷰 타입(서버 응답 반영) ====== */
type MyReviewItem = {
  id: number;
  placeId: number;
  placeTitle: string;
  contentId: number;
  contentTypeId: number;
  content: string;
  score: number;
  placeImageUrl: string | null;
};

const PAGE_SIZE_BOOKMARK = 6;
const PAGE_SIZE_REVIEW = 6;

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"saved" | "reviews">("saved");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // ===== 저장한 장소(북마크) 상태 =====
  const [savedPlaces, setSavedPlaces] = useState<BookmarkPlace[]>([]);
  const [bmTotalPages, setBmTotalPages] = useState(1);
  const [bmTotalElements, setBmTotalElements] = useState(0);

  // ===== 내가 작성한 리뷰 상태 =====
  const [myReviews, setMyReviews] = useState<MyReviewItem[]>([]);
  const [rvTotalPages, setRvTotalPages] = useState(1);
  const [rvTotalElements, setRvTotalElements] = useState(0);

  const isSaved = activeTab === "saved";

  // 탭 바꿀 때 페이지 1로 리셋
  useEffect(() => {
    setPage(1);
    setError(null);
  }, [activeTab]);

  // ===== 북마크 목록 불러오기 =====
  useEffect(() => {
    if (!isSaved) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res: BookmarkResponse = await getBookmarkPlaces(
          page - 1,
          PAGE_SIZE_BOOKMARK
        );

        if (res?.isSuccess && res.data) {
          setSavedPlaces(res.data.content ?? []);
          setBmTotalPages(res.data.totalPage ?? 1);
          setBmTotalElements(res.data.totalElement ?? 0);
        } else {
          setSavedPlaces([]);
          setBmTotalPages(1);
          setBmTotalElements(0);
          setError(res?.message ?? "북마크 조회 실패");
        }
      } catch (e: any) {
        setSavedPlaces([]);
        setBmTotalPages(1);
        setBmTotalElements(0);
        setError(e?.message ?? "네트워크 오류");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSaved, page]);

  // ===== 리뷰 목록 불러오기 =====
  useEffect(() => {
    if (isSaved) return; // 리뷰 탭일 때만
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 서버는 0-based page
        const data = await fetchMyReviews(page - 1, PAGE_SIZE_REVIEW);
        // fetchMyReviews가 totalCount/totalPages 계산해줌
        setMyReviews(data.items ?? []);
        setRvTotalPages(data.totalPages ?? 1);
        setRvTotalElements(data.totalCount ?? 0);
      } catch (e: any) {
        setMyReviews([]);
        setRvTotalPages(1);
        setRvTotalElements(0);
        setError(e?.message ?? "리뷰 조회 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSaved, page]);

  const goDetail = (p: BookmarkPlace) => {
    navigate("/main/place", {
      state: {
        id: p.id,
        contentId: p.contentId,
        title: p.title,
        firstImage: p.firstImage,
        reviewScoreAverage: p.reviewScoreAverage,
        reviewCount: p.reviewCount,
        addr1: p.addr1,
        season: p.season,
        hashtags: p.hashtags,
        isBookmarked: !!p.isBookmarked,
        contentTypeName: p.contentTypeName ?? p.contentTypeKoreanName,
        contentTypeId: p.contentTypeId,
        longitude: p.longitude,
        latitude: p.latitude,
        distance: p.distance,
      },
    });
  };

  const goDetailFromReview = (r: MyReviewItem) => {
    navigate("/main/place", {
      state: {
        id: r.placeId,
        contentId: r.contentId,
        title: r.placeTitle,
        firstImage: r.placeImageUrl,
        contentTypeId: r.contentTypeId,
      },
    });
  };

  // 평점 → 메시지
  const ratingMsg = (score: number) =>
    score >= 5
      ? "완벽했어요!"
      : score >= 4
      ? "좋았어요!"
      : score >= 3
      ? "나쁘지 않았어요"
      : score >= 2
      ? "그냥 그랬어요"
      : "기대 이하였어요";

  // 닉네임 불러오기
  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedProfile =
      localStorage.getItem("profileImageUrl") ||
      localStorage.getItem("profileImg");

    if (storedNickname) setNickname(storedNickname);
    else setNickname("사용자");

    if (storedProfile) setProfileUrl(storedProfile);

    // 서버에서 최신 세션/프로필 확인 (토큰 있을 때만)
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    (async () => {
      try {
        const res = await getUserInfo();

        // API 응답 형태별 안전 파싱
        const data = res?.data?.data || res?.data || res;

        const serverNickname: string =
          data?.nickname ||
          data?.user?.nickname ||
          data?.profile?.nickname ||
          "";
        const serverProfile: string | null =
          data?.profileImg ||
          data?.profileImageUrl ||
          data?.profileImage ||
          data?.imageUrl ||
          null;

        if (serverNickname) {
          setNickname(serverNickname);
          localStorage.setItem("nickname", serverNickname);
        }
        if (serverProfile) {
          setProfileUrl(serverProfile);
          localStorage.setItem("profileImageUrl", serverProfile);
        }
      } catch (e) {
        // 세션 만료(COMMON403) 등은 조용히 무시 (마이페이지 진입 시 Navbar 쪽 모달 처리와 충돌 방지)
        // console.warn("getUserInfo failed", e);
      }
    })();
  }, []);

  return (
    <Container>
      <Main>
        <LeftCard>
          <Profile>
            {profileUrl ? (
              <AvatarImg src={profileUrl} alt="프로필 이미지" />
            ) : (
              <Avatar />
            )}
            <Nickname>{nickname} 님</Nickname>
          </Profile>

          <Menu>
            <MenuItem
              role="tab"
              aria-selected={isSaved}
              $active={isSaved}
              onClick={() => setActiveTab("saved")}
            >
              저장한 장소 리스트
            </MenuItem>
            <MenuItem
              role="tab"
              aria-selected={!isSaved}
              $active={!isSaved}
              onClick={() => setActiveTab("reviews")}
            >
              작성한 리뷰
            </MenuItem>
          </Menu>
        </LeftCard>

        <ListSection
          title={isSaved ? "저장한 장소 리스트" : "작성한 리뷰"}
          count={isSaved ? bmTotalElements : rvTotalElements}
          page={page}
          totalPages={isSaved ? bmTotalPages : rvTotalPages}
          onPageChange={setPage}
          loading={loading}
        >
          {error ? (
            <ErrorBox>⚠ {error}</ErrorBox>
          ) : (
            <CardList>
              {isSaved
                ? savedPlaces.map((p) => (
                    <ListItem
                      key={p.id}
                      variant="saved"
                      name={p.title}
                      rating={p.reviewScoreAverage}
                      reviews={p.reviewCount}
                      address={p.addr1}
                      imageUrl={p.firstImage ?? undefined}
                      onClick={() => goDetail(p)}
                    />
                  ))
                : myReviews.map((r) => (
                    <ListItem
                      key={r.id}
                      variant="review"
                      placeName={r.placeTitle}
                      rating={r.score}
                      message={ratingMsg(r.score)}
                      snippet={r.content}
                      imageUrl={r.placeImageUrl ?? undefined}
                      onClick={() => goDetailFromReview(r)}
                    />
                  ))}
            </CardList>
          )}
        </ListSection>
      </Main>
    </Container>
  );
};

export default MyPage;

/* ===== styles ===== */
const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.color.gray100};
  padding-top: 10px;
`;

const Main = styled.main`
  max-width: 1080px;
  margin: 24px auto 60px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCard = styled.aside`
  background: ${({ theme }) => theme.color.white};
  border-radius: 16px;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  border: 1px solid ${({ theme }) => theme.color.gray200};
  align-self: start;
`;

const Profile = styled.div`
  padding: 10px 20px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
  text-align: center;
`;

const Avatar = styled(ProfileSvg)`
  width: 88px;
  height: 88px;
  display: block;
  margin: 8px auto 12px;
`;

const Nickname = styled.div`
  ${({ theme }) => theme.font.md.bold};
  color: ${({ theme }) => theme.color.gray800};
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.button<{ $active?: boolean }>`
  ${({ theme }) => theme.font.md.medium};
  position: relative;
  z-index: 0;
  text-align: center;
  width: 100%;
  padding: 16px 20px;
  background: transparent;
  color: ${({ theme, $active }) =>
    $active ? theme.color.primary600 : theme.color.gray700};
  border: none;
  border-top: 1px solid ${({ theme }) => theme.color.gray200};
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    inset: 8px 14px;
    border-radius: 16px;
    background: ${({ theme }) => theme.color.gray100};
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: -1;
  }

  &:hover::after {
    opacity: ${({ $active }) => ($active ? 0 : 1)};
  }
  &:focus-visible::after {
    opacity: ${({ $active }) => ($active ? 0 : 1)};
  }
`;

const ErrorBox = styled.div`
  ${({ theme }) => theme.font.sm.medium};
  color: ${({ theme }) => theme.color.red800 ?? "#c62828"};
  background: ${({ theme }) => theme.color.red100 ?? "#ffebee"};
  border: 1px solid ${({ theme }) => theme.color.red200 ?? "#ffcdd2"};
  padding: 16px;
  border-radius: 12px;
  margin-top: 8px;
`;

const AvatarImg = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 8px auto 12px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
`;
