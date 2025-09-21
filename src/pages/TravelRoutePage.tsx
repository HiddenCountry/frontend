// src/pages/TravelRoutePage.tsx
import React, { useState, useEffect } from "react";
import KakaoMapRoute from "./KakaoMapRoute";
import styled from "styled-components";
import { color, ColorKey } from "../styles/color";
import { useNavigate } from "react-router-dom";


/* ============ kakao 전역 타입 ============ */
declare global {
  interface Window {
    kakao: any;
  }
}

/* ============ 앱키 (CRA) ============ */
const KAKAO_JS_KEY: string =
  (process.env.REACT_APP_KAKAO_JS_KEY as string) || "";

/* ============ SDK 로더 훅 ============ */
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


const travelCourses = [
    {
    title: "인천에서 떠나는 아시아 여행!",
    color: "#0288d1",
    data: [
      { id: 1765, contentId : 3003517, contentTypeId:12, title: "인천일본풍거리", description: "일본 교토의 골목길을 옮겨온 듯한 거리. 목조 건물과 레트로 간판들이 이국적인 산책 코스를 선사합니다.", latitude: 37.4736725684, longitude: 126.6208729040, image: "http://tong.visitkorea.or.kr/cms/resource/66/3001966_image2_1.jpg" },
      { id: 533, contentId:264512, contentTypeId:12, title:"인천차이나타운" , description: "중국 본토의 차이나타운을 연상케 하는 공간. 붉은 등롱과 황금빛 문양, 다양한 중국 음식을 즐길 수 있는 진짜 여행지 같은 명소입니다.", latitude: 37.4738502955, longitude: 126.6191619441, image: "http://tong.visitkorea.or.kr/cms/resource/78/3304278_image2_1.jpg" },
      { id: 1766, contentId:724036,  contentTypeId:39, title: "대창반점", description: "중국 현지 느낌 그대로! 1980년에 개업한 중국 현지 그대로의 중식 맛집!", latitude: 37.4746557478, longitude: 126.6186369698, image: "http://tong.visitkorea.or.kr/cms/resource/42/3037342_image2_1.jpg" },
      { id: 732, contentId : 2781336, contentTypeId:12, title: "삼국지벽화거리", description: "중국 삼국지의 장대한 서사가 벽화로 펼쳐진 거리. 한 폭의 역사 속에 들어선 듯한 색다른 여행 경험을 제공합니다.", latitude: 37.4745724172, longitude: 126.6182286760, image: "http://tong.visitkorea.or.kr/cms/resource/93/3381793_image2_1.jpg" },
    ],
  },
  {
    title: "충남에서 떠는 유럽 여행!",
    color: "#0288d1",
    data: [
      { id: 957, contentId : 2851299, contentTypeId:12, title: "멜로우데이즈", description: "프랑스 시골 마을의 아기자기한 감성을 담은 카페로, 빈티지한 인테리어와 함께 여유로운 시간을 보낼 수 있는 공간입니다.", latitude: 36.4215905273, longitude: 126.4115146532, image: "http://tong.visitkorea.or.kr/cms/resource/93/2851293_image2_1.jpg" },
      { id: 47, contentId : 1932645, contentTypeId:32, title: "그람피하우스", description: "스위스 알프스 마을을 연상시키는 정원과 산책로가 매력적인 힐링 스팟으로, 자연과 함께하는 편안한 시간을 제공합니다.", latitude: 36.6565756082, longitude: 126.3079150768, image: "http://tong.visitkorea.or.kr/cms/resource/48/2597748_image2_1.jpg" },
      { id: 955, contentId : 2606741, contentTypeId:12, title: "지중해마을", description: "그리스 산토리니를 연상시키는 하얀 건물과 파란 지붕의 골목길이 매력적인 곳으로, 유럽의 지중해 마을을 그대로 옮겨놓은 듯한 느낌을 줍니다.", latitude: 36.7969864197, longitude: 127.0616376806 , image: "http://tong.visitkorea.or.kr/cms/resource/83/1938083_image2_1.jpg" },
      { id: 1767, contentId : 662268, contentTypeId:12, title: "피나클랜드 수목원", description: "유럽 정원과 화려한 꽃들로 가득한 동서양 감성이 만점인 공간으로, 다양한 식물과 꽃들을 감상하며 산책할 수 있습니다.", latitude: 36.8725197718, longitude: 126.9263450490, image: "http://tong.visitkorea.or.kr/cms/resource/81/3350481_image2_1.JPG" },
    ],
  }
];

