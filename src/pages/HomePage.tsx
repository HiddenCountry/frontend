import React, { useState, useEffect } from "react";
import styled, { css, useTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ReactComponent as NorthAmerica } from "../assets/home/NorthAmerica.svg";
import { ReactComponent as SouthAmerica } from "../assets/home/SouthAmerica.svg";
import { ReactComponent as Europe } from "../assets/home/Europe.svg";
import { ReactComponent as Africa } from "../assets/home/Africa.svg";
import { ReactComponent as Asia } from "../assets/home/Asia.svg";
import { ReactComponent as Oceania } from "../assets/home/Oceania.svg";
import { ReactComponent as NorthAmericaM } from "../assets/home/mobile/NorthAmericaM.svg";
import { ReactComponent as SouthAmericaM } from "../assets/home/mobile/SouthAmericaM.svg";
import { ReactComponent as EuropeM } from "../assets/home/mobile/EuropeM.svg";
import { ReactComponent as AfricaM } from "../assets/home/mobile/AfricaM.svg";
import { ReactComponent as AsiaM } from "../assets/home/mobile/AsiaM.svg";
import { ReactComponent as OceaniaM } from "../assets/home/mobile/OceaniaM.svg";
import { ReactComponent as Caution } from "../assets/home/Caution.svg";
import OnboardingModal from "./OnboardingModal";
import LoginModal from "../components/common/LoginModal";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);

  // 로컬스토리지 accessToken 확인 후 모달 노출 여부 결정
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowOnboarding(true);
    }
  }, []);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const continents = [
    {
      name: "북아메리카",
      icon: NorthAmerica,
      iconM: NorthAmericaM,
      top: 150,
      left: 200,
      link: "/main",
      countryRegion: "NORTH_AMERICA",
    },
    {
      name: "아시아",
      icon: Asia,
      iconM: AsiaM,
      top: 149,
      left: 693,
      link: "/asia",
      countryRegion: "ASIA",
    },
    {
      name: "남아메리카",
      icon: SouthAmerica,
      iconM: SouthAmericaM,
      top: 345,
      left: 252,
      link: "/main",
      countryRegion: "SOUTH_AMERICA",
    },
    {
      name: "유럽",
      icon: Europe,
      iconM: EuropeM,
      top: 126,
      left: 470,
      link: "/main",
      countryRegion: "EUROPE",
    },
    {
      name: "아프리카",
      icon: Africa,
      iconM: AfricaM,
      top: 307,
      left: 470,
      link: "/main",
      countryRegion: "AFRICA",
    },
    {
      name: "오세아니아",
      icon: Oceania,
      iconM: OceaniaM,
      top: 350,
      left: 800,
      link: "/main",
      countryRegion: "OCEANIA",
    },
  ];

  // 조사 붙여주는 함수
  const addRo = (word: string): string => {
    if (!word) return "";
    const lastChar = word.charCodeAt(word.length - 1);
    const jongseong = (lastChar - 0xac00) % 28; // 받침 여부 확인
    return word + (jongseong === 0 ? "로" : "으로");
  };

  // 화면 크기에 따라 데스크탑 여부 판단
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1000);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Container>
      <Main>
        {/* 온보딩 모달 */}
        {showOnboarding && (
          <OnboardingModal
            isOpen={showOnboarding}
            onClose={() => setShowOnboarding(false)}
          />
        )}
        {/* 로그인 모달 */}
        {showLoginModal && (
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            title="로그인이 필요해요!"
            description={
              <>
                대한민국 속 숨겨진 나라를 찾고 싶다면
                <br />
                로그인을 해주세요!
              </>
            }
            confirmText="로그인"
            onConfirm={() => (window.location.href = "/login")}
          />
        )}
        <Title>
          오늘은{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={hoveredContinent || "default"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              style={{ color: theme.color.primary500 }}
            >
              {hoveredContinent ? addRo(hoveredContinent) : "어디로"}
            </motion.span>
          </AnimatePresence>{" "}
          떠나볼까요?
        </Title>

        <ContinentCard $isDesktop={isDesktop}>
          {continents.map((continent) => {
            const Icon = continent.icon;
            const IconM = continent.iconM;

            const isHovered = hoveredContinent === continent.name;

            return (
              <Continent
                key={continent.name}
                style={
                  isDesktop
                    ? { top: continent.top, left: continent.left }
                    : undefined
                }
                $highlight={isHovered}
                onMouseEnter={() => setHoveredContinent(continent.name)}
                onMouseLeave={() => setHoveredContinent(null)}
                onClick={() => {
                  const token = localStorage.getItem("accessToken");
                  if (!token) {
                    setShowLoginModal(true);
                  } else if (continent.link) {
                    navigate(
                      `${continent.link}?countryRegion=${continent.countryRegion}`
                    );
                  }
                }}
              >
                {isDesktop ? (
                  <Icon />
                ) : (
                  <>
                    <IconM />
                  </>
                )}
              </Continent>
            );
          })}

          <InfoText>
            <Caution />
            마우스를 올려 원하는 대륙을 선택해 주세요!
          </InfoText>
        </ContinentCard>
      </Main>
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  background: #f6f8fb;
  min-height: 100vh;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
`;

const Title = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 50px;

  span {
    color: ${({ theme }) => theme.color.primary500};
  }
  @media (max-width: 768px) {
    font-size: 180%;
  }
`;

const ContinentCard = styled.div<{ $isDesktop: boolean }>`
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 80px 60px;
  max-width: 1000px;
  width: 100%;
  height: ${({ $isDesktop }) => ($isDesktop ? "500px" : "auto")};
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  ${({ $isDesktop }) =>
    !$isDesktop &&
    css`
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 6px;
      padding: 40px 20px;
      padding-bottom: 50px;

      @media (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
      }
    `}
`;
const Continent = styled.div<{ $highlight?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  font-size: 20px;
  font-weight: bold;
  background: ${({ theme }) => theme.color.gray100};
  border-radius: 32px;
  padding: 20px;
  transition: all 0.2s;
  gap: 10px; /* 아이콘과 텍스트 사이 간격 */

  svg {
    transition: transform 0.2s, filter 0.2s;
    height: auto;
  }

  span {
    margin-top: 5px;
  }

  ${({ $highlight, theme }) =>
    $highlight &&
    css`
      background: ${theme.color.primary100};
      color: ${theme.color.primary600};
      transform: scale(1.05);

      svg {
        transform: scale(1.1);
        filter: drop-shadow(0 0 5px ${theme.color.primary300});
      }
    `}

  @media (min-width: 1000px) {
    position: absolute;
    transform: translate(-50%, -50%);
    background: transparent;
    font-size: 0; // 텍스트 숨김
    padding: 0;
    gap: 0; // 간격 제거
  }
`;

const InfoText = styled.div`
  width: 300px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: #888;
  margin-top: 10px;

  svg {
    flex-shrink: 0;
  }
`;
