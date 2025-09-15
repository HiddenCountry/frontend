import React from "react";
import styled from "styled-components";
import { ReactComponent as SearchIcon } from "../../assets/main/SearchIcon.svg";

const SearchBar: React.FC = () => {
  return (
    <Wrapper>
      <Input placeholder="검색어를 입력해주세요" />
      <SearchButton>
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
  color: #555;
`;
