import React from "react";
import styled from "styled-components";
import { ReactComponent as AirPlane } from "../../assets/main/Airplane.svg";

interface ReviewCardProps {
  reviewer: string;
  score: number;
  tags?: string[];
  text: string;
  images?: string[];
  date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewer,
  score,
  tags = [],
  text,
  images = [],
  date,
}) => {
  return (
    <CardWrapper>
      <Sequence>
        <span>리뷰 많은 순</span> | 거리순 | 평점순 | 조회순
      </Sequence>

      <ReviewHeader>
        <Reviewer>{reviewer}</Reviewer>
        <ReportBtn>신고</ReportBtn>
      </ReviewHeader>

      <ReviewScore>
        <AirPlane /> {score.toFixed(1)}
      </ReviewScore>

      <ReviewTag>
        {tags.map((tag, idx) => (
          <Tag key={idx}>{tag}</Tag>
        ))}
      </ReviewTag>

      <ReviewText>{text}</ReviewText>

      {images.length > 0 && (
        <ReviewImages>
          {images.map((img, idx) => (
            <ReviewImg key={idx} style={{ backgroundImage: `url(${img})` }} />
          ))}
        </ReviewImages>
      )}

      <ReviewDate>{date}</ReviewDate>
    </CardWrapper>
  );
};

export default ReviewCard;

const CardWrapper = styled.div`
  border-top: 1px solid #eee;
  padding: 16px 0;
  text-align: left;
`;

const Sequence = styled.div`
  ${({ theme }) => theme.font.xs.semibold};
  color: ${({ theme }) => theme.color.gray400};
  cursor: pointer;
  margin: 25px 0px;

  span {
    color: ${({ theme }) => theme.color.gray800};
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: left;
`;

const Reviewer = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.gray800};
  margin-right: 10px;
`;

const ReportBtn = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
`;

const ReviewScore = styled.div`
  ${({ theme }) => theme.font.md.medium};
  color: ${({ theme }) => theme.color.gray800};
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 5px;

  svg {
    margin: 5px;
  }
`;

const ReviewTag = styled.div``;

const Tag = styled.div`
  ${({ theme }) => theme.font.xs.bold};
  color: ${({ theme }) => theme.color.primary500};
  background-color: #e3f2fd80;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 8px;
  margin: 8px 8px 8px 0;
`;

const ReviewText = styled.div`
  margin: 12px 0;
  color: #444;
  text-align: left;
`;

const ReviewImages = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  gap: 15px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }
`;

const ReviewImg = styled.div`
  flex: 0 0 auto;
  width: 150px;
  height: 150px;
  background: #ddd;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

const ReviewDate = styled.div`
  ${({ theme }) => theme.font.md.medium};
  color: ${({ theme }) => theme.color.gray500};
  margin: 12px 0px;
  text-align: left;
`;
