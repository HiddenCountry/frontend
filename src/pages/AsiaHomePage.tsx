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

        {/* 나라이름 버튼
        <CountryList>
          {countries.map((country) => (
            <CountryButton
              key={country.key}
              $highlight={hovered === country.name}
              onMouseEnter={() => setHovered(country.name)}
              onMouseLeave={() => setHovered(null)}
            >
              {country.name}
            </CountryButton>
          ))}
        </CountryList>*/}

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
              style={{
                gridColumn: "span 2",
                width: "460px",
                position: "relative",
              }}
            >
              <China style={{ position: "relative", top: "27px" }} />
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
                gridRow: "span 2",
                width: "225px",
                height: "365px",
                borderTopRightRadius: "32px",
                borderBottomRightRadius: "32px",
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
    $highlight ? theme.color.primary100 : "white"};
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
  padding: 40px 40px 80px;
  max-width: 1000px;
  width: 100%;
  min-height: 500px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  justify-items: center;
  align-items: center;
`;
const GridItem = styled.div<{ $highlight?: boolean }>`
  width: 225px;
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

  svg {
    margin-bottom: 12px;
    transition: transform 0.2s;
    transform: ${({ $highlight }) => ($highlight ? "scale(1.1)" : "scale(1)")};
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
  left: 410px;
  transition: all 0.2s ease;
  cursor: pointer;
  z-index: 999px;

  svg {
    margin-top: -5px;
    transition: transform 0.2s;
    transform: ${({ $highlight }) => ($highlight ? "scale(1.1)" : "scale(1)")};
  }

  &:hover svg {
    transform: scale(1.1);
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
