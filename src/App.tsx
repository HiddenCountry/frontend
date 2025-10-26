import React, { useState, useEffect } from "react";
import "./App.css";
import styled from "styled-components";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import HomePage from "./pages/HomePage";
import AsiaHomePage from "./pages/AsiaHomePage";
import MainPage from "./pages/MainPage";
import KakaoLoginPage from "./pages/KakaoLoginPage";
import SignupPage from "./pages/SignupPage";
import SignupCompletePage from "./pages/SignupCompletePage";
import PlaceDetail from "./pages/PlaceDetail";
import NearPlaceDetail from "./pages/NearPlaceDetail";
import KakaoRedirectPage from "./pages/KakaoRedirectPage";
import PlaceRegistrationPage from "./pages/PlaceRegistrationPage";
import MyPage from "./pages/MyPage";
import MapPage from "./pages/MapPage";
import TravelRoutePage from "./pages/TravelRoutePage";
import { getUserInfo } from "./api/Kakao";
import Footer from "./components/layout/Footer";
import ChatPage from "./pages/ChatPage";
import TravelPlanPage from "./pages/TravelPlanPage";
import TravelRouteDetailPage from "./pages/TravelRouteDetailPage";
import { ReactComponent as ChatButton } from "./assets/layout/ChatButton.svg";
import LoginModal from "./components/common/LoginModal";
import Intro from "./pages/Intro";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideFooter = location.pathname === "/chat"; // 채팅화면에서는 푸터X
  const hideChatButton = location.pathname === "/chat"; // 채팅화면에서는 버튼X

  // 로그인 모달
  const token = localStorage.getItem("accessToken");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    window.location.href = "/chat";
  };

  return (
    <>
      {children}
      {!hideFooter && <Footer />}

      {/* 오른쪽 아래 플로팅 버튼 */}
      {!hideChatButton && (
        <FloatingButton onClick={handleClick}>
          <ChatButton />
        </FloatingButton>
      )}

      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          title="로그인이 필요해요!"
          description={
            <>
              대한민국 속 숨겨진 나라를 찾고 싶다면
              <br />
              로그인을 해주세요!
            </>
          }
          confirmText="로그인"
          onConfirm={() => (window.location.href = "/login")}
        />
      )}
    </>
  );
};

const FloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 60px;
    height: 60px;
    fill: white;
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("사용자");
  const [profileImg, setProfileImg] = useState("");

  // 초기 토큰 확인 후, 로그인 상태만 체크
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const res = await getUserInfo();
          if (res.isSuccess) {
            setIsLoggedIn(true);
            setNickname(res.data.nickname || "사용자");
            setProfileImg(res.data.profileImage || "");
          } else {
            console.error("유저 정보 로드 실패:", res.message);
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("유저 정보 로드 실패:", error);
          setIsLoggedIn(false);
        }
      };
      fetchUserInfo();
    }
  }, [isLoggedIn]);

  const updateUserState = (token?: string, nick?: string, img?: string) => {
    if (token) localStorage.setItem("accessToken", token);
    setIsLoggedIn(true);
    setNickname(nick || "사용자");
    setProfileImg(img || "");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setNickname("사용자");
    setProfileImg("");
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AppLayout>
          <Navbar
            isLoggedIn={isLoggedIn}
            nickname={nickname}
            profileImg={profileImg}
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/asia" element={<AsiaHomePage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/login" element={<KakaoLoginPage />} />
            <Route
              path="/callback"
              element={<KakaoRedirectPage onLogin={updateUserState} />}
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/signup/complete"
              element={<SignupCompletePage onLogin={updateUserState} />}
            />
            <Route path="/main/place" element={<PlaceDetail />} />
            <Route path="/main/place/near" element={<NearPlaceDetail />} />
            <Route path="/register" element={<PlaceRegistrationPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/route" element={<TravelRoutePage />} />
            <Route path="/route/detail" element={<TravelRouteDetailPage />} />
            <Route path="/route/new" element={<TravelPlanPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
