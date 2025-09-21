import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Boomark } from "../../assets/main/Bookmark.svg";
import { ReactComponent as Airplane } from "../../assets/main/Airplane.svg";
import { ReactComponent as Logo } from "../../assets/layout/Logo.svg";

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
      <BookmarkButton>{isBookmarked && <Boomark />}</BookmarkButton>
      <ImageBox>
        {firstImage ? (
          <Img style={{ backgroundImage: `url(${firstImage})` }} />
        ) : (
          <FallbackIcon>
            <>
              <Logo />
            </>
          </FallbackIcon>
        )}
      </ImageBox>

      <Content>
        <Title>{title}</Title>
        <Meta>
          <Airplane />
          <span>
            {reviewScoreAverage} 리뷰 {reviewCount}
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
`;

const BookmarkButton = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`;
const ImageBox = styled.div`
  background: #f1f3f6;
  height: 150px;
  border-radius: 24px 24px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
  }
`;

const Content = styled.div`
  background: ${({ theme }) => theme.color.white};
  font-size: 13px;
  padding: 12px 16px;
  border-radius: 0px 0px 24px 24px;

  text-align: left;
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxl.bold};
  margin-bottom: 6px;
`;
const Meta = styled.div`
  ${({ theme }) => theme.font.sm.medium};
  color: #666;
  margin-bottom: 8px;

  display: flex;
  align-items: center; // 수직 중앙 정렬
  gap: 6px; // 아이콘과 텍스트 간 간격

  span {
    margin: 0; // 기존 margin 제거
  }

  svg {
    flex-shrink: 0; // 아이콘이 줄어들지 않도록
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span<{ blue?: boolean }>`
  background: ${(props) => (props.blue ? "#e8f0fe" : "#f5f5f5")};
  color: ${(props) => (props.blue ? "#1a73e8" : "#555")};
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 11px;
`;
