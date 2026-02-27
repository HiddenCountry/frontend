import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { ReactComponent as AirPlane } from "../assets/main/Airplane.svg";
import { ReactComponent as AirPlaneReivew } from "../assets/place/AirplaneReview.svg";
import { ReactComponent as AirPlaneReivewX } from "../assets/place/AirplaneReviewX.svg";
import { ReactComponent as BookmarkWhite } from "../assets/place/BookmarkWhite.svg";
import { ReactComponent as BookmarkBlue } from "../assets/place/BookmarkBlue.svg";
import { ReactComponent as ImageLeft } from "../assets/place/ImageLeft.svg";
import { ReactComponent as ImageRight } from "../assets/place/ImageRight.svg";
import { ReactComponent as Logo } from "../assets/layout/Logo.svg";
import NearCard from "../components/place/NearCard";
import ReviewCard from "../components/place/ReviewCard";
import { fetchNearbyPlaces, fetchTourImages } from "../api/TourApi";
import { getPlace, getPlaceUserNull } from "../api/Place";
import KakaoMap from "../components/place/KakaoMap";
import { deleteBookmark, postBookmark } from "../api/Bookmark";
import ReviewModal from "../components/place/ReviewModal";
import { getReview, getReviewImages } from "../api/Review";
import { TAGS } from "../constants/Tags";
import Pagination from "../components/main/Pagination";
import LoginModal from "../components/common/LoginModal";

interface Place {
  title: string;
  addr1: string;
  firstimage: string;
  dist: string;
  contenttypeid: string;
  contentid: string;
}
interface CardItemProps {
  id: number;
  firstImage?: string;
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
  distance: number;
}
interface InfoItem {
  name: string;
  content: string;
}
interface PlaceDetailType {
  id: number | null;
  title: string;
  reviewScoreAverage: number | null;
  address: string;
  contentTypeKoreanName: string;
  countryKoreanNames: string[];
  distance: number;
  infoItemList: InfoItem[];
  latitude: number;
  longitude: number;
  isBookmarked: boolean | null;
  isExoticPlace: boolean;
}

const PlaceDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "소개" | "지도" | "인근 관광지" | "리뷰"
  >("소개");
  const token = localStorage.getItem("accessToken");

  const location = useLocation();
  const place = location.state as CardItemProps | undefined;
  const contentId = place?.contentId;
  const contentTypeId = place?.contentTypeId;
  const longitude = place?.longitude;
  const latitude = place?.latitude;
  const serviceKey = process.env.REACT_APP_TOUR_SERVICE_KEY;
  const [loading, setLoading] = useState(true); // 위치 정보 로딩 상태

  // 리뷰 모달창
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // 각 섹션 ref
  const introRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const nearbyRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  // 탭 클릭 시 해당 섹션으로 스크롤
  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    let target: HTMLDivElement | null = null;
    if (tab === "소개") target = introRef.current;
    if (tab === "지도") target = mapRef.current;
    if (tab === "인근 관광지") target = nearbyRef.current;
    if (tab === "리뷰") target = reviewRef.current;

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // 대표이미지
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 리뷰 이미지로 대체되었는지 여부
  const [isReviewImageFallback, setIsReviewImageFallback] = useState(false);

  // tourAPI 대표이미지 + 리뷰 이미지 연동
  useEffect(() => {
    const loadImages = async () => {
      if (!contentId || !serviceKey) return;

      let urls: string[] = [];
      let usedReviewFallback = false;

      // 1. tourAPI에서 이미지 가져오기
      urls = await fetchTourImages(contentId, serviceKey);

      // 2. tourAPI 이미지가 없으면 리뷰 이미지로 대체
      if (!urls || urls.length === 0) {
        try {
          const res = await getReviewImages(place?.id ?? 0); // place id로 리뷰 이미지 가져오기
          urls = res?.data || [];
          if (urls.length > 0) {
            usedReviewFallback = true; // 리뷰 이미지 안내 문구
          }
        } catch (error) {
          console.error("리뷰 이미지 로딩 실패", error);
        }
      }

      setImages(urls);
      setIsReviewImageFallback(usedReviewFallback);
    };

    loadImages();
  }, [contentId, serviceKey, place?.id]);

  // 대표이미지 이동
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // tourAPI 인근관광지 api 연동
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const loadPlaces = async () => {
      if (!place?.contentTypeId || !serviceKey || !longitude || !latitude)
        return;

      const nearby = await fetchNearbyPlaces(
        place.contentTypeId,
        longitude,
        latitude,
        serviceKey
      );
      setPlaces(nearby);
    };

    loadPlaces();
  }, [place?.contentTypeId, longitude, latitude, serviceKey]);

  // 인근관광지 상태 추가
  const [activeNearTab, setActiveNearTab] = useState<
    "식당" | "숙소" | "관광지"
  >("식당");

  // 인근관광지 필터링된 장소
  const filteredPlaces = places.filter((place) => {
    if (activeNearTab === "식당") return place.contenttypeid === "39"; // 식당
    if (activeNearTab === "숙소") return place.contenttypeid === "32"; // 숙소
    if (activeNearTab === "관광지")
      return ["12", "14", "15", "25", "28", "38"].includes(place.contenttypeid);
    return true;
  });

  // 사용자 위치
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  // 사용자 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
          setLoading(false);
        },
        (error) => {
          console.error("사용자 위치를 가져오는데 실패했습니다.", error);

          setLoading(false);
        }
      );
    } else {
      console.error("브라우저에서 위치 정보를 지원하지 않습니다.");
      setLoading(false);
    }
  }, []);

  // 이색 상세 조회 api 연동
  const [placeDetail, setPlaceDetail] = useState<PlaceDetailType | null>(null);

  // 리뷰 작성 후 placeDetail 다시 불러오기 함수
  const fetchPlaceDetail = async () => {
    if (!contentId || !contentTypeId) return;

    try {
      let res;

      if (userLat != null && userLng != null) {
        res = await getPlace(
          contentId,
          contentTypeId,
          place?.id ?? 0,
          userLat,
          userLng
        );
      } else {
        res = await getPlaceUserNull(contentId, contentTypeId, place?.id ?? 0);
      }

      if (res.data) {
        setPlaceDetail(res.data);
      }
    } catch (error) {
      console.error("이색 관광지 상세 조회 실패", error);
    }
  };

  // placeDetail 로딩 useEffect
  useEffect(() => {
    if (!loading) {
      fetchPlaceDetail();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, contentTypeId, userLat, userLng, place?.id, loading]);

  // 북마크 api 연동
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    placeDetail?.isBookmarked ?? false
  );

  useEffect(() => {
    if (placeDetail) {
      setIsBookmarked(placeDetail.isBookmarked ?? false);
    }
  }, [placeDetail]);

  const handleBookmarkClick = async () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (!placeDetail?.id) return;

    try {
      if (isBookmarked) {
        await deleteBookmark(placeDetail.id);
        setIsBookmarked(false);
      } else {
        await postBookmark(placeDetail.id);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("북마크 처리 실패", error);
      alert("북마크 처리 중 오류가 발생했습니다.");
    }
  };

  // 컴포넌트 상단
  const nearCardRef = useRef<HTMLDivElement>(null);

  // 리뷰 상태
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5; // 페이지당 리뷰 개수

  // 현재 페이지 리뷰 계산
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // 총 페이지 수
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // 리뷰 정렬
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reviewSortOptions = [
    { label: "최신순", value: "LATEST" },
    { label: "평점순", value: "RATING_DESC" },
  ];
  const [reviewSortType, setReviewSortType] = useState<
    "LATEST" | "RATING_DESC"
  >("LATEST");

  // 리뷰 버튼
  const handleReview = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    setIsReviewModalOpen(true);
  };

  // 리뷰 불러오기
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchReviews = async () => {
    if (!placeDetail?.id) return;

    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const res = await getReview(placeDetail.id, reviewSortType, 100); // 여기에서 정렬 타입 반영
      setReviews(res.data.reviewResponses || []);
    } catch (error: any) {
      setReviewsError("세션이 만료되었습니다. 다시 로그인해주세요.");
    } finally {
      setReviewsLoading(false);
    }
  };

  // placeDetail이 바뀔 때 리뷰 호출
  useEffect(() => {
    if (!loading && placeDetail) fetchReviews();
  }, [placeDetail, loading, reviewSortType, fetchReviews]);

  // 비행기 평균별점 계산
  const renderStars = (score: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(score)) {
        // 정수 부분: 불투명
        stars.push(<AirPlaneReivew key={i} style={{ opacity: 1 }} />);
      } else if (i === Math.ceil(score) && score % 1 !== 0) {
        // 소수점 부분: opacity 조절
        const fractional = score % 1;
        stars.push(<AirPlaneReivew key={i} style={{ opacity: fractional }} />);
      } else {
        // 나머지: 회색 비행기
        stars.push(<AirPlaneReivewX key={i} />);
      }
    }

    return stars;
  };

  // 로그인 모달
  const [showLoginModal, setShowLoginModal] = useState(false);

  // === 로딩 화면 ===
  if (loading) {
    return (
      <Container>
        <LoadingWrapper>
          <Spinner />
          <LoadingText>위치 정보를 가져오는 중입니다...</LoadingText>
        </LoadingWrapper>
      </Container>
    );
  }

  return (
    <Container>
      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          title="로그인이 필요해요!"
          description={
            <>
              대한민국 속 숨겨진 나라를 찾고 싶다면
              <br />
              로그인을 해주세요!
            </>
          }
          confirmText="로그인"
          onConfirm={() => (window.location.href = "/login")}
        />
      )}
      <Content>
        <TopSection>
          <ImageWrapper>
            {images.length > 0 ? (
              <>
                <MainImage
                  src={images[currentIndex]}
                  alt={`관광지 이미지 ${currentIndex + 1}`}
                />
                <ArrowButton left onClick={handlePrev}>
                  <span id="left">
                    <ImageLeft />
                  </span>
                </ArrowButton>
                <ArrowButton right onClick={handleNext}>
                  <span id="right">
                    <ImageRight />
                  </span>
                </ArrowButton>
                <ImageIndex>
                  {currentIndex + 1} / {images.length}
                </ImageIndex>

                {/* 리뷰 이미지로 대체된 경우 안내 문구 */}
                {isReviewImageFallback && (
                  <NoticeText>
                    해당 사진은 리뷰 이미지로 대체되었습니다.
                  </NoticeText>
                )}
              </>
            ) : (
              <LogoFallback>
                <Logo />
              </LogoFallback>
            )}
          </ImageWrapper>

          <InfoCard>
            {placeDetail?.countryKoreanNames?.map(
              (name: string, idx: number) => (
                <Chip key={idx}>{name}</Chip>
              )
            )}
            <Title>{placeDetail?.title}</Title>
            <Review>
              <AirPlane />{" "}
              <span>
                {place?.reviewScoreAverage} 리뷰 {place?.reviewCount}
              </span>
            </Review>
            <Location>
              <SubTitle>위치</SubTitle>
              {placeDetail?.address}
            </Location>
            <Location>
              <SubTitle>종류</SubTitle>
              {placeDetail?.contentTypeKoreanName}
            </Location>
            <Distance>
              {placeDetail?.distance != null
                ? `나의 현재 위치에서 ${(placeDetail.distance / 1000).toFixed(
                    1
                  )}km`
                : "위치 정보 없음"}
            </Distance>
            <BookmarkButton
              bookmarked={isBookmarked}
              onClick={handleBookmarkClick}
            >
              {isBookmarked ? <BookmarkBlue /> : <BookmarkWhite />}
              <span>
                {isBookmarked ? "북마크 취소하기" : "북마크 저장하기"}
              </span>
            </BookmarkButton>
          </InfoCard>
        </TopSection>

        <BottomSection>
          <WrapperLeft>
            {/* 탭 메뉴 */}
            <TabMenu>
              {["소개", "지도", "인근 관광지", "리뷰"].map((tab) => (
                <Tab
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => handleTabClick(tab as any)}
                >
                  {tab}
                </Tab>
              ))}
            </TabMenu>

            {/* 소개 */}
            <Section ref={introRef}>
              <SectionTitle>소개</SectionTitle>
              {placeDetail?.infoItemList?.map((item: InfoItem, idx) => (
                <React.Fragment key={idx}>
                  <SectionSubTitle>{item.name}</SectionSubTitle>
                  <Text dangerouslySetInnerHTML={{ __html: item.content }} />
                </React.Fragment>
              ))}
            </Section>

            {/* 지도 */}
            <Section ref={mapRef}>
              <SectionTitle>지도</SectionTitle>
              {placeDetail?.latitude && placeDetail?.longitude ? (
                <KakaoMap
                  points={[
                    {
                      latitude: placeDetail.latitude,
                      longitude: placeDetail.longitude,
                      title: placeDetail.title,
                      address: placeDetail.address,
                    },
                  ]}
                />
              ) : (
                <MapImage src="https://placehold.co/600x300" />
              )}
              <Address>{placeDetail?.address}</Address>
            </Section>

            {/* 인근 관광지 */}
            <Section ref={nearbyRef}>
              <SectionTitle>인근 관광지</SectionTitle>
              <NearTabs>
                {["식당", "숙소", "관광지"].map((tab) => (
                  <NearTab
                    key={tab}
                    active={activeNearTab === tab}
                    onClick={() => setActiveNearTab(tab as any)}
                  >
                    {tab}
                  </NearTab>
                ))}
              </NearTabs>

              {/* 래퍼 + 좌우 버튼 */}
              <NearCardWrapper>
                <ArrowButton
                  left
                  onClick={() => {
                    nearCardRef.current?.scrollBy({
                      left: -300,
                      behavior: "smooth",
                    });
                  }}
                >
                  <ImageLeft />
                </ArrowButton>

                <NearCardBox ref={nearCardRef}>
                  {filteredPlaces.length === 0 ? (
                    <NoNearPlaceMessage>
                      선택한 카테고리의
                      <br />
                      인근 관광지가 없습니다.
                    </NoNearPlaceMessage>
                  ) : (
                    filteredPlaces.map((place, idx) => (
                      <NearCard
                        key={idx}
                        title={place.title}
                        addr1={place.addr1}
                        contentid={place.contentid}
                        contenttypeid={place.contenttypeid}
                        dist={place.dist}
                        firstimage={place.firstimage}
                        latitude={latitude}
                        longitude={longitude}
                        title2={placeDetail?.title}
                        addr2={placeDetail?.address}
                      />
                    ))
                  )}
                </NearCardBox>

                <ArrowButton
                  right
                  onClick={() => {
                    nearCardRef.current?.scrollBy({
                      left: 300,
                      behavior: "smooth",
                    });
                  }}
                >
                  <ImageRight />
                </ArrowButton>
              </NearCardWrapper>
            </Section>

            {/* 리뷰 */}
            <Section ref={reviewRef}>
              <SectionTitle>
                다녀간 사람들의 생생한 후기 <span>{place?.reviewCount}</span>
              </SectionTitle>
              <ReviewHeader>
                <Rating>
                  {placeDetail?.reviewScoreAverage
                    ? renderStars(placeDetail.reviewScoreAverage)
                    : Array(5).fill(<AirPlaneReivewX />)}
                  <span>{placeDetail?.reviewScoreAverage?.toFixed(1)}</span>
                </Rating>
                <ReviewButton onClick={handleReview}>리뷰</ReviewButton>
              </ReviewHeader>
              <ReviewCardBox>
                <Sequence>
                  {[
                    { label: "최신순", value: "LATEST" },
                    { label: "평점순", value: "RATING_DESC" },
                  ].map((opt) => (
                    <SortItem
                      key={opt.value}
                      $active={reviewSortType === opt.value}
                      onClick={() => {
                        setReviewSortType(
                          opt.value as "LATEST" | "RATING_DESC"
                        );
                        setCurrentPage(1); // 페이지 초기화
                      }}
                    >
                      {opt.label}
                    </SortItem>
                  ))}
                </Sequence>

                {reviewsLoading && <div id="info">리뷰 로딩중...</div>}
                {reviewsError && <div id="info">{reviewsError}</div>}
                {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                  <div id="info">리뷰가 없습니다.</div>
                )}
                {!reviewsLoading &&
                  !reviewsError &&
                  currentReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      reviewer={review.userNickname}
                      score={review.score}
                      tags={review.tags.map(
                        (tagKey: string) =>
                          TAGS.find((t) => t.key === tagKey)?.label || tagKey
                      )}
                      text={review.content}
                      images={review.imageUrls}
                      date={
                        review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""
                      }
                    />
                  ))}

                {/* 페이지네이션 버튼 */}
                {totalPages > 1 && (
                  <Pagination
                    page={currentPage - 1} // currentPage는 1-based → 0-based로 변환
                    totalPages={totalPages}
                    onPageChange={(n) => setCurrentPage(n + 1)} // 다시 1-based로 변환
                  />
                )}
              </ReviewCardBox>
            </Section>
          </WrapperLeft>
          <WrapperRight />
        </BottomSection>
      </Content>
      {isReviewModalOpen && placeDetail?.id && (
        <ReviewModal
          onClose={() => {
            setIsReviewModalOpen(false);
            fetchReviews(); // 리뷰 다시 불러오기
            fetchPlaceDetail(); // placeDetail 다시 불러오기 (리뷰 개수/평균 업데이트)
          }}
          placeId={placeDetail.id}
        />
      )}
    </Container>
  );
};

