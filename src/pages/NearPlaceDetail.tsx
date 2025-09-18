import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { fetchNearbyPlaces, fetchTourImages } from "../api/TourApi";
import KakaoMap from "../components/place/KakaoMap";
import { ReactComponent as ImageLeft } from "../assets/place/ImageLeft.svg";
import { ReactComponent as ImageRight } from "../assets/place/ImageRight.svg";
import { getPlaceNear } from "../api/Place";

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

const NearPlaceDetail: React.FC = () => {
  const serviceKey = process.env.REACT_APP_TOUR_SERVICE_KEY;
  const location = useLocation();
  const { addr1, contentid, contenttypeid, dist, firstimage, title } =
    location.state;

  const [activeTab, setActiveTab] = useState<"소개" | "지도">("소개");

  // 각 섹션 ref
  const introRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // 탭 클릭 시 해당 섹션으로 스크롤
  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    let target: HTMLDivElement | null = null;
    if (tab === "소개") target = introRef.current;
    if (tab === "지도") target = mapRef.current;

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 대표이미지
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // tourAPI 대표이미지들
  useEffect(() => {
    const loadImages = async () => {
      if (!contentid || !serviceKey) return;
      const urls = await fetchTourImages(contentid, serviceKey);
      setImages(urls);
    };

    loadImages();
  }, [contentid, serviceKey]);

  // 이미지 이동
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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
        },
        (error) => {
          console.error("사용자 위치를 가져오는데 실패했습니다.", error);
        }
      );
    }
  }, []);

  // 이색 상세 조회 api 연동
  const [placeDetail, setPlaceDetail] = useState<PlaceDetailType | null>(null);

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      if (!contentid || !contenttypeid) return;

      try {
        const res = await getPlaceNear(
          contentid,
          contenttypeid,
          userLat!,
          userLng!
        );
        if (res.data) {
          setPlaceDetail(res.data);
        }
      } catch (error) {
        console.error("이색 관광지 상세 조회 실패", error);
      }
    };

    fetchPlaceDetail();
  }, [contentid, contenttypeid, userLat, userLng]);

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
                  <ImageLeft />
                </ArrowButton>
                <ArrowButton right onClick={handleNext}>
                  <ImageRight />
                </ArrowButton>
                <ImageIndex>
                  {currentIndex + 1} / {images.length}
                </ImageIndex>
              </>
            )}
          </ImageWrapper>
          <InfoCard>
            <Title>{placeDetail?.title}</Title>
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
          </InfoCard>
        </TopSection>

        <BottomSection>
          <WrapperLeft>
            {/* 탭 메뉴 */}
            <TabMenu>
              {["소개", "지도"].map((tab) => (
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
                  latitude={placeDetail.latitude}
                  longitude={placeDetail.longitude}
                  title={placeDetail.title}
                  address={placeDetail.address}
                />
              ) : (
                <MapImage src="https://placehold.co/600x300" />
              )}
              <Address>{placeDetail?.address}</Address>
            </Section>
          </WrapperLeft>
          <WrapperRight />
        </BottomSection>
      </Content>
    </Container>
  );
};

export default NearPlaceDetail;

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
  align-items: flex-start;
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
  background: rgba(255, 255, 255, 0.9);
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
    background: rgba(255, 255, 255);
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

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  margin: 8px 0;
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
  margin-bottom: 8px;
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
