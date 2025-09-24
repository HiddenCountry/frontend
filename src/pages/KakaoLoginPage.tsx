import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Callout } from "../assets/login/Callout.svg";
import { ReactComponent as KakaoLogo } from "../assets/login/KakaoLogo.svg";
import { ReactComponent as LoginIcon } from "../assets/login/LoginIcon.svg";

const KakaoLoginPage: React.FC = () => {
  const navigate = useNavigate();

  // 스크롤 막기
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 카카오 로그인
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  const kakaoLogin = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`;

  return (
    <Container>
      <Card>
        <Title>
          로그인하고 <br />
          <Highlight>국내 속 세계 여행</Highlight>을 떠나보세요!
        </Title>
        <StyledLoginIcon />

        <KakaoButton onClick={() => (window.location.href = kakaoLogin)}>
          <Callout id="callout" />
          <span>
            <KakaoLogo /> 카카오로 시작하기
          </span>
        </KakaoButton>
      </Card>
    </Container>
  );
};

export default KakaoLoginPage;

const Container = styled.div`
  background: ${({ theme }) => theme.color.gray100};
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 120px;
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
    padding: 30px;
    border-radius: 24px;
  }

  @media (max-width: 480px) {
    padding: 30px;
    border-radius: 20px;
  }
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  text-align: left;

  @media (max-width: 768px) {
    ${({ theme }) => theme.font.xxl.bold};
  }

  @media (max-width: 480px) {
    ${({ theme }) => theme.font.xl.bold};
  }
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.color.primary500};
`;
const StyledLoginIcon = styled(LoginIcon)`
  width: 200px;
  height: auto;
  margin-bottom: 35px;

  @media (max-width: 768px) {
    width: 160px;
  }

  @media (max-width: 480px) {
    width: 120px;
  }
`;
const KakaoButton = styled.button`
  ${({ theme }) => theme.font.xl.semibold};
  color: ${({ theme }) => theme.color.black};
  background: #fee500;
  width: 368px;
  border: none;
  border-radius: 16px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease-in-out; /* 자연스러운 애니메이션 */

  &:hover {
    transform: scale(1.01) translateY(-1px);
  }

  #callout {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 16px;
  }
`;