export default PlaceDetail;

const Container = styled.div`
  color: #111;
  background: #fff;
`;

const Content = styled.main`
  width: 1000px;
  margin: 20px auto;

  @media (max-width: 1200px) {
    width: 90%;
  }

  @media (max-width: 780px) {
    width: 100%;
    padding: 0 16px;
  }
`;

const TopSection = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 780px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const BottomSection = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 780px) {
    flex-direction: column;
    gap: 20px;
  }
`;
const WrapperLeft = styled.div`
  position: relative;
  flex: 1.65;
`;
const WrapperRight = styled.div`
  position: relative;
  flex: 1.2;
`;
const ImageWrapper = styled.div`
  position: relative;
  flex: 2;

  #left {
    margin-right: 3px;
    margin-top: 3px;
  }

  #right {
    margin-left: 3px;
    margin-top: 3px;
  }
`;
const MainImage = styled.img`
  width: 100%;
  height: 400px;
  border-radius: 24px;
  object-fit: cover;

  @media (max-width: 780px) {
    height: 250px;
  }
`;
const LogoFallback = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.color.gray200};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.gray500};
  gap: 10px;

  svg {
    width: 80px;
    height: 80px;
    opacity: 0.8;
  }
`;

const ImageIndex = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
`;

const ArrowButton = styled.button<{ left?: boolean; right?: boolean }>`
  position: absolute;
  top: 50%;
  ${({ left }) => left && `left: 12px;`}
  ${({ right }) => right && `right: 12px;`}
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  color: #fff;
  border: none;
  font-size: 20px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9;

  &:hover {
    background: rgba(255, 255, 255);
  }
