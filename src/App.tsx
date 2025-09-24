import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            setProfileImg(res.data.profileImg || "");
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
          <Route path="/route" element={<TravelRoutePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
