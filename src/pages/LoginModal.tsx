import React from "react";
import styled from "styled-components";
import { ReactComponent as LoginIcon } from "../assets/login/LoginError.svg";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Content>
          <IconWrapper>
            <LoginIcon />
          </IconWrapper>
          <Title>로그인이 필요해요!</Title>
          <Description>
            대한민국 속 숨겨진 나라를 찾고 싶다면
            <br />
            로그인을 해주세요!
          </Description>
        </Content>
        <Footer>
          <Button onClick={() => (window.location.href = "/login")}>
            로그인
          </Button>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default LoginModal;

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
  width: 400px;
  background: #fff;
  border-radius: 24px;
  padding: 30px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
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
  margin-bottom: 20px;

  svg {
    width: 60px;
    height: 60px;
  }
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};

  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const Description = styled.div`
  ${({ theme }) => theme.font.xxl.medium};

  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
`;

const Footer = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  width: 155px;
  height: 56px;
  background: #1e90ff;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
`;
