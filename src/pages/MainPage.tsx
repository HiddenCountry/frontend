import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FilterSidebar from "../components/main/FilterSidebar";
import SearchBar from "../components/main/SearchBar";
import { ReactComponent as Africa } from "../assets/main/Africa.svg";
import { ReactComponent as Arab } from "../assets/main/Arab.svg";
import { ReactComponent as China } from "../assets/main/China.svg";
import { ReactComponent as Europe } from "../assets/main/Europe.svg";
import { ReactComponent as India } from "../assets/main/India.svg";
import { ReactComponent as Japan } from "../assets/main/Japan.svg";
import { ReactComponent as Mongolia } from "../assets/main/Mongolia.svg";
import { ReactComponent as NorthAmerica } from "../assets/main/NorthAmerica.svg";
import { ReactComponent as Oceania } from "../assets/main/Oceania.svg";
import { ReactComponent as SouthAmerica } from "../assets/main/SouthAmerica.svg";
import { ReactComponent as SoutheastAsia } from "../assets/main/SoutheastAsia.svg";
import { ReactComponent as Turkey } from "../assets/main/Turkey.svg";
import { ReactComponent as Error } from "../assets/login/LoginError.svg";
import CardItem from "../components/main/CardItem";
import MainPagination from "../components/main/Pagination";
import { getPlaces } from "../api/Place";

interface Place {
  id: number;
  firstImage: string;
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

const countryInfoMap: Record<
  string,
  { nameKR: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }
> = {
  AFRICA: { nameKR: "아프리카", Icon: Africa },
  ARAB: { nameKR: "아랍", Icon: Arab },
  CHINA: { nameKR: "중화/중국", Icon: China },
  EUROPE: { nameKR: "유럽", Icon: Europe },
  INDIA: { nameKR: "인도", Icon: India },
  JAPAN: { nameKR: "일본", Icon: Japan },
  MONGOLIA: { nameKR: "몽골", Icon: Mongolia },
  NORTH_AMERICA: { nameKR: "북아메리카", Icon: NorthAmerica },
  OCEANIA: { nameKR: "오세아니아", Icon: Oceania },
  SOUTH_AMERICA: { nameKR: "남아메리카", Icon: SouthAmerica },
  SOUTHEAST_ASIA: { nameKR: "동남아시아", Icon: SoutheastAsia },
  TURKEY: { nameKR: "터키", Icon: Turkey },
};

const MainPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialCountryRegion = queryParams.get("countryRegion") || "EUROPE";

