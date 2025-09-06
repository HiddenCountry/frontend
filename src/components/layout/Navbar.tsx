import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ReactComponent as NavLogo } from "../../assets/Logo.svg";

const Navbar: React.FC = () => {
  return (
    <Nav>
      <Logo to="/">
        <NavLogo />
        <span>국내에서 떠나는 세계여행</span>
      </Logo>

      <Menu>
        <MenuLink to="/" $active>
          홈
        </MenuLink>
        <MenuLink to="/map">지도로 보기</MenuLink>
        <MenuLink to="/register">장소 등록 문의</MenuLink>
      </Menu>

      <AuthButton to="/login">로그인 / 회원가입</AuthButton>
    </Nav>
  );
};

export default Navbar;

const Nav = styled.nav`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  margin-left: 30px;

  span {
    ${({ theme }) => theme.font.xxl.bold};
    color: ${({ theme }) => theme.color.gray800};
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 90px;
  flex: 1;
  justify-content: center;
`;

const MenuLink = styled(Link)<{ $active?: boolean }>`
  ${({ theme }) => theme.font.xl.semibold};
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme, $active }) =>
    $active ? theme.color.primary500 : theme.color.gray600};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.primary500};
  }
`;

const AuthButton = styled(Link)`
  ${({ theme }) => theme.font.xl.semibold};
  background-color: ${({ theme }) => theme.color.primary50};
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.color.primary600};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.primary100};
  }
`;
