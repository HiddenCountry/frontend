import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SignupComplete } from "../assets/login/SignupComplete.svg";

const SignupCompletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Card>
        <SignupComplete />
        <Label>회원가입 완료</Label>
        <Title>OOO님, 환영해요!</Title>

        <HomeButton onClick={() => navigate("/")}>
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
`;

const Label = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  margin-bottom: 10px;
  color: ${({ theme }) => theme.color.primary500};
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.semibold};
  margin-bottom: 30px;
  color: ${({ theme }) => theme.color.gray800};
  margin-bottom: 37px;
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
