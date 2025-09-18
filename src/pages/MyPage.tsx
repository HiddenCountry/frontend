import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import ListSection, { CardList } from "../components/mypage/ListSection";
import ListItem from "../components/mypage/ListItem";
import { ReactComponent as ProfileSvg } from "../assets/mypage/profile.svg";
import { getBookmarkPlaces } from "../api/Bookmark";
import { useNavigate } from "react-router-dom";

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
  contentTypeName: string; // e.g. "RESTAURANT"
  contentTypeId: number;
  longitude: number;
  latitude: number;
  contentTypeKoreanName?: string; // "음식점"
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

const PAGE_SIZE = 6;

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"saved" | "reviews">("saved");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 서버 데이터
  const [savedPlaces, setSavedPlaces] = useState<BookmarkPlace[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

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

  // (예시) 리뷰 탭 더미
  const reviews = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: i + 1,
        placeName: "니지모리 스튜디오",
        rating: 5.0,
        content:
          "리뷰 내용입니다. 리뷰 내용입니다. 리뷰 내용입니다. 리뷰 내용입니다. 리뷰 내용입니다...",
      })),
    []
  );

  const isSaved = activeTab === "saved";

  // 페이지네이션으로 북마크 리스트 가져오기
  useEffect(() => {
    if (!isSaved) return; // 저장한 장소 탭에서만 호출
    const token = localStorage.getItem("accessToken");
    if (!token) return; // 로그인 안 된 경우엔 호출 안 함 (상위에서 가드 가능)

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 서버는 0-based라서 page - 1
        const res: BookmarkResponse = await getBookmarkPlaces(
          page - 1,
          PAGE_SIZE
        );

        if (res?.isSuccess && res.data) {
          setSavedPlaces(res.data.content ?? []);
          setTotalPages(res.data.totalPage ?? 1);
          setTotalElements(res.data.totalElement ?? 0);
        } else {
          setSavedPlaces([]);
          setTotalPages(1);
          setTotalElements(0);
          setError(res?.message ?? "조회 실패");
        }
      } catch (e: any) {
        setSavedPlaces([]);
        setTotalPages(1);
        setTotalElements(0);
        setError(e?.message ?? "네트워크 오류");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSaved, page]);

  return (
    <Container>
      <Main>
        <LeftCard>
          <Profile>
            <Avatar />
            <Nickname>숨은나라찾기 님</Nickname>
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

        {/* 페이지네이션 기반 섹션 */}
        <ListSection
          title={isSaved ? "저장한 장소 리스트" : "작성한 리뷰"}
          count={isSaved ? totalElements : reviews.length}
          page={page}
          totalPages={
            isSaved ? totalPages : Math.ceil(reviews.length / PAGE_SIZE)
          }
          onPageChange={setPage}
          loading={loading} // 로딩 표시만
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
                      imageUrl={p.firstImage}
                      onClick={() => goDetail(p)}
                    />
                  ))
                : reviews.map((r) => (
                    <ListItem
                      key={r.id}
                      variant="review"
                      placeName={r.placeName}
                      rating={r.rating}
                      message={
                        r.rating >= 5
                          ? "완벽했어요!"
                          : r.rating >= 4
                          ? "좋았어요!"
                          : r.rating >= 3
                          ? "나쁘지 않았어요"
                          : r.rating >= 2
                          ? "그냥 그랬어요"
                          : "기대 이하였어요"
                      }
                      snippet={r.content}
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
