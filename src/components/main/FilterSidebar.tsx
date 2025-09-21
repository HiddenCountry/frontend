import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as Reset } from "../../assets/main/Reset.svg";

interface FilterSidebarProps {
  onFilterChange: (filters: {
    areaCode: string[];
    contentType: string[];
    season: string[];
  }) => void;
}

// 지역, 종류, 계절 옵션 정의
const AREA_OPTIONS = [
  { label: "전체", value: "" },
  { label: "서울", value: "SEOUL" },
  { label: "인천", value: "INCHEON" },
  { label: "대전", value: "DAJEON" },
  { label: "대구", value: "DAEGU" },
  { label: "광주", value: "GWANGJU" },
  { label: "부산", value: "BUSAN" },
  { label: "울산", value: "ULSAN" },
  { label: "세종", value: "SEJONG" },
  { label: "경기", value: "GYEONGGI" },
  { label: "강원", value: "GANGWON" },
  { label: "충북", value: "CHUNGBUK" },
  { label: "충남", value: "CHUNGNAM" },
  { label: "경북", value: "GYEONGBUK" },
  { label: "경남", value: "GYEONGNAM" },
  { label: "전북", value: "JEONBUK" },
  { label: "전남", value: "JEONNAM" },
  { label: "제주", value: "JEJU" },
];

const TYPE_OPTIONS = [
  { label: "전체", value: "" },
  { label: "관광지", value: "TOURIST_SPOT" },
  { label: "문화시설", value: "CULTURAL_FACILTY" },
  { label: "행사", value: "EVENT" },
  { label: "레포츠", value: "LEISURE_SPORTS" },
  { label: "숙소", value: "ACCOMMODATION" },
  { label: "쇼핑", value: "SHOPPING" },
  { label: "음식점", value: "RESTAURANT" },
];

const SEASON_OPTIONS = [
  { label: "전체", value: "" },
  { label: "봄", value: "SPRING" },
  { label: "여름", value: "SUMMER" },
  { label: "가을", value: "AUTUMN" },
  { label: "겨울", value: "WINTER" },
  { label: "사계절", value: "ALL" },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  // 상태 관리
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  // 선택 처리
  const handleSelect = (
    option: string,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(option);
  };

  // 필터 적용
  const handleApply = () => {
    onFilterChange({
      areaCode: selectedArea ? [selectedArea] : [],
      contentType: selectedType ? [selectedType] : [],
      season: selectedSeason ? [selectedSeason] : [],
    });
  };

  // 필터 초기화
  const handleReset = () => {
    setSelectedArea("");
    setSelectedType("");
    setSelectedSeason("");
    onFilterChange({
      areaCode: [],
      contentType: [],
      season: [],
    });
  };

  return (
    <Wrapper>
      <Section>
        <Title>지역</Title>
        <Options>
          {AREA_OPTIONS.map((opt, idx) => (
            <Option
              key={`area-${idx}`}
              active={opt.value === selectedArea}
              onClick={() => handleSelect(opt.value, setSelectedArea)}
            >
              {opt.label}
            </Option>
          ))}
        </Options>
      </Section>

      <Section>
        <Title>종류</Title>
        <Options>
          {TYPE_OPTIONS.map((opt, idx) => (
            <Option
              key={`type-${idx}`}
              active={opt.value === selectedType}
              onClick={() => handleSelect(opt.value, setSelectedType)}
            >
              {opt.label}
            </Option>
          ))}
        </Options>
      </Section>

      <Section>
        <Title>추천 계절</Title>
        <Options>
          {SEASON_OPTIONS.map((opt, idx) => (
            <Option
              key={`season-${idx}`} // ✅ key 충돌 방지
              active={opt.value === selectedSeason}
              onClick={() => handleSelect(opt.value, setSelectedSeason)}
            >
              {opt.label}
            </Option>
          ))}
        </Options>
      </Section>

      <ButtonGroup>
        <ApplyButton onClick={handleApply}>필터 적용</ApplyButton>
        <ResetButton onClick={handleReset}>
          <Reset />
        </ResetButton>
      </ButtonGroup>
    </Wrapper>
  );
};

export default FilterSidebar;

const Wrapper = styled.div`
  height: 700px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray100};
  padding: 20px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xl.semibold};
  margin-bottom: 10px;
  color: ${({ theme }) => theme.color.gray800};
  text-align: left;
`;

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const Option = styled.button<{ active?: boolean }>`
  ${({ theme }) => theme.font.md.bold};
  background: ${(props) =>
    props.active ? props.theme.color.primary50 : props.theme.color.gray100};
  color: ${(props) =>
    props.active ? props.theme.color.primary500 : props.theme.color.gray600};
  border: none;
  border-radius: 8px;
  padding: 6px 7px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ApplyButton = styled.button`
  ${({ theme }) => theme.font.md.semibold};
  width: 128px;
  height: 56px;
  flex: 1;
  background: ${({ theme }) => theme.color.primary500};
  color: white;
  border: none;
  border-radius: 16px;
  padding: 8px;
  cursor: pointer;
`;

const ResetButton = styled.button`
  width: 56px;
  height: 56px;
  background: ${({ theme }) => theme.color.white};
  border: 1.6px solid ${({ theme }) => theme.color.primary500};
  border-radius: 16px;
  cursor: pointer;
  svg {
    margin-top: 3px;
  }
`;
