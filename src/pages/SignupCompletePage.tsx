import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SignupComplete } from "../assets/login/SignupComplete.svg";

interface SignupCompletePageProps {
  onSignupComplete?: (nickname: string) => void; // App 상태 갱신용
}

const SignupCompletePage: React.FC<SignupCompletePageProps> = ({
  onSignupComplete,
}) => {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname") || "사용자";
  const profileImg = localStorage.getItem("profileImage") || "";

  // 페이지 로드 시 App 상태 업데이트
  useEffect(() => {
    if (onSignupComplete) {
      onSignupComplete(nickname); // Navbar에 nickname, login 상태 반영
    }
  }, [nickname, onSignupComplete]);

  return (
    <Container>
      <Card>
        <SignupComplete />
        <Label>회원가입 완료</Label>
        <Title>{nickname}님, 환영해요!</Title>

        <HomeButton
          onClick={() => {
            if (onSignupComplete) onSignupComplete(nickname); // 바로 App 상태 갱신
            navigate("/"); // 홈으로 이동
          }}
        >
          서비스 이용하러 가기
        </HomeButton>
      </Card>
    </Container>
  );
};

export default SignupCompletePage;

const Container = styled.div`
  background: ${({ theme }) => theme.color.gray100};
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 480px;
  background: white;
  border-radius: 32px;
  padding: 50px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 500px) {
    width: 90%;
    padding: 30px 20px;
    border-radius: 20px;

    svg {
      width: 160px;
      height: auto;
      margin-bottom: 20px;
    }
  }
`;

const Label = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  margin-bottom: 10px;
  color: ${({ theme }) => theme.color.primary500};

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.semibold};
    margin-bottom: 6px;
  }
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.semibold};
  margin-bottom: 37px;
  color: ${({ theme }) => theme.color.gray800};

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.semibold};
    margin-bottom: 24px;
  }
`;

const HomeButton = styled.button`
  ${({ theme }) => theme.font.xl.semibold};
  color: ${({ theme }) => theme.color.gray50};
  background: ${({ theme }) => theme.color.primary500};
  width: 368px;
  border: none;
  border-radius: 16px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease-in-out;

  &:hover {
    transform: scale(1.01) translateY(-1px);
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  @media (max-width: 780px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 12px;
  }
`;
