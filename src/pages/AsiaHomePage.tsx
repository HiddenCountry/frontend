import React, { useState } from "react";
import styled, { useTheme } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ReactComponent as Japan } from "../assets/home/asia/Japan.svg";
import { ReactComponent as China } from "../assets/home/asia/China.svg";
import { ReactComponent as Mongolia } from "../assets/home/asia/Mongolia.svg";
import { ReactComponent as India } from "../assets/home/asia/India.svg";
import { ReactComponent as Turkey } from "../assets/home/asia/Turkey.svg";
import { ReactComponent as Arab } from "../assets/home/asia/Arab.svg";
import { ReactComponent as SoutheastAsia } from "../assets/home/asia/SoutheastAsia.svg";
import { ReactComponent as Caution } from "../assets/home/Caution.svg";

const AsiaHomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [hovered, setHovered] = useState<string | null>(null);

  const countries = [
    { name: "터키", key: "turkey", link: "/main", countryRegion: "TURKEY" },
    { name: "몽골", key: "mongolia", link: "/main", countryRegion: "MONGOLIA" },
    { name: "중화/중국", key: "china", link: "/main", countryRegion: "CHINA" },
    { name: "일본", key: "japan", link: "/main", countryRegion: "JAPAN" },
    { name: "아랍", key: "arab", link: "/main", countryRegion: "ARAB" },
    { name: "인도", key: "india", link: "/main", countryRegion: "INDIA" },
    {
      name: "동남아시아",
      key: "southeastAsia",
      link: "/main",
      countryRegion: "SOUTHEAST_ASIA",
    },
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
              key={hovered || "default"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              style={{ color: theme.color.primary500 }}
            >
              {hovered ? addRo(hovered) : "어디로"}
            </motion.span>
          </AnimatePresence>{" "}
          떠나볼까요?
        </Title>

        <ContinentCard>
          <Path>
            <Link to="/">세계지도</Link> &gt; <span>아시아 지도</span>
          </Path>

          <Grid>
            {/* 1행 */}
            <GridItem
              $highlight={hovered === "터키"}
              onMouseEnter={() => setHovered("터키")}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                navigate(
                  countries.find((c) => c.name === "터키")?.link +
                    `?countryRegion=${
                      countries.find((c) => c.name === "터키")?.countryRegion
                    }`
                )
              }
              style={{
                position: "relative",
                borderTopLeftRadius: "32px",
              }}
            >
              <Turkey />
            </GridItem>

            <GridItem
              $highlight={hovered === "중화/중국"}
              $isChina
              onMouseEnter={() => setHovered("중화/중국")}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                navigate(
                  countries.find((c) => c.name === "중화/중국")?.link +
                    `?countryRegion=${
                      countries.find((c) => c.name === "중화/중국")
                        ?.countryRegion
                    }`
                )
              }
            >
              <China />
            </GridItem>

            <GridItem
              $highlight={hovered === "일본"}
              onMouseEnter={() => setHovered("일본")}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                navigate(
                  countries.find((c) => c.name === "일본")?.link +
                    `?countryRegion=${
                      countries.find((c) => c.name === "일본")?.countryRegion
                    }`
                )
              }
              style={{
                borderTopRightRadius: "32px",
              }}
            >
              <Japan />
            </GridItem>

            {/* 2행 */}
            <GridItem
              $highlight={hovered === "아랍"}
              onMouseEnter={() => setHovered("아랍")}
              onMouseLeave={() => setHovered(null)}
              style={{ borderBottomLeftRadius: "32px" }}
              onClick={() =>
                navigate(
                  countries.find((c) => c.name === "아랍")?.link +
                    `?countryRegion=${
                      countries.find((c) => c.name === "아랍")?.countryRegion
                    }`
                )
              }
            >
              <Arab />
            </GridItem>
            <GridItem
              $highlight={hovered === "인도"}
              onMouseEnter={() => setHovered("인도")}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                navigate(
                  countries.find((c) => c.name === "인도")?.link +
                    `?countryRegion=${
                      countries.find((c) => c.name === "인도")?.countryRegion
                    }`
                )
              }
            >
              <India />
            </GridItem>
            <GridItem
              $highlight={hovered === "동남아시아"}
              onMouseEnter={() => setHovered("동남아시아")}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                navigate(
                  countries.find((c) => c.name === "동남아시아")?.link +
                    `?countryRegion=${
                      countries.find((c) => c.name === "동남아시아")
                        ?.countryRegion
                    }`
                )
              }
              style={{
                borderBottomRightRadius: "32px",
              }}
            >
              <SoutheastAsia />
            </GridItem>
          </Grid>

          <MongoliaGrid
            $highlight={hovered === "몽골"}
            onMouseEnter={() => setHovered("몽골")}
            onMouseLeave={() => setHovered(null)}
            onClick={() =>
              navigate(
                countries.find((c) => c.name === "몽골")?.link +
                  `?countryRegion=${
                    countries.find((c) => c.name === "몽골")?.countryRegion
                  }`
              )
            }
          >
            <Mongolia />
          </MongoliaGrid>

          <InfoText>
            <Caution />
            마우스를 올려 원하는 대륙을 선택해 주세요!
          </InfoText>
        </ContinentCard>
      </Main>
    </Container>
  );
};

