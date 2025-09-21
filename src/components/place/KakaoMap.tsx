import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as Reset } from "../../assets/main/Reset.svg";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  imageUrl?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}
const TOURAPI_KEY = process.env.REACT_APP_TOUR_SERVICE_KEY;

// 앱키 (CRA)
const KAKAO_JS_KEY: string =
  (process.env.REACT_APP_KAKAO_JS_KEY as string) || "";

// SDK 로더 훅
function useKakaoLoader(appkey: string) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!appkey) {
      console.error("REACT_APP_KAKAO_JS_KEY가 비어 있습니다.");
      return;
    }
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => setLoaded(true));
      return;
    }
    const id = "kakao-sdk";
    if (document.getElementById(id)) {
      const t = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(t);
          window.kakao.maps.load(() => setLoaded(true));
        }
      }, 50);
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false&libraries=services,clusterer`;
    s.onload = () => window.kakao.maps.load(() => setLoaded(true));
    document.head.appendChild(s);
  }, [appkey]);

  return loaded;
}
const KakaoMap: React.FC<KakaoMapProps> = ({
  latitude,
  longitude,
  title,
  address,
  imageUrl,
}) => {
  const loaded = useKakaoLoader(KAKAO_JS_KEY);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // 지도 생성
  useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return;
    const { kakao } = window;

    const map = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 5,
    });
    mapRef.current = map;

    // 마커
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(latitude, longitude),
      map,
    });
    markerRef.current = marker;

    // CustomOverlay
    const iwContent = `
      <div style="padding:12px; background:#fff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); font-family:Pretendard, sans-serif;">
        ${
          imageUrl
            ? `<img src="${imageUrl}" style="width:100%; border-radius:8px; margin-bottom:8px;" />`
            : ""
        }
        <strong style="font-size:16px; color:#1e90ff; display:block; margin-bottom:4px;">${
          title || "장소"
        }</strong>
        <span style="font-size:14px; color:#555; display:block;">${
          address || ""
        }</span>
      </div>
    `;
    const overlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(latitude, longitude),
      content: iwContent,
      yAnchor: 1.5,
    });

    let isOpen = false;
    kakao.maps.event.addListener(marker, "click", () => {
      if (isOpen) {
        overlay.setMap(null);
        isOpen = false;
      } else {
        overlay.setMap(map);
        isOpen = true;
      }
    });
  }, [loaded, latitude, longitude, title, address, imageUrl]);

  // 새로고침 버튼 클릭
  const handleRefresh = () => {
    if (mapRef.current) {
      const { kakao } = window;
      mapRef.current.setCenter(new kakao.maps.LatLng(latitude, longitude));
      mapRef.current.setLevel(5); // 원하는 줌 레벨
    }
  };

  return (
    <MapContainer>
      <MapBox ref={containerRef} />
      <RefreshButton onClick={handleRefresh}>
        <Reset />
      </RefreshButton>
    </MapContainer>
  );
};

export default KakaoMap;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 8px;
`;
const MapBox = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 8px;
`;
const RefreshButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: ${({ theme }) => theme.color.white};
  border: 2px solid ${({ theme }) => theme.color.primary500};
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  font-size: 14px;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;