`;
const NoticeText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.gray600};
  text-align: center;
  margin-top: 6px;
`;

const InfoCard = styled.div`
  flex: 1.2;
  background: ${({ theme }) => theme.color.white};
  padding: 36px;
  border-radius: 32px;
  text-align: left;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 780px) {
    padding: 20px;
  }
`;

const Chip = styled.div`
  display: inline-block;
  ${({ theme }) => theme.font.sm.bold};
  color: ${({ theme }) => theme.color.primary500};
  background-color: #e3f2fd80;
  padding: 4px 8px;
  border-radius: 20px;
  margin: 0 3px;
  margin-bottom: 8px;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.sm.semibold};
  }
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  margin: 8px 0;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xxl.bold};
  }
`;

const Review = styled.div`
  ${({ theme }) => theme.font.xxl.medium};
  color: #666;
  margin-bottom: 15px;

  display: flex;
  align-items: center;
  gap: 6px;

  span {
    margin: 0;
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.md.medium};
  }
`;
const SubTitle = styled.span`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.gray600};
  margin: 6px 0;
  margin-right: 10px;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.semibold};
  }
`;

const Location = styled.div`
  ${({ theme }) => theme.font.xxl.medium};
  color: ${({ theme }) => theme.color.gray800};
  margin-bottom: 10px;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.medium};
  }
`;

