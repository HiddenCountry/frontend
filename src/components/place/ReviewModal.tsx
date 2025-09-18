import React, { useState, useRef } from "react";
import styled from "styled-components";
import { ReactComponent as AirPlaneReview } from "../../assets/place/AirplaneReview.svg";
import { ReactComponent as CloseIcon } from "../../assets/place/Close.svg";

interface ReviewModalProps {
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ onClose }) => {
  const [rating, setRating] = useState(5); // 기본 별점 5
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const step2Ref = useRef<HTMLDivElement | null>(null);

  const foodTags = [
    "음식이 맛있어요",
    "양이 많아요",
    "현지 맛에 가까워요",
    "특별한 메뉴가 많아요",
    "비싼 만큼 가치있어요",
  ];
  const moodTags = [
    "시설이 깔끔해요",
    "아늑해요",
    "컨셉이 독특해요",
    "사진이 잘 나와요",
    "외국 느낌 낭낭",
  ];
  const etcTags = [
    "주차하기 편해요",
    "친절해요",
    "청결해요",
    "사람이 많아요",
    "오래 머무르기 좋아요",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 5
        ? [...prev, tag]
        : prev
    );
  };

  const handleNext = () => {
    setStep(2);
    step2Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Overlay>
      <ModalBox>
        <Header>
          <Step>{step}/2</Step>
          <Title>다녀온 곳의 리뷰를 작성해 보세요!</Title>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </Header>

        {/* STEP 1 */}
        <Section>
          <Label>이 곳은 어땠나요?</Label>
          <RatingBox>
            {[1, 2, 3, 4, 5].map((n) => (
              <StarButton key={n} onClick={() => setRating(n)}>
                <AirPlaneReview style={{ opacity: n <= rating ? 1 : 0.3 }} />
              </StarButton>
            ))}
            <RatingText>
              {rating === 5 ? "완벽했어요!" : `${rating}점`}
            </RatingText>
          </RatingBox>
        </Section>

        <Section>
          <Label>어떤 점이 좋았나요?</Label>
          <Hint>최대 5개까지 선택 가능해요!</Hint>

          <TagWrapper>
            <TagColumn>
              <Category>음식</Category>
              {foodTags.map((tag) => (
                <Tag
                  key={tag}
                  selected={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </TagColumn>

            <TagColumn>
              <Category>분위기</Category>
              {moodTags.map((tag) => (
                <Tag
                  key={tag}
                  selected={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </TagColumn>

            <TagColumn>
              <Category>기타</Category>
              {etcTags.map((tag) => (
                <Tag
                  key={tag}
                  selected={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </TagColumn>
          </TagWrapper>
        </Section>

        {/* STEP 2 */}
        <Step2 ref={step2Ref}>
          <Header>
            <Step>2/2</Step>
            <Title>다녀온 곳의 리뷰를 작성해 보세요!</Title>
          </Header>
          <Section>
            <Label>해당 별점을 준 이유를 설명해 주세요.</Label>
            <Hint>최대 1,000자까지 입력할 수 있어요.</Hint>
            <TextArea placeholder="리뷰를 작성해주세요" />
          </Section>
          <Section>
            <Label>사진</Label>
            <PhotoUploadBox>+</PhotoUploadBox>
          </Section>
          <CompleteButton>완료</CompleteButton>
        </Step2>
      </ModalBox>
    </Overlay>
  );
};

export default ReviewModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
`;

const ModalBox = styled.div`
  background: #fff;
  width: 600px;
  max-height: 80vh; /* 스크롤 가능하도록 */
  overflow-y: auto;
  border-radius: 20px;
  padding: 30px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Step = styled.div`
  font-size: 14px;
  color: #1e90ff;
  font-weight: bold;
`;

const Title = styled.h2`
  flex: 1;
  text-align: center;
  font-size: 20px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Section = styled.div`
  margin: 20px 0;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Hint = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
`;

const RatingBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StarButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
`;

const RatingText = styled.span`
  font-size: 14px;
  color: #333;
  margin-left: 8px;
`;
const TagWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const TagColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Category = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #444;
  margin-bottom: 12px;
`;

const Tag = styled.button<{ selected: boolean }>`
  margin: 4px 0;
  padding: 8px 12px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  background: ${({ selected }) => (selected ? "#1e90ff" : "#f2f2f2")};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  font-size: 14px;
  text-align: left; /* 버튼 텍스트 왼쪽 정렬 */
`;

const SubmitButton = styled.button`
  margin-top: 30px;
  width: 100%;
  height: 50px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #1e90ff;
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Step2 = styled.div`
  margin-top: 50px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 12px;
  font-size: 14px;
  resize: none;
`;

const PhotoUploadBox = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
`;

const CompleteButton = styled(SubmitButton)`
  background: #0095ff;
`;
