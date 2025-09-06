import React from "react";
import styled from "styled-components";
import { ReactComponent as Boomark } from "../../assets/main/Bookmark.svg";
import { ReactComponent as Airplane } from "../../assets/main/Airplane.svg";

const CardItem: React.FC = () => {
  return (
    <Card>
      <BookmarkButton>
        <Boomark />
      </BookmarkButton>
      <ImageBox />
      <Content>
        <Title>니지모리 스튜디오</Title>
        <Meta>
          <Airplane />
          <span>4.9 리뷰 342</span>
        </Meta>
        <Meta>경기 동두천시 천보산로 567-12</Meta>
        <Tags>
          <Tag blue>외국 느낌 낭낭</Tag>
          <Tag>chip</Tag>
          <Tag>chip</Tag>
        </Tags>
      </Content>
    </Card>
  );
};

export default CardItem;

const Card = styled.div`
  width: 240px;
  background: ${({ theme }) => theme.color.white};
  border-radius: 24px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
  margin-bottom: 12px;
`;

const Content = styled.div`
  font-size: 13px;
  margin: 12px 16px;
  text-align: left;
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxl.bold};
  margin-bottom: 6px;
`;
const Meta = styled.div`
  ${({ theme }) => theme.font.md.medium};
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