const Distance = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.primary500};
  margin-top: 15px;
  margin-bottom: 2px;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.semibold};
    margin-top: 7px;
    margin-bottom: 0px;
  }
`;
const BookmarkButton = styled.button<{ bookmarked?: boolean }>`
  ${({ theme }) => theme.font.xxl.medium};
  width: 100%;
  height: 60px;
  margin-top: 20px;
  padding: 10px;
  border: 2px solid #1e90ff;
  border-radius: 10px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  background: ${({ bookmarked }) => (bookmarked ? "#fff" : "#1e90ff")};
  color: ${({ bookmarked }) => (bookmarked ? "#1e90ff" : "#fff")};
  transition: background 0.3s, color 0.3s;

  svg {
    flex-shrink: 0;
    transition: fill 0.3s;
    fill: ${({ bookmarked }) => (bookmarked ? "#1e90ff" : "#fff")};
  }

  span {
    margin: 0;
  }

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.medium};
    margin-top: 10px;
  }
`;

const TabMenu = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.primary500};

  display: flex;
  justify-content: left;
  margin: 50px 0px;
`;
const Tab = styled.div<{ active?: boolean }>`
  padding: 10px 42px;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? "2px solid #1e90ff" : "none")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "#1e90ff" : "#666")};
  transition: color 0.2s;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.medium};
    padding: 10px 15px;
  }
`;

