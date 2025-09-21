import React from "react";
import KakaoMapRoute from "./KakaoMapRoute";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

/* ============ 코스 데이터 (각 코스별 고유 color 유지) ============ */
const travelCourses = [
  {
    title: "인천에서 떠나는 아시아 여행!",
    color: "#0288d1",
    data: [
      {
        id: 1765,
        contentId: 3003517,
        contentTypeId: 12,
        title: "인천일본풍거리",
        description:
          "일본 교토의 골목길을 옮겨온 듯한 거리. 목조 건물과 레트로 간판들이 이국적인 산책 코스를 선사합니다.",
        latitude: 37.4736725684,
        longitude: 126.620872904,
        image:
          "http://tong.visitkorea.or.kr/cms/resource/66/3001966_image2_1.jpg",
      },
      {
        id: 533,
        contentId: 264512,
        contentTypeId: 12,
        title: "인천차이나타운",
        description:
          "중국 본토의 차이나타운을 연상케 하는 공간. 붉은 등롱과 황금빛 문양, 다양한 중국 음식을 즐길 수 있는 진짜 여행지 같은 명소입니다.",
        latitude: 37.4738502955,
        longitude: 126.6191619441,
        image:
          "http://tong.visitkorea.or.kr/cms/resource/78/3304278_image2_1.jpg",
      },
      {
        id: 1766,
        contentId: 724036,
        contentTypeId: 39,
        title: "대창반점",
        description:
          "중국 현지 느낌 그대로! 1980년에 개업한 중국 현지 그대로의 중식 맛집!",
        latitude: 37.4746557478,
        longitude: 126.6186369698,
        image:
          "http://tong.visitkorea.or.kr/cms/resource/42/3037342_image2_1.jpg",
      },
      {
        id: 732,
        contentId: 2781336,
        contentTypeId: 12,
        title: "삼국지벽화거리",
        description:
          "중국 삼국지의 장대한 서사가 벽화로 펼쳐진 거리. 한 폭의 역사 속에 들어선 듯한 색다른 여행 경험을 제공합니다.",
        latitude: 37.4745724172,
        longitude: 126.618228676,
        image:
          "http://tong.visitkorea.or.kr/cms/resource/93/3381793_image2_1.jpg",
      },
    ],
  },
  {
    title: "충남에서 떠나는 유럽 여행!",
    color: "#0288d1",
    data: [
      {
        id: 957,
        contentId: 2851299,
        contentTypeId: 12,
        title: "멜로우데이즈",
        description:
          "프랑스 시골 마을의 아기자기한 감성을 담은 카페로, 빈티지한 인테리어와 함께 여유로운 시간을 보낼 수 있는 공간입니다.",
        latitude: 36.4215905273,
        longitude: 126.4115146532,
        image:
          "http://tong.visitkorea.or.kr/cms/resource/93/2851293_image2_1.jpg",
      },
      {
        id: 47,
        contentId: 1932645,
        contentTypeId: 32,
        title: "그람피하우스",
        description:
          "스위스 알프스 마을을 연상시키는 정원과 산책로가 매력적인 힐링 스팟으로, 자연과 함께하는 편안한 시간을 제공합니다.",
        latitude: 36.6565756082,
        longitude: 126.3079150768,
        image:
          "http://tong.visitkorea.or.kr/cms/resource/48/2597748_image2_1.jpg",
      },
      {
        id: 955,
        contentId: 2606741,
        contentTypeId: 12,
        title: "지중해마을",
        description:
          "그리스 산토리니를 연상시키는 하얀 건물과 파란 지붕의 골목길이 매력적인 곳으로, 유럽의 지중해 마을을 그대로 옮겨놓은 듯한 느낌을 줍니다.",
        latitude: 36.7969864197,
        longitude: 127.0616376806,
        image:
          "http://tong.visitkorea.or.kr/cms/resource/83/1938083_image2_1.jpg",
      },
      {
        id: 1767,
        contentId: 662268,
        contentTypeId: 12,
        title: "피나클랜드 수목원",
        description:
          "유럽 정원과 화려한 꽃들로 가득한 동서양 감성이 만점인 공간으로, 다양한 식물과 꽃들을 감상하며 산책할 수 있습니다.",
        latitude: 36.8725197718,
        longitude: 126.926345049,
        image:
          "http://tong.visitkorea.or.kr/cms/resource/81/3350481_image2_1.JPG",
      },
    ],
  },
];

