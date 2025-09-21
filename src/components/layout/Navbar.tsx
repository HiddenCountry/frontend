import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ReactComponent as NavLogo } from "../../assets/layout/Logo.svg";
import { ReactComponent as UserIcon } from "../../assets/layout/UserIcon.svg";
import { ReactComponent as UserIconBig } from "../../assets/layout/UserIconBig.svg";

interface NavbarProps {
  isLoggedIn?: boolean;
  nickname?: string;
  profileImg?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn = false,
  nickname = "사용자",
  profileImg,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeMenu, setActiveMenu] = useState("홈");

  const menuItems = [
    { name: "홈", path: "/" },
    { name: "지도로 보기", path: "/map" },
    { name: "장소 등록 문의", path: "/register" },
  ];

  return (
    <Nav>
      <Logo to="/" onClick={() => setActiveMenu("홈")}>
        <NavLogo />
        <span>숨은나라찾기</span>
      </Logo>

      <Menu>
        {menuItems.map((menu) => (
          <MenuLink
            key={menu.name}
            to={menu.path}
            $active={activeMenu === menu.name}
            onClick={() => setActiveMenu(menu.name)}
          >
            {menu.name}
          </MenuLink>
        ))}
      </Menu>

      {isLoggedIn ? (
        <ProfileWrapper onClick={() => setShowDropdown(!showDropdown)}>
          {profileImg ? <ProfileImage src={profileImg} /> : <UserIcon />}
          <ProfileName>{nickname} 님</ProfileName>
          {showDropdown && (
            <Dropdown>
              <UserIconBig />
              <ProfileName>{nickname} 님</ProfileName>
              <DropdownItem to="/mypage">마이페이지</DropdownItem>
              <DropdownButton onClick={onLogout}>로그아웃</DropdownButton>
            </Dropdown>
          )}
        </ProfileWrapper>
      ) : (
        <AuthButton to="/login">로그인 / 회원가입</AuthButton>
      )}
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
  position: relative;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  margin-left: 40px;

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
  margin-right: 40px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.primary100};
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: row;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin-right: 50px;

  svg {
    width: 50px;
  }
`;

const ProfileImage = styled.div<{ src?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ src, theme }) =>
    src ? `url(${src}) center/cover` : theme.color.gray300};
`;

const ProfileName = styled.div`
  ${({ theme }) => theme.font.md.bold};
  margin: 5px 0;
  color: ${({ theme }) => theme.color.gray700};
`;

const Dropdown = styled.div`
  width: 170px;
  position: absolute;
  top: 90px;
  left: -42px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
  align-items: center;
  padding: 10px;

  svg {
    width: 80px;
    margin-top: 10px;
    margin-bottom: 8px;
  }
`;

const DropdownItem = styled(Link)`
  padding: 12px 16px;
  text-decoration: none;
  color: ${({ theme }) => theme.color.gray700};
  ${({ theme }) => theme.font.md.medium};

  &:hover {
    border-radius: 12px;
    background-color: ${({ theme }) => theme.color.gray100};
  }
`;

// 로그아웃 전용 버튼
const DropdownButton = styled.div`
  padding: 12px 16px;
  color: ${({ theme }) => theme.color.gray700};
  ${({ theme }) => theme.font.md.medium};
  cursor: pointer;

  &:hover {
    border-radius: 12px;
    background-color: ${({ theme }) => theme.color.gray100};
  }
`;
