import React, { useState, useEffect } from "react";
import KakaoMapRoute from "./KakaoMapRoute";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import {
  deleteTravelCourseDetail,
  getTravelCourseDetail,
} from "../api/TravelCourse";
import { ReactComponent as Logo } from "../assets/layout/Logo.svg";

/* ============ kakao 전역 타입 ============ */
declare global {
  interface Window {
    kakao: any;
  }
}

/* ============ 앱키 (CRA) ============ */
const KAKAO_JS_KEY: string =
  (process.env.REACT_APP_KAKAO_JS_KEY as string) || "";

/* ============ SDK 로더 훅 ============ */
function useKakaoLoader(appkey: string) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!appkey) {
      console.error("REACT_APP_KAKAO_JS_KEY가 비어 있습니다.");
      return;
    }
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => setLoaded(true));
      return;
    }
    const id = "kakao-sdk";
    if (document.getElementById(id)) {
      const t = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(t);
          window.kakao.maps.load(() => setLoaded(true));
        }
      }, 50);
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false&libraries=services,clusterer`;
    s.onload = () => window.kakao.maps.load(() => setLoaded(true));
    document.head.appendChild(s);
  }, [appkey]);

  return loaded;
}

const TravelRouteDetailPage: React.FC = () => {
  useKakaoLoader(KAKAO_JS_KEY);
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = (location.state as any)?.courseId as number;
  const [loading, setLoading] = useState(false);

  const [courseData, setCourseData] = useState<{
    title: string;
    color: string;
    places: any[];
  } | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const res = await getTravelCourseDetail(courseId);
        const data = res.data;
        setCourseData({
          title: data.title,
          color: "#0288d1",
          places: data.places,
        });
      } catch (err) {
        console.error("코스 상세 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [courseId]);

  const goDetail = (p: any) => {
    const anyP = p as any;

    navigate("/main/place", {
      state: {
        id: anyP.id as number,
        contentId: anyP.contentId,
        contentTypeId: anyP.contentTypeId,
        longitude: anyP.longitude,
        latitude: anyP.latitude,
      },
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 이 여행 코스를 삭제하시겠습니까?")) return;

    try {
      setLoading(true);
      await deleteTravelCourseDetail(courseId);
      alert("코스 삭제에 성공했습니다.");
      navigate(-1); // 이전 페이지로 이동
    } catch (err) {
      console.error(err);
      alert("코스 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!courseData) return <div>로딩중...</div>;

  return (
    <Page>
      {/* 타이틀 */}
      <Header>
        <Title>{courseData.title}</Title>
        <TopRoute>
          <RouteLine $gradEnd={courseData.color} />
          <Plane>✈️</Plane>
          {courseData.places.map((item) => (
            <RouteNode key={item.id}>{item.title}</RouteNode>
          ))}
          <DeleteButton onClick={handleDelete} disabled={loading}>
            {loading ? "삭제중..." : "삭제"}
          </DeleteButton>
        </TopRoute>
      </Header>

      {/* 좌우 컨텐츠 */}
      <Content>
        <LeftPanel>
          {courseData.places.map((item) => (
            <PlaceCard key={item.id}>
              <PlaceCardInner onClick={() => goDetail(item)}>
                <PlaceInfo>
                  <PlaceTitle>{item.title}</PlaceTitle>
                  <PlaceDesc>{item.description}</PlaceDesc>
                </PlaceInfo>
                <PlaceImage>
                  {item.firstImage ? (
                    <img
                      src={item.firstImage}
                      alt={item.title}
                      loading="lazy"
                    />
                  ) : (
                    <FallbackIcon>
                      <Logo />
                    </FallbackIcon>
                  )}
                </PlaceImage>
              </PlaceCardInner>
            </PlaceCard>
          ))}
        </LeftPanel>

        <RightPanel>
          <KakaoMapRoute
            points={courseData.places.map((item) => ({
              lat: item.latitude,
              lng: item.longitude,
              title: item.title,
            }))}
          />
        </RightPanel>
      </Content>
    </Page>
  );
};

export default TravelRouteDetailPage;

const Page = styled.div`
  ${({ theme }) => theme.font.md.regular}
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.header``;

