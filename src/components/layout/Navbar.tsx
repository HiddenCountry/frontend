import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as NavLogo } from "../../assets/layout/Logo.svg";
import { ReactComponent as UserIcon } from "../../assets/layout/UserIcon.svg";
import { ReactComponent as UserIconBig } from "../../assets/layout/UserIconBig.svg";
import { ReactComponent as Hamburger } from "../../assets/layout/Menu.svg";
import { ReactComponent as Login } from "../../assets/layout/Login.svg";
import { getUserInfo } from "../../api/Kakao";
import LoginModal from "../common/LoginModal";

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
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [activeMenu, setActiveMenu] = useState("홈");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const menuItems = [
    { name: "홈", path: "/" },
    { name: "소개", path: "/intro" },
    { name: "지도로 보기", path: "/map" },
    { name: "장소 등록 문의", path: "/register" },
    { name: "여행 코스", path: "/route" },
  ];

  // 세션 체크: 로그인 안 된 상태 + 토큰 있음 → API 호출
  useEffect(() => {
    const checkSession = async () => {
      if (location.pathname === "/" || location.pathname === "/login") return;
      const token = localStorage.getItem("accessToken");
      if (!token || isLoggedIn) return;

      try {
        const res = await getUserInfo();
        if (res.code === "COMMON403") {
          setShowLoginModal(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkSession();
  }, [location.pathname, isLoggedIn]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    setShowDropdown(false);
    navigate("/");
    setActiveMenu("홈");
  };

  return (
    <>
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

        {/* 모바일 햄버거 */}
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Hamburger />
        </MobileMenuButton>

        {mobileMenuOpen && (
          <MobileMenu>
            {menuItems.map((menu) => (
              <MobileMenuLink
                key={menu.name}
                to={menu.path}
                $active={activeMenu === menu.name}
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
                {profileImg ? (
                  <ProfileImageBig src={profileImg} />
                ) : (
                  <UserIconBig />
                )}
                <DropdownProfileName>{nickname} 님</DropdownProfileName>
                <DropdownItem to="/mypage">마이페이지</DropdownItem>
                <DropdownButton onClick={handleLogout}>로그아웃</DropdownButton>
              </Dropdown>
            )}
          </ProfileWrapper>
        ) : (
          <>
            <AuthButton to="/login">로그인 / 회원가입</AuthButton>
            <MobileLoginIcon to="/login">
              <Login />
            </MobileLoginIcon>
          </>
        )}
      </Nav>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          title="로그인이 필요해요!"
          description={
            <>
              세션이 만료되었습니다.
              <br />
              로그인을 해주세요!
            </>
          }
          confirmText="로그인"
          onConfirm={() => {
            if (onLogout) onLogout(); // 로그아웃 처리
            setShowLoginModal(false);
            navigate("/login");
          }}
        />
      )}
    </>
  );
};

export default Navbar;

const Nav = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 32px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
  position: relative;
  flex-wrap: wrap;

  @media (max-width: 780px) {
    padding: 0px 16px;
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
      ${({ theme }) => theme.font.md.bold};
    }
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 60px;
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
    display: none;
  }
`;

const MobileLoginIcon = styled(Link)`
  display: none;
  svg {
    width: 30px;
    height: 30px;
    margin: 17px 0px;
    margin-right: 2px;
  }

  @media (max-width: 780px) {
    display: flex;
    align-items: center;
    justify-content: center;
    order: 3;
    color: ${({ theme }) => theme.color.primary600};
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
      width: 32px;
      margin: 0px;
    }
  }
`;

const ProfileImage = styled.div<{ src?: string }>`
  width: 40px;
  height: 40px;
  margin: 12px 0px;
  margin-left: -8px;
  border-radius: 50%;
  background: ${({ src, theme }) =>
    src ? `url(${src}) center/cover` : theme.color.gray300};
`;

const ProfileName = styled.div`
  ${({ theme }) => theme.font.md.bold};
  color: ${({ theme }) => theme.color.gray700};

  padding: 5px 0;
  @media (max-width: 780px) {
    display: none;
  }
`;

const Dropdown = styled.div`
  width: 170px;
  position: absolute;
  top: 75px;
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
const DropdownProfileName = styled.div`
  ${({ theme }) => theme.font.md.bold};
  color: ${({ theme }) => theme.color.gray700};
  padding: 5px 0;

  @media (max-width: 780px) {
    display: block;
  }
`;
const ProfileImageBig = styled.div<{ src?: string }>`
  width: 80px;
  height: 80px;
  margin-top: 10px;
  margin-bottom: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.gray300};
  background-image: ${({ src }) => (src ? `url(${src})` : "none")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
    order: 1;
    margin-left: 5px;
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
  top: 65px;
  left: 0;
  text-align: center;
`;

const MobileMenuLink = styled(Link)<{ $active?: boolean }>`
  padding: 12px 20px;
  text-decoration: none;
  color: ${({ theme, $active }) =>
    $active ? theme.color.primary500 : theme.color.gray600};
  ${({ theme }) => theme.font.md.semibold};

  &:hover {
    background-color: ${({ theme }) => theme.color.gray100};
  }
`;
