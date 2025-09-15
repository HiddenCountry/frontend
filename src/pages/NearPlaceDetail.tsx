import React, { useRef, useState } from "react";
import styled from "styled-components";

const NearPlaceDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"소개" | "지도">("소개");

  // 각 섹션 ref
  const introRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // 탭 클릭 시 해당 섹션으로 스크롤
  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    let target: HTMLDivElement | null = null;
    if (tab === "소개") target = introRef.current;
    if (tab === "지도") target = mapRef.current;

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Container>
      <Content>
        <TopSection>
          <ImageWrapper>
            <MainImage
              src="https://placehold.co/800x400"
              alt="니지모리 스튜디오"
            />
            <ImageIndex>1 / 26</ImageIndex>
          </ImageWrapper>
          <InfoCard>
            <Title>니지모리 스튜디오</Title>
            <Location>
              <SubTitle>위치</SubTitle>경기 동두천시 천보산로 567-12
            </Location>
            <Location>
              <SubTitle>종류</SubTitle>테마파크
            </Location>
            <Distance>현재 위치에서 500m</Distance>
          </InfoCard>
        </TopSection>

        <BottomSection>
          <WrapperLeft>
            {/* 탭 메뉴 */}
            <TabMenu>
              {["소개", "지도"].map((tab) => (
                <Tab
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => handleTabClick(tab as any)}
                >
                  {tab}
                </Tab>
              ))}
            </TabMenu>

            {/* 소개 */}
            <Section ref={introRef}>
              <SectionTitle>설명</SectionTitle>
              <Text>
                경기도 동두천시에 위치한 일본 테마의 스튜디오 리 테마파크이다.
                다수의 일본식 전통가옥 거리가 있으며...
              </Text>
            </Section>

            <Section>
              <SectionTitle>문의 및 안내</SectionTitle>
              <Text>031-684-2223</Text>
            </Section>

            <Section>
              <SectionTitle>이용시간</SectionTitle>
              <Text>[하절기(3월~10월)] 평일(월~목) 09:00~19:00 ...</Text>
            </Section>

            {/* 지도 */}
            <Section ref={mapRef}>
              <SectionTitle>지도</SectionTitle>
              <MapImage src="https://placehold.co/600x300" />
              <Address>경기 동두천시 천보산로 567-12</Address>
            </Section>
          </WrapperLeft>
          <WrapperRight />
        </BottomSection>
      </Content>
    </Container>
  );
};

export default NearPlaceDetail;

const Container = styled.div`
  color: #111;
  background: #fff;
`;

const Content = styled.main`
  width: 1000px;
  margin: 20px auto;
`;

const TopSection = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
`;
const BottomSection = styled.div`
  display: flex;
  gap: 40px;
`;
const WrapperLeft = styled.div`
  position: relative;
  flex: 1.65;
`;
const WrapperRight = styled.div`
  position: relative;
  flex: 1.2;
`;

const ImageWrapper = styled.div`
  position: relative;
  flex: 2;
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  border-radius: 24px;
  border: 1px solid #555;
`;

const ImageIndex = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
`;

const InfoCard = styled.div`
  flex: 1.2;
  background: ${({ theme }) => theme.color.white};
  padding: 36px;
  border-radius: 32px;
  text-align: left;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  margin: 8px 0;
`;

const SubTitle = styled.span`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.gray600};
  margin: 6px 0;
  margin-right: 10px;
`;

const Location = styled.div`
  ${({ theme }) => theme.font.xxl.medium};
  color: ${({ theme }) => theme.color.gray800};
  margin-bottom: 10px;
`;

const Distance = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.primary500};
  margin-top: 15px;
  margin-bottom: 8px;
`;

const TabMenu = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  color: ${({ theme }) => theme.color.primary500};

  display: flex;
  justify-content: left;
  margin: 50px 0px;
`;
const Tab = styled.div<{ active?: boolean }>`
  padding: 10px 42px;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? "2px solid #1e90ff" : "none")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "#1e90ff" : "#666")};
  transition: color 0.2s;
`;

const Section = styled.section`
  margin: 50px 0;
`;
const SectionTitle = styled.h2`
  ${({ theme }) => theme.font.xxxl.bold};
  color: ${({ theme }) => theme.color.gray800};
  margin-bottom: 12px;
  text-align: left;
`;
const Text = styled.div`
  ${({ theme }) => theme.font.xxl.medium};
  color: ${({ theme }) => theme.color.gray800};
  text-align: left;
`;

const MapImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;
const Address = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: #555;
  text-align: left;
`;
