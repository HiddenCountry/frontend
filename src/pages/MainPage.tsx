import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
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
  OCEANINA: { nameKR: "오세아니아", Icon: Oceania },
  SOUTH_AMERICA: { nameKR: "남아메리카", Icon: SouthAmerica },
  SOUTHEAST_ASIA: { nameKR: "동남아시아", Icon: SoutheastAsia },
  TURKEY: { nameKR: "터키", Icon: Turkey },
};

const MainPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCountryRegion = queryParams.get("countryRegion") || "EUROPE";

  const [places, setPlaces] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const cardsPerPage = 6;

  // 필터 상태
  const [filters, setFilters] = useState({
    areaCode: [] as string[],
    contentType: [] as string[],
    season: [] as string[],
    countryRegion: initialCountryRegion,
    sortType: "VIEW_COUNT_DESC",
  });

  //Banner용 나라 및 아이콘
  const currentCountryInfo = countryInfoMap[filters.countryRegion] || {
    nameKR: "일본",
    Icon: Japan,
  };
  const { nameKR, Icon } = currentCountryInfo;

  // api 연동
  const fetchPlaces = async (lat: number, lng: number) => {
    try {
      const res = await getPlaces(
        currentPage, // API에 0페이지부터 시작
        cardsPerPage,
        filters.areaCode,
        filters.contentType,
        filters.season,
        filters.countryRegion,
        filters.sortType,
        lat,
        lng,
        searchKeyword
      );
      if (res?.data?.content) {
        setPlaces(res.data.content);
        setTotalPages(res.data.totalPage);
      }
    } catch (error) {
      console.error("장소 가져오기 실패", error);
    }
  };

  // 위치 기반으로 호출
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchPlaces(latitude, longitude);
      },
      (error) => {
        console.error("위치 정보를 가져올 수 없습니다:", error);
        fetchPlaces(37.5665, 126.978);
      }
    );
  }, [currentPage, filters, searchKeyword]);

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
              onSearch={() => setCurrentPage(0)}
            />
            <Sequence>
              <span>조회순</span> | 거리순 | 평점순 | 리뷰 많은 순
            </Sequence>
            <CardBox>
              {places.map((place) => (
                <CardItem
                  key={place.id} // 고유 key
                  id={place.id}
                  firstImage={place.firstImage} // 이미지 URL (없을 수도 있음)
                  contentId={place.contentId}
                  reviewScoreAverage={place.reviewScoreAverage} // 리뷰 점수
                  reviewCount={place.reviewCount} // 리뷰 수
                  addr1={place.addr1} // 주소
                  season={place.season} // 계절
                  hashtags={place.hashtags} // 해시태그 배열
                  isBookmarked={place.isBookmarked} // 즐겨찾기 여부
                  title={place.title} // 장소 이름
                  contentTypeName={place.contentTypeName}
                  contentTypeId={place.contentTypeId}
                  longitude={place.longitude}
                  latitude={place.latitude}
                  distance={place.distance}
                />
              ))}
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
`;

const BannerText = styled.div`
  ${({ theme }) => theme.font.xxl.bold};
  text-align: left;
`;

const Content = styled.div`
  display: flex;
  gap: 20px;
`;

const SidebarWrapper = styled.div`
  flex: 0 0 220px;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Sequence = styled.div`
  ${({ theme }) => theme.font.md.semibold};
  color: ${({ theme }) => theme.color.gray600};
  text-align: left;
  cursor: pointer;

  span {
    color: ${({ theme }) => theme.color.gray800};
  }
`;
const CardBox = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
`;
const Pagination = styled.div`
  display: flex;
  gap: 15px;
  margin: 20px 0;
  justify-content: center;
  align-items: center;
`;

const PageButton = styled.button<{ active?: boolean }>`
  ${({ theme }) => theme.font.xl.medium};

  width: 36px;
  height: 36px;
  border: none;
  background: ${({ active, theme }) =>
    active ? theme.color.primary500 : "white"};
  color: ${({ active, theme }) =>
    active ? theme.color.white : theme.color.gray800};
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.color.primary100};
  }
`;
