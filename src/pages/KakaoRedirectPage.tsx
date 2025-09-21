import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getCallback } from "../api/Kakao";
import { ReactComponent as Callout } from "../assets/login/Callout.svg";
import { ReactComponent as KakaoLogo } from "../assets/login/KakaoLogo.svg";
import { ReactComponent as LoginIcon } from "../assets/login/LoginIcon.svg";

interface KakaoRedirectPageProps {
  onLogin?: (token: string, nickname: string, profileImg?: string) => void;
}

const KakaoRedirectPage: React.FC<KakaoRedirectPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      getCallback(code)
        .then((res) => {
          if (res.isSuccess) {
            const { accessToken, nickname, profileImg, isFirstLogin } =
              res.data;

            // 닉네임 기본값 처리
            const safeNickname =
              nickname && nickname !== "undefined" ? nickname : "사용자";

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("nickname", safeNickname);
            if (profileImg) localStorage.setItem("profileImage", profileImg);

            if (onLogin) onLogin(accessToken, nickname, profileImg);

            if (isFirstLogin) navigate("/signup");
            else navigate("/");
          } else {
            alert("로그인 실패");
            navigate("/");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("로그인 실패");
          navigate("/");
        });
    }
  }, [onLogin, navigate]);

  return (
    <Container>
      <Card>
        <Title>
          로그인하고 <br />
          <Highlight>국내 속 세계 여행</Highlight>을 떠나보세요!
        </Title>
        <StyledLoginIcon />

        <KakaoButton>
          <Callout id="callout" />
          <span>
            <KakaoLogo /> 카카오 로그인 중
          </span>
        </KakaoButton>
      </Card>
    </Container>
  );
};

export default KakaoRedirectPage;

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
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  text-align: left;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.color.primary500};
`;
const StyledLoginIcon = styled(LoginIcon)`
  width: 200px;
  height: auto;
  margin-bottom: 35px;
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
`;
