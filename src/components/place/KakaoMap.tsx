import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as Reset } from "../../assets/main/Reset.svg";

interface KakaoMapProps {
  points: {
    latitude: number;
    longitude: number;
    title?: string;
    address?: string;
    imageUrl?: string;
  }[];
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_JS_KEY: string =
  (process.env.REACT_APP_KAKAO_JS_KEY as string) || "";

function useKakaoLoader(appkey: string) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!appkey) return;
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

const KakaoMap: React.FC<KakaoMapProps> = ({ points }) => {
  const loaded = useKakaoLoader(KAKAO_JS_KEY);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  // 위도/경도 거리 계산 (Haversine)
  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371000; // 지구 반지름(m)
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceM = R * c;
    return (distanceM / 1000).toFixed(2); // km, 소수점 2자리
  };

  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    const { kakao } = window;

    // 지도 생성 (임시 중심)
    const map = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(points[0].latitude, points[0].longitude),
      level: 5,
    });
    mapRef.current = map;

    // 지도 Bounds 설정 (마커 2개 이상일 때)
    if (points.length >= 2) {
      const bounds = new kakao.maps.LatLngBounds();
      points.forEach((p) =>
        bounds.extend(new kakao.maps.LatLng(p.latitude, p.longitude))
      );

      // 여유 공간 추가 (10%)
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();

      const latDiff = northEast.getLat() - southWest.getLat();
      const lngDiff = northEast.getLng() - southWest.getLng();
      const extra = 0.2; // 10% 여유

      bounds.extend(
        new kakao.maps.LatLng(
          southWest.getLat() - latDiff * extra,
          southWest.getLng() - lngDiff * extra
        )
      );
      bounds.extend(
        new kakao.maps.LatLng(
          northEast.getLat() + latDiff * extra,
          northEast.getLng() + lngDiff * extra
        )
      );

      map.setBounds(bounds);
    }

    points.forEach((p) => {
      // 마커
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(p.latitude, p.longitude),
        map,
      });

      // CustomOverlay
      const iwContent = `
        <div style="padding:12px; background:#fff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); font-family:Pretendard, sans-serif;">
          ${
            p.imageUrl
              ? `<img src="${p.imageUrl}" style="width:100%; border-radius:8px; margin-bottom:8px;" />`
              : ""
          }
          <strong style="font-size:16px; color:#1e90ff; display:block; margin-bottom:4px;">${
            p.title || "장소"
          }</strong>
          <span style="font-size:14px; color:#555; display:block;">${
            p.address || ""
          }</span>
        </div>
      `;
      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(p.latitude, p.longitude),
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
    });

    // 좌표 2개면 선 그리기 + 거리 표시
    if (points.length === 2) {
      const linePath = points.map(
        (p) => new kakao.maps.LatLng(p.latitude, p.longitude)
      );
      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 4,
        strokeColor: "#1e90ff",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });
      polyline.setMap(map);

      // 거리 표시 (km)
      const distanceKm = getDistanceKm(
        points[0].latitude,
        points[0].longitude,
        points[1].latitude,
        points[1].longitude
      );
      const midLat = (points[0].latitude + points[1].latitude) / 2;
      const midLng = (points[0].longitude + points[1].longitude) / 2;

      const distanceOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(midLat, midLng),
        content: `<div style="padding:4px 8px; background:#1e90ff; color:#fff; border-radius:8px; font-size:14px;">${distanceKm} km</div>`,
        yAnchor: 0.5,
      });
      distanceOverlay.setMap(map);
    }
  }, [loaded, points]);

  const handleRefresh = () => {
    if (mapRef.current && points.length > 0) {
      const { kakao } = window;
      mapRef.current.setCenter(
        new kakao.maps.LatLng(points[0].latitude, points[0].longitude)
      );
      mapRef.current.setLevel(5);
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
