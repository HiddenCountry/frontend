import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import NearCard from "../components/place/NearCard";
import { getPlaces } from "../api/Place";
import TravelCard from "../components/travel/TravelCard";
import { useNavigate } from "react-router-dom";
import { postTravelCourse } from "../api/TravelCourse";

interface PlaceType {
  id: number;
  title: string;
  addr1: string;
  firstImage?: string;
  contentTypeId: string;
  latitude?: number;
  longitude?: number;
  dist?: number;
}

declare global {
  interface Window {
    kakao: any;
  }
}

// 지역 옵션
const AREA_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "서울", value: "SEOUL" },
  { label: "인천", value: "INCHEON" },
  { label: "대전", value: "DAJEON" },
  { label: "대구", value: "DAEGU" },
  { label: "광주", value: "GWANGJU" },
  { label: "부산", value: "BUSAN" },
  { label: "울산", value: "ULSAN" },
  { label: "세종", value: "SEJONG" },
  { label: "경기", value: "GYEONGGI" },
  { label: "강원", value: "GANGWON" },
  { label: "충북", value: "CHUNGBUK" },
  { label: "충남", value: "CHUNGNAM" },
  { label: "경북", value: "GYEONGBUK" },
  { label: "경남", value: "GYEONGNAM" },
  { label: "전북", value: "JEONBUK" },
  { label: "전남", value: "JEONNAM" },
  { label: "제주", value: "JEJU" },
];

// 대륙 옵션
const CONTINENTS = [
  {
    label: "동남아시아",
    value: "SOUTHEAST_ASIA",
  },
  { label: "몽골", value: "MONGOLIA" },
  { label: "아랍", value: "ARAB" },
  { label: "인도", value: "INDIA" },
  { label: "일본", value: "JAPAN" },
  { label: "중화/중국", value: "CHINA" },
  { label: "터키", value: "TURKEY" },

  { label: "남아메리카", value: "SOUTH_AMERICA" },
  { label: "북아메리카", value: "NORTH_AMERICA" },
  { label: "아프리카", value: "AFRICA" },
  { label: "오세아니아", value: "OCEANIA" },
  { label: "유럽", value: "EUROPE" },
];

interface TravelCourseData {
  name: string;
  placeIds: number[];
}

