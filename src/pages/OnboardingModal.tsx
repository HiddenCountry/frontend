import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as Step1Icon } from "../assets/onboarding/Step1.svg";
import { ReactComponent as Step2Icon } from "../assets/onboarding/Step2.svg";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "팀원들이 직접 큐레이션 했어요!",
      description:
        "딥러닝으로 국내 장소들의 분위기를 분석하고,\n국내의 이국적인 장소들만 모았어요!",
      icon: <Step1Icon />,
    },
    {
      title: "이국적인 풍경을 즐길 수 있어요!",
      description:
        "마치 다른 나라에 온 듯한,\n특별한 국내 여행지를 지금 만나보세요!",
      icon: <Step2Icon />,
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onClose(); // 마지막 스텝이면 모달 닫기
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Content>
          <IconWrapper>{steps[step].icon}</IconWrapper>
          <Title>{steps[step].title}</Title>
          <Description>{steps[step].description}</Description>
        </Content>
        <Footer>
          {step > 0 ? (
            <Button onClick={handlePrev}>이전</Button>
          ) : (
            <div /> // 이전 버튼이 없을 때 왼쪽 공간 채우기
          )}
          <Button primary onClick={handleNext}>
            {step === steps.length - 1 ? "완료" : "다음"}
          </Button>
        </Footer>

        <StepIndicator>
          {steps.map((_, idx) => (
            <Dot key={idx} active={idx === step} />
          ))}
        </StepIndicator>
      </ModalContainer>
    </Overlay>
  );
};

export default OnboardingModal;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  width: 500px;
  background: #fff;
  border-radius: 24px;
  padding: 40px 30px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
`;

const Content = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const IconWrapper = styled.div`
  margin-bottom: 24px;
  svg {
    width: 120px;
    height: 120px;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #555;
  white-space: pre-line; /* \n 줄바꿈 적용 */
`;
const Footer = styled.div`
  display: flex;
  justify-content: space-between; /* 왼쪽/오른쪽 배치 */
  width: 100%;
  margin-top: 30px;
  gap: 10px;
`;

const Button = styled.button<{ primary?: boolean }>`
  background: ${({ primary }) => (primary ? "#1e90ff" : "#f0f0f0")};
  color: ${({ primary }) => (primary ? "#fff" : "#333")};
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.85;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const Dot = styled.div<{ active?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#1e90ff" : "#ccc")};
`;
