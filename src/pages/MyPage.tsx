import React, { useMemo, useState } from "react";
import styled from "styled-components";
import ListSection, {CardList} from './../components/mypage/ListSection';
import ListItem from "../components/mypage/ListItem";
import { ReactComponent as ProfileSvg } from "../assets/mypage/profile.svg";

type Place = { id: number; name: string; rating: number; reviews: number; address: string; };
type Review = { id: number; placeName: string; rating: number; content: string; };

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"saved" | "reviews">("saved");
  const [page, setPage] = useState(1);

  const places: Place[] = useMemo(
    () => Array.from({ length: 6 }).map((_, i) => ({
      id: i + 1, name: "니지모리 스튜디오", rating: 4.9, reviews: 342,
      address: "경기 동두천시 천보산로 567-12",
    })), []
  );

  const reviews: Review[] = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => ({
      id: i + 1, placeName: "니지모리 스튜디오", rating: 5.0,
      content: "리뷰 내용입니다. 리뷰 내용입니다. 리뷰 내용입니다. 리뷰 내용입니다. 리뷰 내용입니다...",
    })), []
  );

  const isSaved = activeTab === "saved";
  const totalCount = isSaved ? places.length : reviews.length;

  const RATING_MESSAGES: Record<number, string> = {
    1: "기대 이하였어요",
    2: "그냥 그랬어요",
    3: "나쁘지 않았어요",
    4: "좋았어요!",
    5: "완벽했어요!",
  };
  const getRatingMessage = (score: number) =>
    RATING_MESSAGES[Math.min(5, Math.max(1, Math.round(score)))];

  return (
    <Container>
      <Main>
        <LeftCard>
          <Profile>
            <Avatar />
            <Nickname>숨은나라찾기 님</Nickname>
          </Profile>

          <Menu>
            <MenuItem role="tab" aria-selected={isSaved} $active={isSaved} onClick={() => setActiveTab("saved")}>
              저장한 장소 리스트
            </MenuItem>
            <MenuItem role="tab" aria-selected={!isSaved} $active={!isSaved} onClick={() => setActiveTab("reviews")}>
              작성한 리뷰
            </MenuItem>
          </Menu>
        </LeftCard>

        <ListSection
          title={isSaved ? "저장한 장소 리스트" : "작성한 리뷰"}
          count={totalCount}
          page={page}
          totalPages={5}
          onPageChange={setPage}
        >
          <CardList>
            {isSaved
              ? places.map((p) => (
                  <ListItem
                    key={p.id}
                    variant="saved"
                    name={p.name}
                    rating={p.rating}
                    reviews={p.reviews}
                    address={p.address}
                  />
                ))
              : reviews.map((r) => (
                  <ListItem
                    key={r.id}
                    variant="review"
                    placeName={r.placeName}
                    rating={r.rating}
                    message={getRatingMessage(r.rating)}
                    snippet={r.content}
                  />
                ))}
          </CardList>
        </ListSection>
      </Main>
    </Container>
  );
};

export default MyPage;

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
    transition: opacity .15s ease;
    z-index: -1;       
  }

  &:hover::after {
    opacity: ${({ $active }) => ($active ? 0 : 1)};
  }
  &:focus-visible::after {
    opacity: ${({ $active }) => ($active ? 0 : 1)};
  }
`;
