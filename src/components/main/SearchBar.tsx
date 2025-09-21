import React from "react";
import styled from "styled-components";
import { ReactComponent as SearchIcon } from "../../assets/main/SearchIcon.svg";

interface SearchBarProps {
  value: string; // 검색어
  onChange: (val: string) => void; // 입력 변경 시
  onSearch?: () => void; // 검색 버튼 클릭 또는 Enter 시
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  return (
    <Wrapper>
      <Input
        placeholder="검색어를 입력해주세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.()} // Enter 누르면 검색
      />
      <SearchButton onClick={onSearch}>
        <SearchIcon />
      </SearchButton>
    </Wrapper>
  );
};

export default SearchBar;

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const Input = styled.input`
  height: 78px;
  flex: 1;
  padding: 10px 24px;
  border-radius: 16px;
  border: 1px solid #ddd;
  ${({ theme }) => theme.font.xxl.medium};
  color: ${({ theme }) => theme.color.gray800};

  /* 모바일/작은 화면 반응형 */
  @media (max-width: 740px) {
    height: 60px;
    ${({ theme }) => theme.font.xl.medium};
  }
`;

const SearchButton = styled.button`
  width: 160px;
  height: 78px;
  background: ${({ theme }) => theme.color.primary500};
  border: none;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;

  /* 모바일/작은 화면 반응형 */
  @media (max-width: 740px) {
    ${({ theme }) => theme.font.md.medium};
    height: 60px;
    width: 100px;
  }
`;
