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

function App() {
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || "사용자"
  );
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("profileImage") || ""
  );

  // 로그인 상태 갱신
  const handleLogin = (token: string, nick: string, img?: string) => {
    setIsLoggedIn(!!token);
    setNickname(nick);
    setProfileImg(img || "");
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nickname");
    localStorage.removeItem("profileImage");
    setIsLoggedIn(false);
    setNickname("");
    setProfileImg("");
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <div className="App">
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
              element={<KakaoRedirectPage onLogin={handleLogin} />}
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/signup/complete"
              element={
                <SignupCompletePage
                  onSignupComplete={(nickname) => {
                    localStorage.setItem("nickname", nickname);
                    setIsLoggedIn(true);
                    setNickname(nickname);
                  }}
                />
              }
            />

            <Route path="/main/place" element={<PlaceDetail />} />
            <Route path="/main/place/near" element={<NearPlaceDetail />} />
            <Route path="/register" element={<PlaceRegistrationPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/route" element={<TravelRoutePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
