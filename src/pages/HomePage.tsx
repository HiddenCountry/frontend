import React, { useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ReactComponent as NorthAmerica } from "../assets/home/NorthAmerica.svg";
import { ReactComponent as SouthAmerica } from "../assets/home/SouthAmerica.svg";
import { ReactComponent as Europe } from "../assets/home/Europe.svg";
import { ReactComponent as Africa } from "../assets/home/Africa.svg";
import { ReactComponent as Asia } from "../assets/home/Asia.svg";
import { ReactComponent as Oceania } from "../assets/home/Oceania.svg";
import { ReactComponent as Caution } from "../assets/home/Caution.svg";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);

  const continents = [
    { name: "북아메리카", icon: NorthAmerica, top: 150, left: 200 },
    { name: "남아메리카", icon: SouthAmerica, top: 345, left: 252 },
    { name: "아시아", icon: Asia, top: 149, left: 693, link: "/asia" },
    { name: "유럽", icon: Europe, top: 126, left: 470 },
    { name: "아프리카", icon: Africa, top: 307, left: 470 },
    { name: "오세아니아", icon: Oceania, top: 350, left: 800 },
  ];

  // 조사 붙여주는 함수
  const addRo = (word: string): string => {
    if (!word) return "";
    const lastChar = word.charCodeAt(word.length - 1);
    const jongseong = (lastChar - 0xac00) % 28; // 받침 여부 확인
    return word + (jongseong === 0 ? "로" : "으로");
  };

  return (
    <Container>
      <Main>
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

        {/* 나라이름 버튼 
        <CountryList>
          {continents.map((continent) => {
            const isHovered = hoveredContinent === continent.name;
            return (
              <CountryButton
                key={continent.name}
                $highlight={isHovered}
                onMouseEnter={() => setHoveredContinent(continent.name)}
                onMouseLeave={() => setHoveredContinent(null)}
                onClick={() => continent.link && navigate(continent.link)}
              >
                {continent.name}
              </CountryButton>
            );
          })}
        </CountryList>*/}

        <ContinentCard>
          {continents.map((continent) => {
            const Icon = continent.icon;
            const isHovered = hoveredContinent === continent.name;

            return (
              <Continent
                key={continent.name}
                style={{ top: continent.top, left: continent.left }}
                $highlight={isHovered}
                onMouseEnter={() => setHoveredContinent(continent.name)}
                onMouseLeave={() => setHoveredContinent(null)}
                onClick={() => continent.link && navigate(continent.link)}
              >
                <Icon />
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
`;
const CountryList = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
`;

const CountryButton = styled.button<{ $highlight?: boolean }>`
  background: ${({ $highlight, theme }) =>
    $highlight ? theme.color.primary50 : "white"};
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
`;

const ContinentCard = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 80px 60px;
  max-width: 1000px;
  width: 100%;
  height: 500px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Continent = styled.div<{ $highlight?: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transform: translate(-50%, -50%);

  svg {
    transition: transform 0.2s, filter 0.2s;
    ${({ $highlight }) =>
      $highlight &&
      css`
        transform: scale(1.1);
        filter: drop-shadow(0 0 5px ${({ theme }) => theme.color.primary300});
      `}
  }
`;

const InfoText = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #888;

  svg {
    flex-shrink: 0;
  }
`;
