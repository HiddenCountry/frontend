import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as NavLogo } from "../../assets/layout/Logo.svg";
import { ReactComponent as UserIcon } from "../../assets/layout/UserIcon.svg";
import { ReactComponent as UserIconBig } from "../../assets/layout/UserIconBig.svg";
import { ReactComponent as Hamburger } from "../../assets/layout/Menu.svg";
import { ReactComponent as Login } from "../../assets/layout/Login.svg";

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
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeMenu, setActiveMenu] = useState("홈");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "홈", path: "/" },
    { name: "지도로 보기", path: "/map" },
    { name: "장소 등록 문의", path: "/register" },
    { name: "여행 코스", path: "/route" }
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // 기존 로그아웃 로직
    }
    setShowDropdown(false);
    navigate("/"); // 홈으로 이동
    setActiveMenu("홈"); // 메뉴도 홈으로 설정
  };

  return (
    <Nav>
      <Logo to="/" onClick={() => setActiveMenu("홈")}>
        <NavLogo />
        <span>숨은나라찾기</span>
      </Logo>

      {/* 데스크탑 메뉴 */}
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

      {/* 모바일 햄버거 버튼 */}
      <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Hamburger />
      </MobileMenuButton>

      {mobileMenuOpen && (
        <MobileMenu>
          {menuItems.map((menu) => (
            <MobileMenuLink
              key={menu.name}
              to={menu.path}
              onClick={() => {
                setActiveMenu(menu.name);
                setMobileMenuOpen(false);
              }}
            >
              {menu.name}
            </MobileMenuLink>
          ))}
        </MobileMenu>
      )}

      {/* 로그인 상태 */}
      {isLoggedIn ? (
        <ProfileWrapper onClick={() => setShowDropdown(!showDropdown)}>
          {profileImg ? <ProfileImage src={profileImg} /> : <UserIcon />}
          <ProfileName>{nickname} 님</ProfileName>
          {showDropdown && (
            <Dropdown>
              <UserIconBig />
              <ProfileName>{nickname} 님</ProfileName>
              <DropdownItem to="/mypage">마이페이지</DropdownItem>
              <DropdownButton onClick={handleLogout}>로그아웃</DropdownButton>
            </Dropdown>
          )}
        </ProfileWrapper>
      ) : (
        <>
          {/* 데스크탑용 버튼 */}
          <AuthButton to="/login">로그인 / 회원가입</AuthButton>

          {/* 모바일용 아이콘 */}
          <MobileLoginIcon to="/login">
            <Login />
          </MobileLoginIcon>
        </>
      )}
    </Nav>
  );
};

export default Navbar;

const Nav = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 32px; // 기본 데스크탑 패딩
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
  position: relative;
  flex-wrap: wrap;

  @media (max-width: 780px) {
    padding: 0px 16px; // 모바일에서는 패딩 줄이기
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  span {
    ${({ theme }) => theme.font.xxl.bold};
    color: ${({ theme }) => theme.color.gray800};
  }

  @media (max-width: 780px) {
    order: 2;
    span {
      ${({ theme }) => theme.font.md.bold}; // 글자 크기 줄이기
    }
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 90px;
  flex: 1;
  justify-content: center;

  @media (max-width: 780px) {
    display: none;
  }
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
  border-radius: 12px;
  color: ${({ theme }) => theme.color.primary600};
  text-decoration: none;
  padding: 8px 16px;
  margin: 12px 0;

  &:hover {
    background-color: ${({ theme }) => theme.color.primary100};
  }

  @media (max-width: 780px) {
    display: none; // 모바일에서 숨김
  }
`;

const MobileLoginIcon = styled(Link)`
  display: none;

  @media (max-width: 780px) {
    display: flex;
    align-items: center;
    justify-content: center;
    order: 3; // 오른쪽
    color: ${({ theme }) => theme.color.primary600};
    margin-right: -10px;
    margin-top: 5px;
  }

  svg {
    width: 30px;
    height: 30px;
    margin: 15px;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  position: relative;
  cursor: pointer;

  svg {
    width: 40px;
  }

  @media (max-width: 780px) {
    order: 3;
    svg {
      width: 32px; // 모바일에서 아이콘 조금 줄임
      margin: 0px;
    }
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
  color: ${({ theme }) => theme.color.gray700};
  @media (max-width: 780px) {
    display: none; // 모바일에서 숨기기
  }
`;

const Dropdown = styled.div`
  width: 170px;
  position: absolute;
  top: 60px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
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

const MobileMenuButton = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 780px) {
    display: block;
    order: 1; // 모바일에서는 왼쪽으로
    margin-left: 0px;
    margin-top: 5px;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #ddd;
  z-index: 50;
  position: absolute;
  top: 75px;
  left: 0;
`;

const MobileMenuLink = styled(Link)`
  padding: 12px 20px;
  text-decoration: none;
  color: ${({ theme }) => theme.color.gray700};
  ${({ theme }) => theme.font.md.semibold};

  &:hover {
    background-color: ${({ theme }) => theme.color.gray50};
  }
`;