const TravelRoutePage: React.FC = () => {
  useKakaoLoader(KAKAO_JS_KEY);
  const navigate = useNavigate();

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

  const [selected, setSelected] = React.useState<
    (typeof travelCourses)[number]["title"]
  >(travelCourses[0].title);

  const current = travelCourses.find((c) => c.title === selected)!;

  return (
    <Page>
      {/* 메뉴 */}
      <Menu>
        {travelCourses.map((course) => (
          <MenuButton
            key={course.title}
            $active={selected === course.title}
            onClick={() => setSelected(course.title)}
            aria-pressed={selected === course.title}
          >
            {course.title}
          </MenuButton>
        ))}
      </Menu>

      {/* 타이틀 */}
      <Header>
        <Title>{current.title}</Title>
        <TopRoute>
          <RouteLine $gradEnd={current.color} />
          <Plane>✈️</Plane>
          {current.data.map((item) => (
            <RouteNode key={item.id}>{item.title}</RouteNode>
          ))}
        </TopRoute>
      </Header>

      {/* 좌우 컨텐츠 */}
      <Content>
        <LeftPanel>
          {current.data.map((item) => (
            <PlaceCard key={item.id}>
              <PlaceCardInner onClick={() => goDetail(item)}>
                <PlaceInfo>
                  <PlaceTitle>{item.title}</PlaceTitle>
                  <PlaceDesc>{item.description}</PlaceDesc>
                </PlaceInfo>
                <PlaceImage>
                  <img
                    src={item.image || "https://via.placeholder.com/200x120"}
                    alt={item.title}
                    loading="lazy"
                  />
                </PlaceImage>
              </PlaceCardInner>
            </PlaceCard>
          ))}
        </LeftPanel>

        <RightPanel>
          <KakaoMapRoute
            points={current.data.map((item) => ({
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

export default TravelRoutePage;

const Page = styled.div`
  ${({ theme }) => theme.font.md.regular}
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Menu = styled.nav`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MenuButton = styled.button<{ $active?: boolean }>`
  ${({ theme }) => theme.font.md.bold};
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  border: 1px solid
    ${({ theme, $active }) => ($active ? "transparent" : theme.color.gray200)};
  background: ${({ theme, $active }) =>
    $active ? theme.color.primary500 : theme.color.white};
  color: ${({ theme, $active }) =>
    $active ? theme.color.white : theme.color.gray700};
  box-shadow: ${({ $active }) =>
    $active ? "0 4px 12px rgba(0,0,0,0.2)" : "none"};
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.color.gray300};
    background: ${({ theme, $active }) =>
      $active ? theme.color.primary600 : theme.color.gray100};
    color: ${({ theme, $active }) =>
      $active ? theme.color.white : theme.color.gray900};
  }
`;

const Header = styled.header``;

const Title = styled.h1`
  ${({ theme }) => theme.font.xxxl.bold};
  text-align: center;
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.color.primary500};
`;

const TopRoute = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 1rem 0;
`;

const RouteLine = styled.div<{ $gradEnd: string }>`
  position: absolute;
  top: 50%;
  left: 5%;
  right: 5%;
  height: 4px;
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
`;

const Plane = styled.div`
  position: absolute;
  top: calc(50% - 15px);
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
`;

const PlaceCardInner = styled.div`
  display: flex;
  align-items: flex-start; /* 위 정렬 */
  justify-content: space-between; /* 좌 텍스트 / 우 이미지 */
  gap: 1rem;
`;

const PlaceImage = styled.div`
  img {
    width: 200px;
    height: 120px;
    border-radius: 12px;
    object-fit: cover;
  }
`;

const PlaceInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
  justify-content: flex-start; /* 위쪽 정렬 */
  text-align: left;
`;

const PlaceTitle = styled.div`
  ${({ theme }) => theme.font.xl.bold};
  color: ${({ theme }) => theme.color.primary500};
`;

const PlaceDesc = styled.p`
  margin: 0.4rem 0 0;
  ${({ theme }) => theme.font.sm.regular};
  color: ${({ theme }) => theme.color.gray700};
`;

const RightPanel = styled.section`
  flex: 1 1 500px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;
