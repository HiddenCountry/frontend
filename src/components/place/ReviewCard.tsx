import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as AirPlane } from "../../assets/main/Airplane.svg";
import { ReactComponent as ImageLeft } from "../../assets/place/ImageLeft.svg";
import { ReactComponent as ImageRight } from "../../assets/place/ImageRight.svg";

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! + 1) % images.length);
    }
  };

  return (
    <>
      <CardWrapper>
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
              <ReviewImg
                key={idx}
                style={{ backgroundImage: `url(${img})` }}
                onClick={() => setSelectedIndex(idx)}
              />
            ))}
          </ReviewImages>
        )}

        <ReviewDate>{date}</ReviewDate>
      </CardWrapper>

      {selectedIndex !== null && (
        <ModalOverlay onClick={() => setSelectedIndex(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ArrowBtnLeft onClick={handlePrev}>
              <ImageLeft />
            </ArrowBtnLeft>
            <ModalImg src={images[selectedIndex]} alt="review" />
            <ArrowBtnRight onClick={handleNext}>
              <ImageRight />
            </ArrowBtnRight>
            <CloseBtn onClick={() => setSelectedIndex(null)}>✕</CloseBtn>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ReviewCard;

const CardWrapper = styled.div`
  border-top: 1px solid #eee;
  padding: 16px 0;
  text-align: left;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: left;
`;

const Reviewer = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.gray800};
  margin-right: 10px;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.semibold};
  }
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
  margin: 5px 0;
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

  @media (max-width: 780px) {
    margin: 4px 4px 4px 0;
  }
`;

const ReviewText = styled.div`
  margin: 12px 0;
  color: #444;
  text-align: left;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xs.medium};
  }
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
  cursor: pointer;
`;

const ReviewDate = styled.div`
  ${({ theme }) => theme.font.sm.medium};
  color: ${({ theme }) => theme.color.gray500};
  margin: 5px 0px;
  text-align: left;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalImg = styled.img`
  width: 600px; // 모달 이미지 가로 폭 통일
  max-height: 80vh; // 세로는 화면 기준 제한
  object-fit: contain; // 비율 유지하면서 맞춤
  border-radius: 12px;
  display: block;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  font-size: 28px;
  color: white;
  cursor: pointer;
`;
const ArrowBtnLeft = styled.button`
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;

  svg {
    width: 15px;
    height: 15px;
    margin-top: 3px;
    margin-right: 2px;
  }
`;

const ArrowBtnRight = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;

  svg {
    width: 15px;
    height: 15px;
    margin-top: 3px;
    margin-left: 2px;
  }
`;
