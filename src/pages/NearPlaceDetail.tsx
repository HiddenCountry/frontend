import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { fetchTourImages } from "../api/TourApi";
import KakaoMap from "../components/place/KakaoMap";
import { ReactComponent as ImageLeft } from "../assets/place/ImageLeft.svg";
import { ReactComponent as ImageRight } from "../assets/place/ImageRight.svg";
import {
  getPlaceNear,
  getPlaceNearUserNull,
  getPlaceUserNull,
} from "../api/Place";
import { ReactComponent as Logo } from "../assets/layout/Logo.svg";

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
  const { contentid, contenttypeid, latitude, longitude, title2, addr2 } =
    location.state;

  const [activeTab, setActiveTab] = useState<"소개" | "지도">("소개");

  const introRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  const [placeDetail, setPlaceDetail] = useState<PlaceDetailType | null>(null);
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 탭 클릭 시 스크롤
  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    const target = tab === "소개" ? introRef.current : mapRef.current;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 이미지 불러오기
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

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
        },
        (error) => {
          console.error("사용자 위치를 가져오는데 실패했습니다.", error);
          setLoading(false); // 실패 시 로딩 종료
        }
      );
    } else {
      console.error("브라우저에서 위치 정보를 지원하지 않습니다.");
      setLoading(false);
    }
  }, []);

  // placeDetail 불러오기 (사용자 위치 필요)
  useEffect(() => {
    const fetchPlaceDetail = async () => {
      if (!contentid || !contenttypeid) return;

      try {
        let res;

        if (userLat != null && userLng != null) {
          res = await getPlaceNear(contentid, contenttypeid, userLat, userLng);
        } else {
          res = await getPlaceNearUserNull(contentid, contenttypeid);
        }
        if (res.data) setPlaceDetail(res.data);
      } catch (error) {
        console.error("이색 관광지 상세 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetail();
  }, [contentid, contenttypeid, userLat, userLng]);

  // 로딩 화면
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
              </>
            ) : (
              <LogoFallback>
                <Logo />
              </LogoFallback>
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
              {placeDetail?.distance != null
                ? `나의 현재 위치에서 ${(placeDetail.distance / 1000).toFixed(
                    1
                  )}km`
                : "위치 정보 없음"}
            </Distance>
          </InfoCard>
        </TopSection>

        <BottomSection>
          <WrapperLeft>
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

            <Section ref={introRef}>
              <SectionTitle>소개</SectionTitle>
              {placeDetail?.infoItemList?.map((item, idx) => (
                <React.Fragment key={idx}>
                  <SectionSubTitle>{item.name}</SectionSubTitle>
                  <Text dangerouslySetInnerHTML={{ __html: item.content }} />
                </React.Fragment>
              ))}
            </Section>

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
                    {
                      latitude: latitude,
                      longitude: longitude,
                      title: title2,
                      address: addr2,
                    },
                  ]}
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
  align-items: flex-start;

  @media (max-width: 780px) {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
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
  align-items: center;
  justify-content: center;
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
  ${({ left }) => left && `left: 12px;`} ${({ right }) =>
    right && `right: 12px;`} transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 780px) {
    padding: 20px; /* 모바일에서는 패딩 줄이기 */
  }
`;
const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  margin: 8px 0;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xxl.bold};
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
  margin-bottom: 8px;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.semibold};
    margin-top: 7px;
    margin-bottom: 0px;
  }
`;
const TabMenu = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.primary500};
  display: flex;
  justify-content: left;
  margin: 50px 0;
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
