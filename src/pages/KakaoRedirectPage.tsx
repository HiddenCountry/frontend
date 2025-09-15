import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getCallback } from "../api/Kakao";
import { ReactComponent as Callout } from "../assets/login/Callout.svg";
import { ReactComponent as KakaoLogo } from "../assets/login/KakaoLogo.svg";
import { ReactComponent as LoginIcon } from "../assets/login/LoginIcon.svg";

const KakaoRedirectPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      getCallback(code)
        .then((res) => {
          console.log("카카오 로그인 응답:", res);

          if (res.isSuccess) {
            const { accessToken, refreshToken, isFirstLogin } = res.data;

            // 토큰 저장
            localStorage.setItem("accessToken", accessToken);

            // 첫 로그인 → 닉네임 입력 페이지
            if (isFirstLogin) {
              navigate("/signup");
            } else {
              navigate("/"); // 홈으로 이동
            }
          } else {
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("카카오 로그인 실패:", error);
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
          navigate("/");
        });
    }
  }, []);

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
