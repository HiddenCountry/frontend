import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import FilterSidebar from "../components/main/FilterSidebar";
import SearchBar from "../components/main/SearchBar";
import { ReactComponent as Japan } from "../assets/main/Japan.svg";
import { ReactComponent as PageIcon } from "../assets/main/Pagination.svg";
import { ReactComponent as PageEndIcon } from "../assets/main/PaginationEnd.svg";
import CardItem from "../components/main/CardItem";
import { getPlaces } from "../api/Place";

interface Place {
  id: number;
  firstImage: string;
  title: string;
  addr1: string;
  reviewScoreAverage: number;
  reviewCount: number;
  hashtags: string[];
  isBookmarked: boolean;
}

const MainPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const cardsPerPage = 9;

  const fetchPlaces = async () => {
    try {
      const res = await getPlaces(
        currentPage,
        cardsPerPage,
        ["SEOUL"], // areaCode
        [], // contentType
        [], // season
        "EUROPE", // countryRegion
        "REVIEW_COUNT_DESC", // sortType
        0, // userLat
        0, // userLng
        "" // title
      );
      if (res?.data?.content) {
        setPlaces(res.data.content);
        setTotalPages(res.data.totalPage);
      }
    } catch (error) {
      console.error("장소 가져오기 실패", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [currentPage]);

  return (
    <Container>
      <Main>
        <Path>
          <Link to="/">세계지도</Link> &gt; <Link to="/asia">아시아 지도</Link>{" "}
          &gt; <span>일본</span>
        </Path>
        <Banner>
          <BannerText>
            여권 없이, 일본 여행
            <br />
            함께 떠나볼까요?
          </BannerText>
          <Japan />
        </Banner>
        <Content>
          <SidebarWrapper>
            <FilterSidebar />
          </SidebarWrapper>
          <RightSection>
            <SearchBar />
            <Sequence>
              <span>리뷰 많은 순</span> | 거리순 | 평점순 | 조회순
            </Sequence>
            <CardBox>
              <CardItem
                title="니지모리"
                addr1="서울특별시 어쩌구 저꺼구"
                reviewScore={5.0} // 숫자
                reviewCount={5} // 숫자
                hashtags={["외국 느낌 낭낭", "chip"]} // 문자열 배열
                isBookmarked={true} // boolean
                firstImage="" // 빈 문자열 가능
              />
              {places.map((place) => (
                <CardItem
                  key={place.id} // 고유 key
                  title={place.title} // 장소 이름
                  addr1={place.addr1} // 주소
                  reviewScore={place.reviewScoreAverage} // 리뷰 점수
                  reviewCount={place.reviewCount} // 리뷰 수
                  hashtags={place.hashtags} // 해시태그 배열
                  isBookmarked={place.isBookmarked} // 즐겨찾기 여부
                  firstImage={place.firstImage} // 이미지 URL (없을 수도 있음)
                />
              ))}
            </CardBox>
          </RightSection>
        </Content>
        <Pagination>
          <PageEndIcon />
          {Array.from({ length: totalPages }, (_, idx) => (
            <PageButton
              key={idx + 1}
              active={currentPage === idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </PageButton>
          ))}
          <PageIcon />
        </Pagination>
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