export default AsiaHomePage;

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

const ContinentCard = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 40px 40px 80px;
  max-width: 1000px;
  width: 100%;
  min-height: 500px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    padding: 40px 40px 60px;
  }
`;

const Path = styled.div`
  ${({ theme }) => theme.font.md.semibold};
  color: ${({ theme }) => theme.color.gray500};
  text-align: left;
  margin-bottom: 50px;
  cursor: pointer;

  span {
    color: ${({ theme }) => theme.color.gray700};
  }

  a {
    color: ${({ theme }) => theme.color.gray500};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
  @media (max-width: 600px) {
    margin-bottom: 30px;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  justify-items: center;
  align-items: center;
  position: relative; /* 몽골 absolute 기준 */

  @media (max-width: 780px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
const GridItem = styled.div<{ $highlight?: boolean; $isChina?: boolean }>`
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  background: ${({ $highlight, theme }) =>
    $highlight ? theme.color.primary100 : theme.color.gray100};
  cursor: pointer;
  transition: all 0.2s ease;
  position: ${({ $isChina }) => ($isChina ? "relative" : "static")};

  svg {
    margin-bottom: 12px;
    transition: transform 0.2s;
    transform: ${({ $highlight }) => ($highlight ? "scale(1.1)" : "scale(1)")};
    margin-top: ${({ $isChina }) => ($isChina ? "40px" : "0px")};

    @media (max-width: 780px) {
      position: ${({ $isChina }) => ($isChina ? "static" : "relative")};
      top: 0 !important; // China SVG top 제거
      margin-top: ${({ $isChina }) => ($isChina ? "0px" : "0px")};
    }
  }

  /* 반응형: grid-span 조정 */
  @media (max-width: 780px) {
    grid-column: auto !important;
    grid-row: auto !important;
    width: 100%; // 2열 → 1열
    max-width: 460px; // 중국 폭 유지
    height: 180px; // 높이 고정
    border-radius: 32px;
  }

  @media (max-width: 600px) {
    max-width: 100%;
    height: 160px;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;
const MongoliaGrid = styled.div<{ $highlight?: boolean }>`
  width: 184px;
  height: 130px;
  border: 6px solid ${({ theme }) => theme.color.white};
  background-color: ${({ $highlight, theme }) =>
    $highlight ? theme.color.primary100 : theme.color.gray100};
  border-radius: 32px;
  position: absolute;
  top: 45px;

  /* 화면 중앙 기준으로 이동 */
  left: 50%;
  transform: translateX(-50%); /* 부모 기준 중앙 정렬 */

  transition: all 0.2s ease;
  cursor: pointer;
  z-index: 999;

  svg {
    margin-top: -5px;
    transition: transform 0.2s;
    transform: ${({ $highlight }) => ($highlight ? "scale(1.1)" : "scale(1)")};
  }

  &:hover svg {
    transform: scale(1.1);
  }

  /* 반응형 */
  @media (max-width: 780px) {
    position: static;
    width: 100%;
    height: 180px;
    padding-top: 25px;
    border-radius: 32px;
    transform: none; /* static일 때 transform 제거 */
  }

  @media (max-width: 600px) {
    max-width: 100%;
    padding-top: 15px;
    height: 160px;
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
  gap: 6px;
  font-size: 13px;
  color: #888;

  svg {
    flex-shrink: 0;
  }
`;