const TravelPlanPage: React.FC = () => {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceType[]>([]);
  const [courseName, setCourseName] = useState("");
  const navigate = useNavigate();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const polyline = useRef<any>(null);
  const distanceOverlays = useRef<any[]>([]);

  // 카카오맵 로드
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JS_KEY}&autoload=false`;
        script.async = true;
        script.onload = () => {
          window.kakao.maps.load(() => initMap());
        };
        document.head.appendChild(script);
      }
    };

    const initMap = () => {
      if (mapRef.current) {
        mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 7,
        });
      }
    };

    loadKakaoMap();
  }, []);

  // 관광지 조회
  const handleSearch = async () => {
    try {
      setSelectedPlaces([]);

      const area = region === "ALL" ? [] : [region];

      const res = await getPlaces(
        0,
        20,
        area,
        [],
        [],
        country,
        "DISTANCE_ASC",
        37.5665,
        126.978,
        ""
      );
      setPlaces(res.data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 관광지 선택/삭제
  const handleSelectPlace = (place: PlaceType) => {
    // 이미 선택되어 있다면 제거
    if (selectedPlaces.find((p) => p.id === place.id)) {
      setSelectedPlaces((prev) => prev.filter((p) => p.id !== place.id));
    } else {
      // 선택 안 되어 있다면 추가
      setSelectedPlaces((prev) => [...prev, place]);
    }
  };

  // 여행 코스 등록하기
  const handleSaveCourse = async () => {
    if (!courseName.trim()) {
      alert("코스 이름을 입력해주세요!");
      return;
    }
    if (selectedPlaces.length === 0) {
      alert("최소 1개 이상의 관광지를 선택해주세요!");
      return;
    }

    try {
      const data: TravelCourseData = {
        name: courseName,
        placeIds: selectedPlaces.map((p) => p.id),
      };

      const res = await postTravelCourse(data);

      if (res.isSuccess || res.data?.code === "COMMON200") {
        alert("여행 코스가 성공적으로 등록되었습니다!");
        navigate("/route");
      } else {
        alert("등록 중 문제가 발생했습니다.");
      }
    } catch (err) {
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  const handleRemovePlace = (id: number) => {
    setSelectedPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  // 선택 관광지 마커/폴리라인
  useEffect(() => {
    if (!mapInstance.current || !window.kakao) return;

    // 기존 마커 삭제
    markers.current.forEach((m) => m.setMap(null));
    markers.current = [];

    selectedPlaces.forEach((p) => {
      if (!p.latitude || !p.longitude) return;
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(p.latitude, p.longitude),
        map: mapInstance.current,
      });
      markers.current.push(marker);
    });

    // 맵 중심 이동
    if (selectedPlaces.length > 0) {
      const last = selectedPlaces[selectedPlaces.length - 1];
      if (last.latitude && last.longitude) {
        mapInstance.current.setCenter(
          new window.kakao.maps.LatLng(last.latitude, last.longitude)
        );
      }
    }

    // 기존 폴리라인 삭제
    if (polyline.current) polyline.current.setMap(null);

    // 기존 거리 오버레이 삭제
    distanceOverlays.current?.forEach((ov) => ov.setMap(null));
    distanceOverlays.current = [];

    if (selectedPlaces.length > 1) {
      const path = selectedPlaces
        .filter((p) => p.latitude && p.longitude)
        .map((p) => new window.kakao.maps.LatLng(p.latitude!, p.longitude!));

      polyline.current = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 4,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });
      polyline.current.setMap(mapInstance.current);

      // 각 구간 거리 표시
      for (let i = 1; i < selectedPlaces.length; i++) {
        const prev = selectedPlaces[i - 1];
        const cur = selectedPlaces[i];
        if (
          !prev.latitude ||
          !prev.longitude ||
          !cur.latitude ||
          !cur.longitude
        )
          continue;

        const midLat = (prev.latitude + cur.latitude) / 2;
        const midLng = (prev.longitude + cur.longitude) / 2;

        const distance = calculateDistance(prev, cur).toFixed(2) + " km";

        const overlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(midLat, midLng),
          content: `<div style="padding:2px 6px; background:rgba(255,255,255,0.8); border:1px solid #FF0000; border-radius:4px; font-size:12px;">${distance}</div>`,
        });
        overlay.setMap(mapInstance.current);

        distanceOverlays.current.push(overlay);
      }
    }
  }, [selectedPlaces]);

  // 거리 계산
  const calculateDistance = (a: PlaceType, b: PlaceType) => {
    if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
    const R = 6371;
    const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
    const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
    const lat1 = (a.latitude * Math.PI) / 180;
    const lat2 = (b.latitude * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
  };

  const totalDistance = selectedPlaces.reduce((acc, cur, idx, arr) => {
    if (idx === 0) return acc;
    return acc + calculateDistance(arr[idx - 1], cur);
  }, 0);

  return (
    <Container>
      <TitleHeader>
        <SmallTitle>마음이 향하는 곳을 따라 나만의 길을 그려보세요</SmallTitle>
        <BigTitle>나만의 여행 코스 만들기</BigTitle>
      </TitleHeader>

      <TopContainer>
        <Sidebar>
          <CourseSaveBox>
            <Label htmlFor="courseName">코스 이름</Label>
            <Input
              id="courseName"
              type="text"
              placeholder="코스 이름을 입력하세요"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </CourseSaveBox>

          <Controls>
            <Label htmlFor="courseName">코스 선택</Label>
            <SelectRow>
              <Select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">대륙 선택</option>
                {CONTINENTS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>

              <Select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">지역 선택</option>
                {AREA_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>

              <Button onClick={handleSearch}>조회</Button>
            </SelectRow>
          </Controls>

          <Places>
            {places.map((p) => (
              <TravelCard
                key={p.id}
                addr1={p.addr1}
                contentid={p.id.toString()}
                contenttypeid={p.contentTypeId.toString()}
                dist={p.dist ? p.dist.toString() : "0"}
                firstimage={p.firstImage}
                title={p.title}
                latitude={p.latitude}
                longitude={p.longitude}
                onClick={() => handleSelectPlace(p)}
                selected={selectedPlaces.some((sp) => sp.id === p.id)} // 선택 여부 체크
              />
            ))}
          </Places>
          <SaveButton onClick={handleSaveCourse}>코스 등록하기</SaveButton>
        </Sidebar>
        <MapContainer>
          <MapBox ref={mapRef} />
        </MapContainer>
      </TopContainer>
      <BottomContainer>
        <BottomColumn>
          <SelectedList>
            <h3>선택된 관광지</h3>
            {selectedPlaces.length > 0 && (
              <>
                {selectedPlaces.map((p) => (
                  <SelectedItem key={p.id}>
                    {p.title}
                    <RemoveBtn onClick={() => handleRemovePlace(p.id)}>
                      ❌
                    </RemoveBtn>
                  </SelectedItem>
                ))}
              </>
            )}
          </SelectedList>
        </BottomColumn>

        <BottomColumn>
          <DistanceInfo>
            <h3>거리 정보</h3>
            {selectedPlaces.length > 1 && (
              <>
                {selectedPlaces.map((p, idx) => {
                  if (idx === 0) return null;
                  const dist = calculateDistance(
                    selectedPlaces[idx - 1],
                    p
                  ).toFixed(2);
                  return (
                    <div key={p.id}>
                      {selectedPlaces[idx - 1].title} → {p.title}: {dist} km
                    </div>
                  );
                })}
                <TotalDistance>
                  총 거리: {totalDistance.toFixed(2)} km
                </TotalDistance>
              </>
            )}
          </DistanceInfo>
        </BottomColumn>
      </BottomContainer>
    </Container>
  );
};

export default TravelPlanPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 40px 12%;
  background: ${({ theme }) => theme.color.gray50};
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

const TitleHeader = styled.header``;

const SmallTitle = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  margin-top: 10px;
  text-align: center;
  color: ${({ theme }) => theme.color.gray800};

  @media (max-width: 768px) {
    ${({ theme }) => theme.font.xl.bold}; /* 작은 화면에서는 폰트 축소 */
  }

  @media (max-width: 480px) {
    ${({ theme }) => theme.font.md.bold};
  }
`;