const Title = styled.h1`
  ${({ theme }) => theme.font.xxxl.bold};
  text-align: center;
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.color.primary500};
`;

const DeleteButton = styled.button`
  ${({ theme }) => theme.font.sm.medium};
  background-color: ${({ theme }) => theme.color.gray100};
  color: ${({ theme }) => theme.color.gray500};
  padding: 3px 10px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.color.gray500};
  cursor: pointer;
  position: absolute;
  right: 0;
  bottom: -30px;
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.color.gray300};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.color.gray400};
    cursor: not-allowed;
    transform: none;
  }
`;

const TopRoute = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 1rem 0;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.8rem;
    padding: 0.5rem 0;
  }
`;

const RouteLine = styled.div<{ $gradEnd: string }>`
  position: absolute;
  top: 50%;
  left: 5%;
  right: 5%;
  height: 3px;
  border-radius: 8px;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.color.primary500},
    ${({ $gradEnd }) => $gradEnd}
  );
  z-index: 1;
`;

const RouteNode = styled.div`
  position: relative;
  z-index: 2;
  background: ${({ theme }) => theme.color.white};
  border: 3px solid ${({ theme }) => theme.color.primary500};
  border-radius: 12px;
  padding: 0 15px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.font.sm.semibold};
  color: ${({ theme }) => theme.color.primary500};
  white-space: nowrap;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: scale(1.06);
    background: #f0faff;
  }

  @media (max-width: 768px) {
    padding: 0 10px;
    height: 32px;
    font-size: 0.75rem;
  }
`;

const Plane = styled.div`
  position: absolute;
  top: calc(50% - 12px);
  left: 5%;
  font-size: 1.5rem;
  animation: fly 10s linear infinite;
  z-index: 3;

  @keyframes fly {
    0% {
      left: 5%;
      transform: rotate(10deg);
    }
    50% {
      left: 50%;
      transform: rotate(0deg);
    }
    100% {
      left: 95%;
      transform: rotate(-10deg);
    }
  }
`;

const Content = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1 1 400px;
  background: ${({ theme }) => theme.color.white};
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PlaceCard = styled.article`
  background: ${({ theme }) => theme.color.white};
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
  padding: 1rem;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-3px);
  }

  @media (max-width: 500px) {
    padding: 0.8rem;
  }
`;

const PlaceCardInner = styled.div`
  display: flex;
  align-items: flex-start; /* 위 정렬 */
  justify-content: space-between; /* 좌 텍스트 / 우 이미지 */
  gap: 1rem;

  @media (max-width: 500px) {
    flex-direction: column; /* 모바일에서는 세로 배치 */
    align-items: center;
  }
`;

const PlaceImage = styled.div`
  img {
    width: 200px;
    height: 120px;
    border-radius: 12px;
    object-fit: cover;

    @media (max-width: 500px) {
      width: 70%;
      height: auto;
      display: block;
      margin: 0 auto;
    }
  }
`;

const FallbackIcon = styled.div`
  background-color: ${({ theme }) => theme.color.gray200};
  width: 200px;
  height: 120px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 48px;
    height: 48px;
    opacity: 0.8;
  }

  @media (max-width: 500px) {
    svg {
      width: 36px;
      height: 36px;
      opacity: 0.8;
    }
  }
`;
const PlaceInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
  justify-content: flex-start; /* 위쪽 정렬 */
  text-align: left;

  @media (max-width: 500px) {
    align-items: center; /* 모바일에서는 가운데 정렬 */
    text-align: center;
  }
`;

const PlaceTitle = styled.div`
  ${({ theme }) => theme.font.xl.bold};
  color: ${({ theme }) => theme.color.primary500};

  @media (max-width: 500px) {
    ${({ theme }) => theme.font.md.bold};
  }
`;

const PlaceDesc = styled.p`
  margin: 0.4rem 0 0;
  ${({ theme }) => theme.font.sm.regular};
  color: ${({ theme }) => theme.color.gray700};

  @media (max-width: 500px) {
    ${({ theme }) => theme.font.xs.regular};
  }
`;

const RightPanel = styled.section`
  flex: 1 1 500px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;