const Section = styled.section`
  margin: 50px 0;
`;
const SectionTitle = styled.h2`
  ${({ theme }) => theme.font.xxxl.bold};
  color: ${({ theme }) => theme.color.gray800};
  margin-bottom: 12px;
  text-align: left;

  span {
    ${({ theme }) => theme.font.xxxl.semibold};
    color: ${({ theme }) => theme.color.primary500};
  }

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xxl.bold};
    span {
      ${({ theme }) => theme.font.xxl.bold};
    }
  }
`;
const SectionSubTitle = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.gray800};
  margin-bottom: 10px;
  text-align: left;

  span {
    ${({ theme }) => theme.font.xxxl.semibold};
    color: ${({ theme }) => theme.color.primary500};
  }

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.bold};
  }
`;
const Text = styled.div`
  ${({ theme }) => theme.font.xxl.medium};
  color: ${({ theme }) => theme.color.gray800};
  text-align: left;
  margin-bottom: 30px;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.md.medium};
  }
`;

const MapImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;
const Address = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: #555;
  text-align: left;
`;
const NearCardWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const NearTabs = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  margin-bottom: 30px;
  text-align: center;
`;
const NearTab = styled.div<{ active?: boolean }>`
  ${({ theme }) => theme.font.xl.medium};
  color: ${({ theme }) => theme.color.white};
  width: 95px;
  height: 35px;
  line-height: 35px;
  border-radius: 8px;
  background: ${({ active }) => (active ? "#1e90ff" : "#f0f0f0")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  cursor: pointer;
`;

const NearCardBox = styled.div`
  max-width: 600px;
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }
`;
const NoNearPlaceMessage = styled.div`
  flex: 1 0 100%; /* 부모 flex에 맞춤 */
  width: 600px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  color: ${({ theme }) => theme.color.gray800};
  ${({ theme }) => theme.font.xl.semibold};

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.md.semibold};
  }
`;

const ReviewHeader = styled.div`
  display: flex;
`;

const Rating = styled.div`
  ${({ theme }) => theme.font.xxxl.semibold};
  color: ${({ theme }) => theme.color.gray800};
  margin: 15px 0;
  margin-bottom: 25px;
  text-align: left;

  display: flex;
  align-items: center; // 수직 중앙 정렬
  gap: 5px; // 아이콘과 텍스트 간 간격

  svg {
    margin: 5px;
  }

  @media (max-width: 780px) {
    svg {
      width: 35px;
      margin: 0px;
    }
  }
`;

const ReviewButton = styled.button`
  ${({ theme }) => theme.font.md.semibold};
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.primary500};
  height: 50px;
  margin-left: auto;
  margin-top: 15px;
  padding: 10px 30px;
  border: none;
  border-radius: 16px;
  cursor: pointer;

  align-items: center;
  justify-content: center;
  transition: background 0.3s, color 0.3s;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.sm.medium};
    padding: 0px 15px;
  }
`;
const Sequence = styled.div`
  display: flex;
  gap: 12px;
  ${({ theme }) => theme.font.md.semibold};
  color: ${({ theme }) => theme.color.gray600};
  cursor: pointer;
`;

const SortItem = styled.span<{ $active?: boolean }>`
  color: ${({ $active, theme }) =>
    $active ? theme.color.primary600 : theme.color.gray600};
  position: relative;
  padding: 4px 15px;

  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme, $active }) =>
      $active ? theme.color.primary600 : "transparent"};
    border-radius: 2px;
  }
`;

const ReviewCardBox = styled.div`
  #info {
    margin: 40px 20px;
    text-align: center;
  }
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  margin-top: 16px;
  font-size: 18px;
  color: ${({ theme }) => theme.color.gray600};
`;

const Spinner = styled.div`
  border: 6px solid ${({ theme }) => theme.color.gray200};
  border-top: 6px solid ${({ theme }) => theme.color.primary500};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
