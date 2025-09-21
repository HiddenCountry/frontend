import React, { useState, useRef, ChangeEvent } from "react";
import styled from "styled-components";
import { ReactComponent as AirPlaneReview } from "../../assets/place/AirplaneReview.svg";
import { ReactComponent as CloseIcon } from "../../assets/place/Close.svg";
import { postReview } from "../../api/Review";
import { TAGS } from "../../constants/Tags";

interface ReviewModalProps {
  onClose: () => void;
  placeId: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ onClose, placeId }) => {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const step2Ref = useRef<HTMLDivElement | null>(null);

  const token = localStorage.getItem("accessToken") || "";

  const toggleTag = (key: string) => {
    setSelectedTags((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : prev.length < 5
        ? [...prev, key]
        : prev
    );
  };

  const handleNext = () => {
    setStep(2);
    step2Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...files]);
      setPreviewUrls((prev) => [...prev, ...urls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await postReview(placeId, {
        score: rating,
        tags: selectedTags,
        content,
        images,
        token,
      });
      alert("리뷰가 등록되었습니다!");
      onClose();
    } catch (error) {
      console.error("리뷰 등록 실패", error);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  const getTagsByType = (type: "FOOD" | "MOOD" | "ETC") =>
    TAGS.filter((tag) => tag.type === type);

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

        {step === 1 && (
          <>
            <Section>
              <Label>이 곳은 어땠나요?</Label>
              <Hint>이색 점수를 드래그를 통해 선택해주세요!</Hint>

              <RatingBox>
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarButton key={n} onClick={() => setRating(n)}>
                    <AirPlaneReview
                      style={{ opacity: n <= rating ? 1 : 0.3 }}
                    />
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
                  {getTagsByType("FOOD").map((tag) => (
                    <Tag
                      key={tag.key}
                      selected={selectedTags.includes(tag.key)}
                      onClick={() => toggleTag(tag.key)}
                    >
                      {tag.label}
                    </Tag>
                  ))}
                </TagColumn>
                <TagColumn>
                  <Category>분위기</Category>
                  {getTagsByType("MOOD").map((tag) => (
                    <Tag
                      key={tag.key}
                      selected={selectedTags.includes(tag.key)}
                      onClick={() => toggleTag(tag.key)}
                    >
                      {tag.label}
                    </Tag>
                  ))}
                </TagColumn>
                <TagColumn>
                  <Category>기타</Category>
                  {getTagsByType("ETC").map((tag) => (
                    <Tag
                      key={tag.key}
                      selected={selectedTags.includes(tag.key)}
                      onClick={() => toggleTag(tag.key)}
                    >
                      {tag.label}
                    </Tag>
                  ))}
                </TagColumn>
              </TagWrapper>
            </Section>

            <SubmitButton onClick={handleNext}>다음</SubmitButton>
          </>
        )}

        {step === 2 && (
          <Step2 ref={step2Ref}>
            <Section>
              <Label>해당 별점을 준 이유를 설명해 주세요.</Label>
              <Hint>최대 1,000자까지 입력할 수 있어요.</Hint>
              <TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="리뷰를 작성해주세요"
              />
            </Section>

            <Section>
              <Label>사진</Label>
              <PhotoUploadWrapper>
                {previewUrls.map((url, idx) => (
                  <PhotoPreview key={idx}>
                    <img src={url} alt={`preview ${idx}`} />
                    <RemoveButton onClick={() => handleRemoveImage(idx)}>
                      X
                    </RemoveButton>
                  </PhotoPreview>
                ))}
                <PhotoUploadBox>
                  <input
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">+</label>
                </PhotoUploadBox>
              </PhotoUploadWrapper>
            </Section>

            <CompleteButton onClick={handleSubmit}>완료</CompleteButton>
          </Step2>
        )}
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
  max-height: 80vh;
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
  text-align: left;
`;

const Hint = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 15px;
  text-align: left;
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
  padding: 7px 5px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  background: ${({ selected }) => (selected ? "#1e90ff" : "#f2f2f2")};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  font-size: 14px;
  text-align: center;
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
  label {
    cursor: pointer;
  }
`;

const CompleteButton = styled(SubmitButton)`
  background: #0095ff;
`;

const PhotoUploadWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const PhotoPreview = styled.div`
  position: relative;
  width: 64px;
  height: 64px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: red;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
`;
