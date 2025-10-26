import React from "react";
import styled from "styled-components";
import { ReactComponent as LogoIcon } from "../../assets/layout/LogoWhite.svg";
import { ReactComponent as GithubIcon } from "../../assets/layout/Github.svg";

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        {/* 왼쪽 영역 */}
        <LeftSection>
          <Logo>
            <LogoIcon />
            <span>숨은나라찾기</span>
          </Logo>
          {/* <LogoWrapper>
            <Logo>
              <LogoIcon />
              <span>숨은나라찾기</span>
            </Logo>
            <IntroButton href="/intro">서비스 소개 바로가기</IntroButton>
          </LogoWrapper> */}
          <Nav>
            <a href="/intro">숨은나라찾기 서비스 소개</a>
            <span>|</span>
            <a href="/policy">이용약관</a>
            <span>|</span>
            <a
              href="https://mail.google.com/mail/?view=cm&to=hiddencountrypilot@gmail.com&su=광고·제휴·사업 제안 문의&body=안녕하세요.%0A숨은나라찾기 팀에게 제안드립니다."
              target="_blank"
              rel="noopener noreferrer"
            >
              광고/제휴/사업 제안
            </a>
          </Nav>
          <Copy>
            Copyright © 2025 HIDDENCOUNTRY Inc. All Rights Reserved
            <br />
            Email : hiddencountrypilot@gmail.com
          </Copy>
        </LeftSection>

        {/*//오른쪽 SNS 아이콘 영역}
        <RightSection>
          <IconLink href="https://github.com/HiddenCountry" target="_blank">
            <GithubIcon />
          </IconLink>
        </RightSection>
        */}
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* 로고와 버튼 사이 간격 */
`;

const IntroButton = styled.a`
  background-color: #a8a8a8ff;;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;

  &:hover {
    background-color: #00395aff;
    transform: translateY(-2px);
  }
`;


const ButtonLink = styled.a`
  background-color: #0288d1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s;
  
  &:hover {
    background-color: #0277bd;
    transform: translateY(-2px);
  }
`;

const FooterWrapper = styled.footer`
  width: 100%;
  background: ${({ theme }) => theme.color.gray800};
  padding: 40px;

  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Logo = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  span {
    ${({ theme }) => theme.font.xxl.bold};
    color: white;
  }
`;

const Nav = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  color: #aaa;

  a {
    text-decoration: none;
    color: #aaa;
    &:hover {
      color: #fff;
    }
  }

  span {
    color: #555;
  }
`;

const Copy = styled.div`
  font-size: 12px;
  color: #777;
  line-height: 1.4;
`;

const RightSection = styled.div`
  display: flex;
  gap: 16px;

  svg {
    width: 28px;
    height: 28px;
    fill: #aaa;
    transition: fill 0.2s;

    &:hover {
      fill: #aaa;
    }
  }
`;

const IconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
`;
