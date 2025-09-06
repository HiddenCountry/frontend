import React from "react";
import styled from "styled-components";
import { ReactComponent as Reset } from "../../assets/main/Reset.svg";

const FilterSidebar: React.FC = () => {
  return (
    <Wrapper>
      <Section>
        <Title>지역</Title>
        <Options>
          {["전체", "서울", "경기도", "인천", "강원도"].map((opt) => (
            <Option key={opt} active={opt === "전체"}>
              {opt}
            </Option>
          ))}
        </Options>
      </Section>

      <Section>
        <Title>종류</Title>
        <Options>
          {["전체", "카페", "음식점", "관광지", "숙소", "쇼핑"].map((opt) => (
            <Option key={opt} active={opt === "전체"}>
              {opt}
            </Option>
          ))}
        </Options>
      </Section>

      <Section>
        <Title>추천 계절</Title>
        <Options>
          {["전체", "봄", "여름", "가을", "겨울"].map((opt) => (
            <Option key={opt} active={opt === "전체"}>
              {opt}
            </Option>
          ))}
        </Options>
      </Section>

      <ButtonGroup>
        <ApplyButton>필터 적용</ApplyButton>
        <ResetButton>
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
  gap: 6px;
`;

const Option = styled.button<{ active?: boolean }>`
  ${({ theme }) => theme.font.md.bold};
  background: ${(props) =>
    props.active ? props.theme.color.primary50 : props.theme.color.gray100};
  color: ${(props) =>
    props.active ? props.theme.color.primary500 : props.theme.color.gray600};
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
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
  color: ${({ theme }) => theme.color.gray50};
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