const BigTitle = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  font-size: 50px;
  margin: 10px 0 25px 0;
  text-align: center;
  color: ${({ theme }) => theme.color.gray800};

  @media (max-width: 1024px) {
    font-size: 40px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
    margin: 8px 0 0px 0;
  }

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const TopContainer = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  flex: 1;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 75vh;
  overflow: hidden;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const MapContainer = styled.div`
  flex: 2;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const MapBox = styled.div`
  width: 100%;
  height: 70vh;
  border-radius: 16px;

  @media (max-width: 900px) {
    height: 60vh;
  }
`;

const CourseSaveBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // label과 input 간 간격
  width: 100%;
  max-width: 400px;
  margin: 1rem auto;
`;

const Label = styled.label`
  ${({ theme }) => theme.font.md.semibold};
  color: ${({ theme }) => theme.color.gray800};
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary500};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
  }

  &::placeholder {
    color: #ccc;
  }
`;

const SaveButton = styled.button`
  ${({ theme }) => theme.font.xl.semibold};
  padding: 0.8rem 1rem;
  background: ${({ theme }) => theme.color.primary500};
  color: white;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: ${({ theme }) => theme.color.primary600};
    transform: translateY(-1px);
  }
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 8px;
`;
const SelectRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const Select = styled.select`
  width: 100px;
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  font-size: 14px;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.primary500};
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: ${({ theme }) => theme.color.primary600};
    transform: translateY(-1px);
  }
`;

const Places = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 커스텀 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.gray300};
    border-radius: 4px;
  }
`;

const BottomContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const BottomColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SelectedList = styled.div`
  h3 {
    margin-bottom: 8px;
    ${({ theme }) => theme.font.xl.bold};
    color: ${({ theme }) => theme.color.gray900};
  }
`;

const SelectedItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 5px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.gray50};
  transition: 0.2s;

  &:hover {
    background: ${({ theme }) => theme.color.gray100};
  }
`;

const RemoveBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
`;

const DistanceInfo = styled.div`
  h3 {
    margin-bottom: 8px;
    ${({ theme }) => theme.font.xl.bold};
    color: ${({ theme }) => theme.color.gray900};
  }

  div {
    ${({ theme }) => theme.font.md.semibold};
    color: ${({ theme }) => theme.color.gray700};
  }
`;

const TotalDistance = styled.div`
  margin-top: 10px;
  ${({ theme }) => theme.font.md.semibold};
  color: ${({ theme }) => theme.color.primary600};
`;
