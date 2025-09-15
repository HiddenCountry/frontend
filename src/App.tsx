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


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState("");

  // 임시 로컬스토리지
  const syncLoginState = () => {
    const token = localStorage.getItem("accessToken");
    const savedName = localStorage.getItem("nickname");
    const savedProfile = localStorage.getItem("profileImg");

    if (token) {
      setIsLoggedIn(true);
      setUserName(savedName || "사용자");
      setProfileImg(savedProfile || "");
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setProfileImg("");
    }
  };

  useEffect(() => {
    syncLoginState();

    window.addEventListener("storage", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
    };
  }, []);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nickname");
    localStorage.removeItem("profileImg");
    syncLoginState();
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <div className="App">
          <Navbar
            isLoggedIn={isLoggedIn}
            userName={userName}
            profileImgUrl={profileImg}
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/asia" element={<AsiaHomePage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/login" element={<KakaoLoginPage />} />
            <Route path="/callback" element={<KakaoRedirectPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/signup/complete"
              element={
                <SignupCompletePage
                  onSignupComplete={(nickname) => {
                    localStorage.setItem("nickname", nickname);
                    setIsLoggedIn(true);
                    setUserName(nickname);
                  }}
                />
              }
            />
            <Route path="/main/place" element={<PlaceDetail />} />
            <Route path="/main/place/near" element={<NearPlaceDetail />} />
            <Route path="/register" element={<PlaceRegistrationPage />} />
            <Route path="/mypage" element={<MyPage />} />

          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
