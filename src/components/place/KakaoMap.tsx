import React, { useRef, useEffect } from "react";
import styled from "styled-components";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  imageUrl?: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  latitude,
  longitude,
  title,
  address,
  imageUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !window.kakao) return;
    const { kakao } = window;

    // 지도 초기화
    const map = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 5,
    });
    mapRef.current = map;

    // 👇 지도 크기 보정
    setTimeout(() => {
      map.relayout();
      map.setCenter(new kakao.maps.LatLng(latitude, longitude));
    }, 0);

    // 마커 생성
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(latitude, longitude),
      map,
    });

    // CustomOverlay 생성
    const iwContent = `
      <div style="
        padding: 12px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: Pretendard, sans-serif;
        word-wrap: break-word;
        word-break: break-word;
      ">
        ${
          imageUrl
            ? `<img src="${imageUrl}" style="width:100%; border-radius:8px; margin-bottom:8px;" />`
            : ""
        }
        <strong style="font-size:16px; color:#1e90ff; display:block; margin-bottom:4px;">
          ${title || "장소"}
        </strong>
        <span style="font-size:14px; color:#555; display:block;">
          ${address || ""}
        </span>
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
  }, [latitude, longitude, title, address, imageUrl]);

  return <MapBox ref={containerRef} />;
};

export default KakaoMap;

const MapBox = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 8px;
`;
