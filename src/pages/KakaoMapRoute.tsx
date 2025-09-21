import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface Point {
  lat: number;
  lng: number;
  title?: string;
}

interface KakaoMapRouteProps {
  points: Point[];
}

const KakaoMapRoute: React.FC<KakaoMapRouteProps> = ({ points }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !window.kakao || points.length === 0) return;
    const { kakao } = window;

    // 지도 생성
    const map = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(points[0].lat, points[0].lng),
      level: 5,
    });

    // 지도 크기 재조정
    setTimeout(() => {
      map.relayout();
    }, 0);

    // 지도 영역을 자동으로 맞추기 위한 LatLngBounds
    const bounds = new kakao.maps.LatLngBounds();

    // 현재 열려 있는 overlay 저장
    let activeOverlay: any = null;

    // 마커 + CustomOverlay
    points.forEach((p) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(p.lat, p.lng),
        map,
      });

      bounds.extend(new kakao.maps.LatLng(p.lat, p.lng)); // bounds에 좌표 추가

      if (p.title) {
        const overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(p.lat, p.lng),
          content: `<div style="padding:8px;background:#fff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15); white-space:nowrap;">
                      <strong style="color:#1e90ff;">${p.title}</strong>
                    </div>`,
          yAnchor: 1.2,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          if (activeOverlay && activeOverlay !== overlay) {
            activeOverlay.setMap(null); // 이전 overlay 닫기
          }

          if (activeOverlay === overlay) {
            overlay.setMap(null); // 같은 거 클릭 시 닫기
            activeOverlay = null;
          } else {
            overlay.setMap(map); // 열기
            activeOverlay = overlay;
          }
        });
      }
    });

    // Polyline 생성
    const linePath = points.map((p) => new kakao.maps.LatLng(p.lat, p.lng));
    const polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 4,
      strokeColor: "#1e90ff",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });
    polyline.setMap(map);

    // 지도 중심과 줌 레벨을 bounds에 맞게 조정
    map.setBounds(bounds);
  }, [points]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "1000px", borderRadius: "12px" }}
      />
    </div>
  );
};

export default KakaoMapRoute;