  const [places, setPlaces] = useState<Place[]>([]);
  //const [currentPage, setCurrentPage] = useState(0);
  const initialPage = Math.max(
    0,
    parseInt(queryParams.get("page") || "1", 10) - 1
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const cardsPerPage = 6;

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 필터 상태
  const [filters, setFilters] = useState({
    areaCode: [] as string[],
    contentType: [] as string[],
    season: [] as string[],
    countryRegion: initialCountryRegion,
    sortType: "VIEW_COUNT_DESC",
  });

  // Banner용 나라 및 아이콘
  const currentCountryInfo = countryInfoMap[filters.countryRegion] || {
    nameKR: "일본",
    Icon: Japan,
  };
  const { nameKR, Icon } = currentCountryInfo;

  // 이색 관광지 api 연동
  const fetchPlaces = (lat: number, lng: number) => {
    return getPlaces(
      currentPage,
      cardsPerPage,
      filters.areaCode,
      filters.contentType,
      filters.season,
      filters.countryRegion,
      filters.sortType,
      lat,
      lng,
      searchKeyword
    )
      .then((res) => {
        if (res?.data?.content) {
          setPlaces(res.data.content);
          setTotalPages(res.data.totalPage);
        }
      })
      .catch((error) => {
        console.error("장소 가져오기 실패", error);
      });
  };

  // 위치 기반으로 호출
  useEffect(() => {
    setLoading(true); // 호출 시작 시 로딩 시작
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchPlaces(latitude, longitude).finally(() => setLoading(false)); // API 완료 후 로딩 종료
      },
      (error) => {
        console.error("위치 정보를 가져올 수 없습니다:", error);
        // 위치 없으면 기본 좌표
        fetchPlaces(37.5665, 126.978).finally(() => setLoading(false)); // API 완료 후 로딩 종료
      }
    );
  }, [currentPage, filters, searchTrigger]);

  const sortOptions = [
    { label: "조회순", value: "VIEW_COUNT_DESC" },
    { label: "거리순", value: "DISTANCE_ASC" },
    { label: "평점순", value: "REVIEW_SCORE_AVERAGE_DESC" },
    { label: "리뷰 많은 순", value: "REVIEW_COUNT_DESC" },
  ];

  // 메인페이지 page url 표ㅣㅅ
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("page", (currentPage + 1).toString());
    navigate({ search: newParams.toString() }, { replace: true });
  }, [currentPage, location.search, navigate]);

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
      <Main>
        <Path>
          <Link to="/">세계지도</Link> &gt; <span>{nameKR}</span>
        </Path>
        <Banner>
          <BannerText>
            여권 없이, {nameKR} 여행
            <br />
            함께 떠나볼까요?
          </BannerText>
          <Icon />
        </Banner>
        <Content>
          <SidebarWrapper>
            <FilterSidebar
              onFilterChange={(newFilters) => {
                setFilters((prev) => ({
                  ...prev,
                  ...newFilters,
                }));
                setCurrentPage(0);
              }}
            />
          </SidebarWrapper>
          <RightSection>
            <SearchBar
              value={searchKeyword}
              onChange={(val) => setSearchKeyword(val)}
              onSearch={() => {
                setCurrentPage(0);
                setSearchTrigger((prev) => prev + 1);
              }}
            />
            <Sequence>
              {sortOptions.map((opt) => (
                <SortItem
                  key={opt.value}
                  $active={filters.sortType === opt.value}
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, sortType: opt.value }));
                    setCurrentPage(0); // 페이지 초기화
                  }}
                >
                  {opt.label}
                </SortItem>
              ))}
            </Sequence>
            <CardBox>
              {places.length > 0 ? (
                places.map((place) => (
                  <CardItem
                    key={place.id}
                    id={place.id}
                    firstImage={place.firstImage}
                    contentId={place.contentId}
                    reviewScoreAverage={place.reviewScoreAverage}
                    reviewCount={place.reviewCount}
                    addr1={place.addr1}
                    season={place.season}
                    hashtags={place.hashtags}
                    isBookmarked={place.isBookmarked}
                    title={place.title}
                    contentTypeName={place.contentTypeName}
                    contentTypeId={place.contentTypeId}
                    longitude={place.longitude}
                    latitude={place.latitude}
                    distance={place.distance}
                  />
                ))
              ) : (
                <EmptyMessage>
                  <Error />
                  <div>아직 등록된 장소가 없습니다. </div>
                  <br />
                  우리 서비스는 데이터를 계속 모으고 있어요. <br />
                  직접 <strong>장소 등록 문의</strong> 기능을 이용해 주시면 더욱
                  풍성한 여행 정보를 함께 만들 수 있습니다! ✈️
                </EmptyMessage>
              )}
            </CardBox>
          </RightSection>
        </Content>
        <MainPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={(n) => setCurrentPage(n)}
        />
      </Main>
    </Container>
  );
};

export default MainPage;

const Container = styled.div`
  background: #fff;
  min-height: 100vh;
`;

const Main = styled.main`
  max-width: 1000px;
  margin: 0 auto;
`;
const Path = styled.div`
  ${({ theme }) => theme.font.md.semibold};
  color: ${({ theme }) => theme.color.gray500};
  text-align: left;
  margin: 20px;
  cursor: pointer;

  span {
    color: ${({ theme }) => theme.color.gray700};
  }

  a {
    color: ${({ theme }) => theme.color.gray500};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
const Banner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.color.primary50};
  padding: 20px 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  @media (max-width: 500px) {
    padding: 20px;
  }
`;

const BannerText = styled.div`
  ${({ theme }) => theme.font.xxl.bold};
  text-align: left;

  @media (max-width: 500px) {
    ${({ theme }) => theme.font.md.bold};
  }
`;
const Content = styled.div`
  display: flex;
  gap: 20px;

  /* 화면 좁아지면 세로로 쌓기 */
  @media (max-width: 780px) {
    flex-direction: column;
  }
`;

const SidebarWrapper = styled.div`
  flex: 0 0 220px;

  /* 데스크탑: 사이드바처럼 고정 */
  @media (min-width: 781px) {
    position: sticky;
    top: 20px;
  }

  /* 모바일: 위쪽으로 내려서 검색바 아래에 노출 */
  @media (max-width: 780px) {
    width: 100%;
    position: relative;
    top: auto;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Sequence = styled.div`
  display: flex;
  gap: 12px;
  ${({ theme }) => theme.font.md.semibold};
  color: ${({ theme }) => theme.color.gray600};
  cursor: pointer;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.sm.semibold};
    gap: 6px;
  }
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
const CardBox = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 12px;
  justify-content: center;

  @media (max-width: 780px) {
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;
    justify-items: center;
    gap: 5px;
  }

  @media (max-width: 350px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const EmptyMessage = styled.div`
  ${({ theme }) => theme.font.xl.medium};
  color: ${({ theme }) => theme.color.gray600};
  text-align: center;
  padding: 40px 20px;
  border: 1px dashed ${({ theme }) => theme.color.gray300};
  border-radius: 12px;
  grid-column: 1 / -1; // 전체 그리드 차지

  div {
    ${({ theme }) => theme.font.xxl.bold};
    color: ${({ theme }) => theme.color.black};

    margin-top: 15px;
  }
`;

// 로딩 스타일
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
