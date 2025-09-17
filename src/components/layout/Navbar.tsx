import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ReactComponent as NavLogo } from "../../assets/Logo.svg";
import { ReactComponent as UserIcon } from "../../assets/UserIcon.svg";
import { ReactComponent as UserIconBig } from "../../assets/UserIconBig.svg";
interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  profileImgUrl?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn = false,
  userName = "사용자",
  profileImgUrl,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Nav>
      <Logo to="/">
        <NavLogo />
        <span>숨은나라찾기</span>
      </Logo>

      <Menu>
        <MenuLink to="/" $active>
          홈
        </MenuLink>
        <MenuLink to="/map">지도로 보기</MenuLink>
        <MenuLink to="/register">장소 등록 문의</MenuLink>
      </Menu>

      {isLoggedIn ? (
        <ProfileWrapper onClick={() => setShowDropdown(!showDropdown)}>
          <ProfileName>{userName} 님</ProfileName>
          {/*<ProfileImage src={profileImgUrl || undefined} />*/}
          <UserIcon id="userIcon" />
          {showDropdown && (
            <Dropdown>
              <UserIconBig /> <ProfileName>{userName} 님</ProfileName>
              <DropdownItem to="/mypage">마이페이지</DropdownItem>
              <DropdownItem to="/" onClick={onLogout}>
                로그아웃
              </DropdownItem>
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
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.primary100};
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  gap: 15px;
  margin-right: 40px;
  flex-direction: row;
  align-items: center;
  position: relative;
  cursor: pointer;
  #userIcon {
    width: 50px;
  }
`;

const ProfileImage = styled.div<{ src?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ src, theme }) =>
    src ? `url(${src}) center/cover` : theme.color.gray300};
  margin-bottom: 4px;
`;

const ProfileName = styled.div`
  ${({ theme }) => theme.font.md.medium};
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

  svg {
    width: 80px;
    margin-top: 20px;
    margin-bottom: 8px;
  }
`;

const DropdownItem = styled(Link)`
  padding: 12px 16px;
  text-decoration: none;
  color: ${({ theme }) => theme.color.gray700};
  ${({ theme }) => theme.font.md.medium};

  &:hover {
    background-color: ${({ theme }) => theme.color.gray100};
  }
`;
