import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Boomark } from "../../assets/main/Bookmark.svg";
import { ReactComponent as BoomarkX } from "../../assets/main/BookmarkX.svg";
import { ReactComponent as Airplane } from "../../assets/main/Airplane.svg";
import { ReactComponent as Logo } from "../../assets/layout/Logo.svg";
import { deleteBookmark, postBookmark } from "../../api/Bookmark";

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

const CardItem: React.FC<CardItemProps> = ({
  id,
  firstImage,
  contentId,
  reviewScoreAverage,
  reviewCount,
  addr1,
  season,
  hashtags,
  isBookmarked,
  title,
  contentTypeName,
  contentTypeId,
  longitude,
  latitude,
  distance,
}) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  // 북마크 토글 핸들러
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 전체 클릭 막기
    try {
      if (bookmarked) {
        await deleteBookmark(id);
        setBookmarked(false);
      } else {
        await postBookmark(id);
        setBookmarked(true);
      }
    } catch (error) {
      console.error("북마크 토글 실패:", error);
    }
  };
  return (
    <Card
      onClick={() =>
        navigate("place", {
          state: {
            id,
            contentId,
            title,
            firstImage,
            reviewScoreAverage,
            reviewCount,
            addr1,
            season,
            hashtags,
            isBookmarked,
            contentTypeName,
            contentTypeId,
            longitude,
            latitude,
            distance,
          },
        })
      }
    >
      <BookmarkButton onClick={handleBookmarkClick}>
        {bookmarked ? <Boomark /> : <BoomarkX />}
      </BookmarkButton>
      <ImageBox>
        {firstImage ? (
          <Img style={{ backgroundImage: `url(${firstImage})` }} />
        ) : (
          <FallbackIcon>
            <Logo />
          </FallbackIcon>
        )}
      </ImageBox>

      <Content>
        <Title>{title}</Title>
        <Meta>
          <Airplane />
          <span>
            {reviewScoreAverage.toFixed(1)} <span id="review">리뷰</span>{" "}
            {reviewCount}
          </span>
        </Meta>
        <Meta>{addr1}</Meta>
        <Tags>
          {hashtags.map((tag, idx) => (
            <Tag key={idx}>{tag}</Tag>
          ))}
        </Tags>
      </Content>
    </Card>
  );
};

export default CardItem;

const Card = styled.div`
  width: 230px;
  background: ${({ theme }) => theme.color.white};
  border-radius: 24px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 500px) {
    width: 170px;
    border-radius: 16px;
  }
`;

const BookmarkButton = styled.div`
  position: absolute;
  top: 20px;
  right: 15px;
  cursor: pointer;

  @media (max-width: 500px) {
    top: 12px;
    right: 10px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const ImageBox = styled.div`
  background: ${({ theme }) => theme.color.gray200};
  height: 150px;
  border-radius: 24px 24px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 500px) {
    height: 110px;
    border-radius: 16px 16px 0 0;
  }
`;

const Img = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
`;

const FallbackIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.gray400};

  svg {
    width: 48px;
    height: 48px;
    margin-top: 10px;
    opacity: 0.8;
  }

  @media (max-width: 500px) {
    svg {
      width: 36px;
      height: 36px;
    }
  }
`;

const Content = styled.div`
  background: ${({ theme }) => theme.color.white};
  font-size: 13px;
  padding: 12px 16px;
  border-radius: 0px 0px 24px 24px;
  text-align: left;

  @media (max-width: 500px) {
    font-size: 12px;
    padding: 10px 12px;
    border-radius: 0 0 16px 16px;
  }
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xl.bold};
  margin-bottom: 6px;

  @media (max-width: 500px) {
    ${({ theme }) => theme.font.md.bold};
  }
`;

const Meta = styled.div`
  ${({ theme }) => theme.font.sm.medium};
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  #review {
    color: ${({ theme }) => theme.color.primary500};
    ${({ theme }) => theme.font.sm.semibold};
    margin-left: 5px;
  }

  @media (max-width: 500px) {
    font-size: 11px;
    margin-bottom: 6px;
    gap: 4px;

    svg {
      width: 14px;
      height: 14px;
    }

    #review {
      font-size: 11px;
    }
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  @media (max-width: 500px) {
    gap: 4px;
  }
`;

const Tag = styled.span<{ blue?: boolean }>`
  ${({ theme }) => theme.font.xs.bold};
  color: ${({ theme }) => theme.color.primary500};
  background-color: #e3f2fd80;
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 11px;

  @media (max-width: 500px) {
    font-size: 10px;
    padding: 1px 4px;
    border-radius: 4px;
  }
`;
