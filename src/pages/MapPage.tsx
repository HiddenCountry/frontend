import React from "react";
import styled from "styled-components";

// 전역 kakao 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

// CRA 환경변수에서 앱키 읽기 (빌드타임 치환)
const KAKAO_JS_KEY: string = (process.env.REACT_APP_KAKAO_JS_KEY as string) || "";

// Kakao SDK 로더 훅 (idempotent)
function useKakaoLoader(appkey: string) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!appkey) {
      console.error("REACT_APP_KAKAO_JS_KEY가 비어 있습니다. .env 설정 후 dev 서버 재시작 필요");
      return;
    }

    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => setLoaded(true));
      return;
    }

    const id = "kakao-sdk";
    const exist = document.getElementById(id) as HTMLScriptElement | null;
    if (exist) {
      // 다른 인스턴스가 로드 중일 수 있음 → 맵스 로드 대기
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

// 순수 맵 컴포넌트 (현재 위치 사용 + 내 위치로 이동 버튼)
const KakaoMap: React.FC = () => {
  const loaded = useKakaoLoader(KAKAO_JS_KEY);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<any>(null);
  const userMarkerRef = React.useRef<any>(null);
  const userCircleRef = React.useRef<any>(null);

  const [userPos, setUserPos] = React.useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = React.useState<string | null>(null);
  const [locating, setLocating] = React.useState(false);

  // 지도 생성 (1회)
  React.useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return;
    const { kakao } = window;
    const defaultCenter = new kakao.maps.LatLng(37.5666805, 126.9784147); // fallback: 서울시청
    mapRef.current = new kakao.maps.Map(containerRef.current, { center: defaultCenter, level: 7 });
  }, [loaded]);

  // 현재 위치 갱신 로직 (초기 + 버튼 공용)
  const locateUser = React.useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeoError("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      return;
    }
    if (!mapRef.current) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setGeoError(null);

        const { latitude, longitude, accuracy } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude });

        const { kakao } = window;
        const map = mapRef.current;
        const coord = new kakao.maps.LatLng(latitude, longitude);

        // 기존 표시 제거
        if (userMarkerRef.current) userMarkerRef.current.setMap(null);
        if (userCircleRef.current) userCircleRef.current.setMap(null);

        // 마커(현재 위치)
        userMarkerRef.current = new kakao.maps.Marker({
          position: coord,
          zIndex: 10,
        });
        userMarkerRef.current.setMap(map);

        // 정확도 원 (accuracy 미제공 시 최소 반경 30m)
        userCircleRef.current = new kakao.maps.Circle({
          center: coord,
          radius: Math.max(accuracy || 50, 30),
          strokeWeight: 2,
          strokeColor: "#4f46e5",
          strokeOpacity: 0.7,
          strokeStyle: "dashed",
          fillColor: "#6366f1",
          fillOpacity: 0.2,
        });
        userCircleRef.current.setMap(map);

        // 센터 이동
        map.setCenter(coord);
      },
      (err) => {
        setLocating(false);
        setGeoError(err.message || "현재 위치를 가져올 수 없습니다.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // 초기 한 번 현재 위치로
  React.useEffect(() => {
    if (!loaded || !mapRef.current) return;
    locateUser();
  }, [loaded, locateUser]);

  return (
    <MapWrap>
      <MapBox ref={containerRef} role="img" aria-label="Kakao map" />
      <Controls>
        <ControlButton onClick={locateUser} aria-busy={locating}>
          {locating ? "찾는 중..." : "내 위치로 이동"}
        </ControlButton>
      </Controls>
      {geoError && <Toast>📍 {geoError} — 브라우저 위치 권한을 확인해주세요.</Toast>}
    </MapWrap>
  );
};

const MapPage: React.FC = () => {
  return (
    <Page>
      <KakaoMap />
    </Page>
  );
};

export default MapPage;

const Page = styled.div`
  min-height: 100vh;
  background: #fff;
  padding: 24px;
`;
const MapWrap = styled.div`
  position: relative;
`;
const MapBox = styled.div`
  width: 100%;
  height: 560px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;
const Controls = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
  display: flex;
  gap: 8px;
  z-index: 20; 
`;
const ControlButton = styled.button`
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;
const Toast = styled.div`
  position: absolute;
  left: 12px;
  bottom: 12px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 13px;
  color: #374151;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
`;