const TravelRoutePage: React.FC = () => {

  const loaded = useKakaoLoader(KAKAO_JS_KEY);
  const navigate = useNavigate();

  
  const goDetail = (p: any) => {
    const anyP = p as any;

    navigate("/main/place", {
      state: {
        id: anyP.id as number,
        contentId: anyP.contentId,
        contentTypeId: anyP.contentTypeId,
        longitude : anyP.longitude,
        latitude :anyP.latitude
      },
    });
};

  // const [selected, setSelected] = useState<keyof typeof travelCourses>[0];
  // const current = travelCourses[selected];
const [selected, setSelected] = useState<
  typeof travelCourses[number]["title"] // travelCourses 안의 title 중 하나만 가능
>(travelCourses[0].title);

const current = travelCourses.find((c) => c.title === selected)!;
  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: "Segoe UI", sans-serif;
          background: #f6f8fb;
        }
        .page {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        /* 메뉴 */
        .menu {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .menu button {
          padding: 0.8rem 1.2rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .menu button.active {
          background: ${current.color};
          color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .menu button:not(.active) {
          background: #fff;
          color: #555;
          border: 1px solid #ddd;
        }
        /* 타이틀 */
        header h1 {
          text-align: center;
          font-size: 2rem;
          color: ${color.primary500};
          margin-bottom: 1rem;
        }
        /* 비행기 루트 */
        .top-route {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 1rem 0;
        }
        .route-line {
          position: absolute;
          top: 50%;
          left: 5%;
          right: 5%;
          height: 4px;
          background: linear-gradient(to right,  ${color.primary500}, ${current.color});
          z-index: 1;
        }
        .route-node {
           position: relative;
  z-index: 2;
  background: #fff;
  border: 3px solid  ${color.primary500};;
  border-radius: 12px;       /* 원 대신 살짝 둥근 네모 */
  width: auto;                /* 글자 길이에 맞춰 늘어나도록 */
  padding: 0 15px;            /* 좌우 여백 */
  height: 40px;               /* 높이는 적당히 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color:  ${color.primary500};;
  cursor: pointer;
  transition: transform 0.3s;
  white-space: nowrap;        /* 글자가 줄바꿈되지 않고 한 줄로 유지 */
        }
        .route-node:hover {
          transform: scale(1.1);
          background: #f0faff;
        }
        .plane {
          position: absolute;
          top: calc(50% - 15px);
          left: 5%;
          font-size: 1.5rem;
          animation: fly 10s linear infinite;
          z-index: 3;
        }
        @keyframes fly {
          0% { left: 5%; transform: rotate(10deg); }
          50% { left: 50%; transform: rotate(0deg); }
          100% { left: 95%; transform: rotate(-10deg); }
        }
        /* 컨텐츠 좌우 레이아웃 */
        .content {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .left-panel {
          flex: 1 1 400px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .place-card {
          background: #f9f9f9;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }
        .place-card:hover {
          transform: translateY(-5px);
        }
        .place-title {
          font-weight: bold;
          font-size: 1.1rem;
          color:  ${color.primary500};;
        }
        .place-desc {
          font-size: 0.9rem;
          color: #555;
        }
        .place-coord {
          font-size: 0.8rem;
          color: #888;
        }
        .right-panel {
          flex: 1 1 500px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .place-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  padding: 1rem;
}

.place-card-inner {
  display: flex;
  align-items: flex-start; /* 세로축을 위로 정렬 */
  justify-content: flex-start; /* 가로축을 왼쪽으로 정렬 */
  gap: 1rem;
}

.place-image img {
  width: 200px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
}

.place-info {
  flex: 1;
  display: flex;
  flex-direction: column;  /* 위아래 배치 */
  align-items: flex-start; /* 가로축: 왼쪽 */
  justify-content: flex-start; /* 세로축: 위쪽 */
  text-align: left;
}

.place-title {
  font-weight: bold;
  font-size: 1.2rem;
  color:  ${color.primary500};;
}

.place-desc {
  margin-top: 0.3rem;
  color: #555;
}

.place-coord {
  margin-top: 0.3rem;
  font-size: 0.85rem;
  color: #888;
}



        @media (max-width: 900px) {
          .content {
            flex-direction: column;
          }
        }
      `}</style>
      <div className="page">
        {/* 메뉴 */}
<nav className="menu">
  {travelCourses.map((course) => (
    <button
      key={course.title}
      onClick={() => setSelected(course.title)}
      className={selected === course.title ? "active" : ""}
    >
      {course.title}
    </button>
  ))}
</nav>
        {/* 타이틀 */}
        <header>
          <h1>{current.title}</h1>
          <div className="top-route">
            <div className="route-line"></div>
            <div className="plane">✈️</div>
            {/* <div className="route-node"></div> */}
            {current.data.map((item) => (
              <div key={item.id} className="route-node">{item.title}</div>
            ))}
            {/* <div className="route-node">귀환</div> */}
          </div>
        </header>

        {/* 좌우 컨텐츠 */}
        <div className="content">
           <div className="left-panel">
    {current.data.map((item) => (
      <div key={item.id} className="place-card">
        <div className="place-card-inner"  onClick={() => goDetail(item)}>
          {/* 오른쪽 텍스트 */}
          <div className="place-info">
            <div className="place-title">{item.title}</div>
            <div className="place-desc">{item.description}</div>
          </div>
          {/* 왼쪽 이미지 */}
          <div className="place-image">
            <img src={item.image || "https://via.placeholder.com/100"} alt={item.title} />
          </div>
          
        </div>
      </div>
    ))}
  </div>

          <div className="right-panel">
            <KakaoMapRoute
    points={current.data.map((item) => ({
      lat: item.latitude,
      lng: item.longitude,
      title: item.title,
    }))}
  />
          </div>
        </div>
      </div>
    </>
  );
};


// export interface PlaceMapItem {
//   id: number;
//   contentId: number;
//   contentTypeId: number;
// }



export default TravelRoutePage;
