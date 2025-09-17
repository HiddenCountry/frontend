import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { ReactComponent as AirPlane } from "../assets/main/Airplane.svg";
import { ReactComponent as AirPlaneReivew } from "../assets/main/AirplaneReview.svg";
import { ReactComponent as BookmarkWhite } from "../assets/main/BookmarkWhite.svg";
import NearCard from "../components/place/NearCard";
import ReviewCard from "../components/place/ReviewCard";
import { fetchTourImages } from "../api/TourApi";
import { getPlace } from "../api/Place";

interface Place {
  title: string;
  addr1: string;
  firstimage: string;
  dist: string;
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

  const location = useLocation();
  const place = location.state as CardItemProps | undefined;
  const contentId = place?.contentId;
  const contentTypeId = place?.contentTypeId;
  const longitude = place?.longitude;
  const latitude = place?.latitude;
  const serviceKey = process.env.REACT_APP_TOUR_SERVICE_KEY;

  // 각 섹션 ref
  const introRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const nearbyRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  // 이미지
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // tourAPI 대표이미지들
  useEffect(() => {
    const loadImages = async () => {
      if (!contentId || !serviceKey) return;
      const urls = await fetchTourImages(contentId, serviceKey);
      setImages(urls);
    };

    loadImages();
  }, [contentId, serviceKey]);

  // 이미지 이동
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // tourAPI 인근관광지 api 연동
  const [places, setPlaces] = useState<Place[]>([]);
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!place?.contentTypeId || !serviceKey) return;

      try {
        const res = await fetch(
          `https://apis.data.go.kr/B551011/KorService2/locationBasedList2?serviceKey=${serviceKey}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&mapX=${longitude}&mapY=${latitude}&arrange=C&radius=20000&contentTypeId=${place.contentTypeId}`
        );
        const data = await res.json();
        const items = data?.response?.body?.items?.item ?? [];

        const mappedPlaces: Place[] = items.map((item: any) => ({
          title: item.title || "제목 없음",
          addr1: item.addr1 || "주소 없음",
          firstimage: item.firstimage || "",
          dist: item.dist || "",
        }));

        setPlaces(mappedPlaces);
      } catch (error) {
        console.error("인근 관광지 불러오기 실패:", error);
        setPlaces([]);
      }
    };

    fetchPlaces();
  }, [place?.contentTypeId, serviceKey]);

  // 이색 상세 조회 api 연동
  const [placeDetail, setPlaceDetail] = useState<PlaceDetailType | null>(null);

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      if (!contentId || !contentTypeId) return;

      try {
        const res = await getPlace(
          contentId,
          contentTypeId,
          place?.id ?? 0,
          latitude!,
          longitude!
        );
        if (res.data) {
          setPlaceDetail(res.data);
        }
      } catch (error) {
        console.error("이색 관광지 상세 조회 실패", error);
      }
    };

    fetchPlaceDetail();
  }, [contentId, contentTypeId, latitude, longitude, place?.id]);

  return (
    <Container>
      <Content>
        <TopSection>
          <ImageWrapper>
            {images.length > 0 && (
              <>
                <MainImage
                  src={images[currentIndex]}
                  alt={`관광지 이미지 ${currentIndex + 1}`}
                />
                <ArrowButton left onClick={handlePrev}>
                  ◀
                </ArrowButton>
                <ArrowButton right onClick={handleNext}>
                  ▶
                </ArrowButton>
                <ImageIndex>
                  {currentIndex + 1} / {images.length}
                </ImageIndex>
              </>
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
              현재 위치에서 {placeDetail?.distance.toLocaleString()}m
            </Distance>
            <BookmarkButton>
              <BookmarkWhite />
              <span>북마크 저장하기</span>
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
              <MapImage src="https://placehold.co/600x300" />
              <Address>경기 동두천시 천보산로 567-12</Address>
            </Section>

            {/* 인근 관광지 */}
            <Section ref={nearbyRef}>
              <SectionTitle>인근 관광지</SectionTitle>
              <NearTabs>
                <NearTab active>전체</NearTab>
                <NearTab>식음</NearTab>
                <NearTab>숙소</NearTab>
                <NearTab>기타</NearTab>
              </NearTabs>
              <NearCardBox>
                {places.map((place, idx) => (
                  <NearCard
                    key={idx}
                    title={place.title}
                    subtitle={place.addr1}
                    imageUrl={place.firstimage || "https://placehold.co/150"}
                  />
                ))}
              </NearCardBox>
            </Section>

            {/* 리뷰 */}
            <Section ref={reviewRef}>
              <SectionTitle>
                다녀간 사람들의 생생한 후기 <span>4</span>
              </SectionTitle>
              <Rating>
                <AirPlaneReivew />
                <AirPlaneReivew />
                <AirPlaneReivew />
                <AirPlaneReivew />
                <AirPlaneReivew /> 5.0
              </Rating>

              <ReviewCardBox>
                <ReviewCard
                  reviewer="숨은나라찾기"
                  score={5}
                  tags={["외국느낌 낭낭", "사진찍기좋음"]}
                  text="리뷰 내용입니다. 리뷰 내용입니다."
                  images={[
                    "https://placehold.co/150",
                    "https://placehold.co/150",
                  ]}
                  date="2025.06.15"
                />
                <ReviewCard
                  reviewer="숨은나라찾기"
                  score={5}
                  tags={["외국느낌 낭낭", "사진찍기좋음"]}
                  text="리뷰 내용입니다. 리뷰 내용입니다."
                  images={[
                    "https://placehold.co/150",
                    "https://placehold.co/150",
                    "https://placehold.co/150",
                    "https://placehold.co/150",
                  ]}
                  date="2025.06.15"
                />
              </ReviewCardBox>
            </Section>
          </WrapperLeft>
          <WrapperRight />
        </BottomSection>
      </Content>
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
`;

const TopSection = styled.div`
  display: flex;
  gap: 40px;
`;
const BottomSection = styled.div`
  display: flex;
  gap: 40px;
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
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  border-radius: 24px;
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
  background: rgba(0, 0, 0, 0.5);
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

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const InfoCard = styled.div`
  flex: 1.2;
  background: ${({ theme }) => theme.color.white};
  padding: 36px;
  border-radius: 32px;
  text-align: left;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Chip = styled.div`
  display: inline-block;
  background: #eee;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  margin: 0 3px;
  margin-bottom: 8px;
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  margin: 8px 0;
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
`;
const SubTitle = styled.span`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.gray600};
  margin: 6px 0;
  margin-right: 10px;
`;

const Location = styled.div`
  ${({ theme }) => theme.font.xxl.medium};
  color: ${({ theme }) => theme.color.gray800};
  margin-bottom: 10px;
`;

const Distance = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.primary500};
  margin-top: 15px;
  margin-bottom: 2px;
`;

const BookmarkButton = styled.button`
  ${({ theme }) => theme.font.xxl.medium};
  width: 100%;
  height: 60px;
  margin-top: 20px;
  padding: 10px;
  border: none;
  background: #1e90ff;
  color: white;
  border-radius: 10px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  span {
    margin: 0;
  }

  svg {
    flex-shrink: 0;
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
`;
const Text = styled.div`
  ${({ theme }) => theme.font.xxl.medium};
  color: ${({ theme }) => theme.color.gray800};
  text-align: left;
  margin-bottom: 30px;
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

const NearTabs = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  margin-bottom: 30px;
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
  width: 100%;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 10px;

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
`;

const ReviewCardBox = styled.div``;
