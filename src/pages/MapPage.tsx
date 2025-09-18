import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  getPlacesOnMap,
  PlaceMapItem,
  ContentTypeApi,
  CountryRegionApi,
} from "../api/map";
import { ReactComponent as AirplaneSvg } from "../assets/main/Airplane.svg";
import { ReactComponent as BookmarkBlueSvg } from "../assets/map/bookmark_blue.svg";
import { ReactComponent as BookmarkGraySvg } from "../assets/map/bookmark_gray.svg";
import flagNA from "../assets/map/north_america.svg";
import flagEU from "../assets/map/europe.svg";
import flagAS from "../assets/map/china.svg";
import flagAF from "../assets/map/africa.svg";
import flagSA from "../assets/map/south_america.svg";
import flagOC from "../assets/map/oceania.svg";
import flagTR from "../assets/map/turkey.svg";
import flagCN from "../assets/map/china.svg";
import flagMN from "../assets/map/mongolia.svg";
import flagARAB from "../assets/map/arab.svg";
import flagIN from "../assets/map/india.svg";
import flagSEA from "../assets/map/southeast_asia.svg";
import flagJP from "../assets/map/japan.svg";
import { fetchTourImages } from "../api/TourApi";
import { postBookmark, deleteBookmark } from "../api/Bookmark";

const TOURAPI_KEY = process.env.REACT_APP_TOUR_SERVICE_KEY;

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

/* ============ UI용 타입/데이터 ============ */
type CategoryUI = "식당" | "숙소" | "관광지";
type RegionUI =
  | "일본"
  | "중화/중국"
  | "몽골"
  | "터키"
  | "아랍"
  | "인도"
  | "동남아시아"
  | "북아메리카"
  | "남아메리카"
  | "유럽"
  | "아프리카"
  | "오세아니아";

const CATEGORIES: CategoryUI[] = ["식당", "숙소", "관광지"];
const REGIONS: RegionUI[] = [
  "일본",
  "중화/중국",
  "몽골",
  "터키",
  "아랍",
  "인도",
  "동남아시아",
  "북아메리카",
  "남아메리카",
  "유럽",
  "아프리카",
  "오세아니아",
];

/** UI → API 매핑 */
const CATEGORY_TO_CONTENT_TYPES: Record<CategoryUI, ContentTypeApi[]> = {
  식당: ["RESTAURANT"],
  숙소: ["ACCOMMODATION"],
  관광지: [
    "TOURIST_SPOT",
    "CULTURAL_FACILITY",
    "EVENT",
    "TRAVEL_COURSE",
    "LEISURE_SPORTS",
    "SHOPPING",
  ],
};

const REGION_TO_COUNTRIES: Record<RegionUI, CountryRegionApi[]> = {
  일본: ["JAPAN"],
  "중화/중국": ["CHINA"],
  몽골: ["MONGOLIA"],
  터키: ["TURKEY"],
  아랍: ["ARAB"],
  인도: ["INDIA"],
  동남아시아: ["SOUTHEAST_ASIA"],
  북아메리카: ["NORTH_AMERICA"],
  남아메리카: ["SOUTH_AMERICA"],
  유럽: ["EUROPE"],
  아프리카: ["AFRICA"],
  오세아니아: ["OCEANIA"],
};

/* ============ 공용 유틸 ============ */
const toStrArray = (v: unknown): string[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean) as string[];
  if (typeof v === "string") {
    return v
      .split(/[,\u002F\u2215]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

/** 한국어 지역/국가명 -> 국기 SVG URL 매핑 (첫 번째 국가/지역을 사용) */
const FLAG_SVG_BY_KR: Record<string, string> = {
  // 대륙/권역
  북아메리카: flagNA,
  남아메리카: flagSA,
  유럽: flagEU,
  아프리카: flagAF,
  오세아니아: flagOC,
  아시아: flagAS,
  // 세부 국가/권역
  터키: flagTR,
  중국: flagCN,
  몽골: flagMN,
  아랍: flagARAB,
  인도: flagIN,
  동남아시아: flagSEA,
  동남아: flagSEA,
  일본: flagJP,
};

function flagUrlFromPlace(p: PlaceMapItem): {
  url: string | null;
  label: string | null;
} {
  const names = toStrArray((p as any).countryRegionKoreanNames);
  const first = names[0] ?? null;
  const url = first ? FLAG_SVG_BY_KR[first] ?? null : null;
  return { url, label: first };
}

/* ============ 다중 선택 드롭다운(버튼으로만 열고/닫음) ============ */
const MultiDropdown: React.FC<{
  label: string;
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
}> = ({ label, items, selected, onToggle }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownWrap>
      <DropdownBtn
        $active={selected.length > 0}
        $open={open}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        type="button"
      >
        <span className="label">{label}</span>
        <Caret $open={open} />
      </DropdownBtn>

      <Menu role="listbox" $open={open}>
        {items.map((it) => {
          const isSelected = selected.includes(it);
          return (
            <MenuItem
              key={it}
              $selected={isSelected}
              onClick={() => onToggle(it)} // 멀티선택: 클릭해도 닫히지 않음
              aria-selected={isSelected}
            >
              {it}
            </MenuItem>
          );
        })}
      </Menu>
    </DropdownWrap>
  );
};

const MediaStrip: React.FC<{ place: PlaceMapItem }> = ({ place }) => {
  const [urls, setUrls] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  const contentId: number | null = (place as any).contentId;
  const vpRef = React.useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = React.useState(false);

  const updateAtEnd = React.useCallback(() => {
    const el = vpRef.current;
    if (!el) return;
    const done = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setAtEnd(done);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setUrls([]);

    if (!contentId || !TOURAPI_KEY) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const list = await fetchTourImages(contentId, TOURAPI_KEY); // ← 그대로 호출
        if (!cancelled) setUrls(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setUrls([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [contentId]);

  React.useEffect(() => {
    // 이미지가 로드되면 끝 여부 갱신
    updateAtEnd();
  }, [urls.length, updateAtEnd]);

  const scrollNext = () => {
    const el = vpRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  const hasMore = urls.length > 3;

  return (
    <CarouselWrap>
      <CarouselViewport ref={vpRef} onScroll={updateAtEnd}>
        {(urls.length ? urls : Array.from({ length: 3 }).map(() => ""))?.map(
          (u, i) => (
            <CarouselItem
              key={i}
              style={
                u
                  ? {
                      backgroundImage: `url(${u})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
              aria-label={u ? `image ${i + 1}` : "placeholder"}
            />
          )
        )}
      </CarouselViewport>

      {hasMore && !atEnd && (
        <MoreBtn
          type="button"
          aria-label="나머지 이미지 더 보기"
          onClick={scrollNext}
          title={`이미지 더 보기`}
        >
          ›
        </MoreBtn>
      )}
    </CarouselWrap>
  );
};

/* ============ 공용 타입 ============ */
type BoundsState = {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
};

/* ============ KakaoMap ============ */
const KakaoMap: React.FC<{
  results: PlaceMapItem[];
  onIdleChange: (payload: { center: Coord; bounds: BoundsState }) => void;
  showList: boolean;
  onUserPosition?: (pos: Coord) => void;
  recenterTo?: Coord | null;
  onPinClick?: (id: number) => void;
}> = ({
  results,
  onIdleChange,
  showList,
  onUserPosition,
  recenterTo,
  onPinClick,
}) => {
  const loaded = useKakaoLoader(KAKAO_JS_KEY);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<any>(null);
  const overlaysRef = React.useRef<any[]>([]);
  const userMarkerRef = React.useRef<any>(null);

  // 지도 생성 + idle 이벤트
  React.useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return;
    const { kakao } = window;
    const fallback = new kakao.maps.LatLng(37.5666805, 126.9784147);
    const map = (mapRef.current = new kakao.maps.Map(containerRef.current, {
      center: fallback,
      level: 6,
    }));

    kakao.maps.event.addListener(map, "idle", () => {
      const c = map.getCenter();
      const b = map.getBounds();
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();
      onIdleChange({
        center: { lat: c.getLat(), lng: c.getLng() },
        bounds: {
          sw: { lat: sw.getLat(), lng: sw.getLng() },
          ne: { lat: ne.getLat(), lng: ne.getLng() },
        },
      });
    });
  }, [loaded, onIdleChange]);

  // 외부 리센터 지시 → 부드럽게 이동
  React.useEffect(() => {
    if (!loaded || !mapRef.current || !recenterTo) return;
    const { kakao } = window;
    mapRef.current.panTo(new kakao.maps.LatLng(recenterTo.lat, recenterTo.lng));
  }, [loaded, recenterTo]);

  // 현재 위치 마커 1회 표시
  React.useEffect(() => {
    if (!loaded || !mapRef.current) return;
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const { kakao } = window;
        const map = mapRef.current;
        const coord = new kakao.maps.LatLng(latitude, longitude);

        if (userMarkerRef.current) userMarkerRef.current.setMap(null);
        userMarkerRef.current = new kakao.maps.Marker({
          position: coord,
          zIndex: 5,
        });
        userMarkerRef.current.setMap(map);

        map.setCenter(coord);
        onUserPosition?.({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.warn("geolocation error:", err?.message);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, [loaded, onUserPosition]);

  // 결과 → 커스텀 오버레이 (국기 SVG 사용)
  React.useEffect(() => {
    if (!loaded || !mapRef.current) return;

    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];
    if (results.length === 0) return;

    const { kakao } = window;
    const map = mapRef.current;

    results.forEach((p) => {
      const pos = new kakao.maps.LatLng(p.latitude, p.longitude);

      const { url: flagUrl, label: flagLabel } = flagUrlFromPlace(p);

      // 컨테이너
      const el = document.createElement("div");
      el.style.display = "flex";
      el.style.flexDirection = "column";
      el.style.alignItems = "center";
      el.style.transform = "translate(-50%, -100%)";
      el.style.cursor = "pointer";

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (typeof (p as any).id !== "undefined") {
          onPinClick?.((p as any).id as number);
        }
      });

      // 핀(둥근 배경) + 국기 이미지
      const pin = document.createElement("div");
      pin.style.width = "40px";
      pin.style.height = "40px";
      pin.style.display = "grid";
      pin.style.placeItems = "center";
      pin.style.borderRadius = "999px";
      pin.style.background = "#0ea5e9"; // 배경 컬러
      pin.style.boxShadow = "0 0 0 6px #ffffffb3, 0 8px 18px rgba(0,0,0,.15)";

      if (flagUrl) {
        const img = document.createElement("img");
        img.src = flagUrl;
        img.alt = flagLabel || "flag";
        img.style.width = "24px";
        img.style.height = "24px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "4px"; // 살짝 둥글게
        img.draggable = false;
        pin.appendChild(img);
      } else {
        // 폴백 텍스트
        const span = document.createElement("span");
        span.textContent = "📍";
        span.style.fontSize = "18px";
        span.style.color = "#fff";
        pin.appendChild(span);
      }
      el.appendChild(pin);

      // 라벨
      const label = document.createElement("div");
      label.textContent = p.title || "";
      label.style.maxWidth = "160px";
      label.style.overflow = "hidden";
      label.style.textOverflow = "ellipsis";
      label.style.whiteSpace = "nowrap";
      label.style.marginTop = "4px";
      label.style.fontSize = "12px";
      label.style.fontWeight = "700";
      label.style.color = "#334155";
      label.style.textShadow = "0 1px 0 #fff";
      el.appendChild(label);

      const overlay = new kakao.maps.CustomOverlay({
        position: pos,
        content: el,
        yAnchor: 1,
        zIndex: 6,
      });
      overlay.setMap(map);
      overlaysRef.current.push(overlay);
    });
  }, [results, loaded, showList]);

  return <MapLayer ref={containerRef} />;
};

/* ============ 거리 계산 유틸 (미터) ============ */
type Coord = { lat: number; lng: number };
function distanceMeters(a: Coord, b: Coord) {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDlat = Math.sin(dLat / 2);
  const sinDlng = Math.sin(dLng / 2);
  const h =
    sinDlat * sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlng * sinDlng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function tagsFromPlace(p: PlaceMapItem): string[] {
  const t1 = (p as any).contentTypeKoreanName
    ? [(p as any).contentTypeKoreanName]
    : [];
  const t2 = toStrArray((p as any).countryRegionKoreanNames);
  return [...t1, ...t2];
}

/* ============ 페이지 ============ */
const MapPage: React.FC = () => {
  // 다중 선택 상태
  const [catSel, setCatSel] = React.useState<CategoryUI[]>([]);
  const [regSel, setRegSel] = React.useState<RegionUI[]>([]);
  // 지도 상태
  const [center, setCenter] = React.useState<Coord | null>(null);
  const [bounds, setBounds] = React.useState<BoundsState | null>(null);
  // 내 GPS 위치
  const [userPos, setUserPos] = React.useState<Coord | null>(null);
  // 외부 리센터 지시
  const [recenterTo, setRecenterTo] = React.useState<Coord | null>(null);
  // API 결과
  const [results, setResults] = React.useState<PlaceMapItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // 변경 감지(버튼 노출 트리거)
  const [dirty, setDirty] = React.useState(false);
  // 현재 강조할 카드 id
  const [activeId, setActiveId] = React.useState<number | null>(null);
  // 리스트 아이템 DOM 참조 저장소
  const itemRefs = React.useRef<Record<number, HTMLDivElement | null>>({});
  // 북마크 처리중인 카드들(중복 클릭 방지)
  const [bmPending, setBmPending] = React.useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const goDetail = (p: PlaceMapItem) => {
    const anyP = p as any;

    navigate("/main/place", {
      state: {
        id: anyP.id as number,
        contentId: anyP.contentId,
        title: p.title,
        firstImage: anyP.firstImage,
        reviewScoreAverage: p.reviewScoreAverage,
        reviewCount: p.reviewCount,
        addr1: p.addr1,
        season: anyP.season,
        hashtags: anyP.hashtags,
        isBookmarked: !!p.isBookmarked,
        contentTypeName:
          anyP.contentTypeName ?? anyP.contentTypeKoreanName ?? undefined,
        contentTypeId: anyP.contentTypeId,
        longitude: p.longitude,
        latitude: p.latitude,
        distance: anyP.distance,
      },
    });
  };
  const toggleBookmark = async (placeId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동해 주세요.");
      navigate("/login");
      return;
    }

    // 현재 상태 확인
    const current = results.find(
      (r) => (r as any).id === placeId
    )?.isBookmarked;
    if (typeof current !== "boolean") return;

    // 중복 클릭 방지
    setBmPending((s) => {
      const n = new Set(s);
      n.add(placeId);
      return n;
    });

    // 낙관적 UI 업데이트
    setResults((rs) =>
      rs.map((p) =>
        (p as any).id === placeId ? { ...p, isBookmarked: !current } : p
      )
    );

    try {
      if (current) {
        // 이미 북마크였다면 해제
        await deleteBookmark(placeId);
      } else {
        // 아니었다면 추가
        await postBookmark(placeId);
      }
    } catch (e) {
      // 실패 시 롤백
      setResults((rs) =>
        rs.map((p) =>
          (p as any).id === placeId ? { ...p, isBookmarked: current } : p
        )
      );
      console.error("북마크 토글 실패:", e);
    } finally {
      setBmPending((s) => {
        const n = new Set(s);
        n.delete(placeId);
        return n;
      });
    }
  };

  // 각 아이템에 ref 바인딩하는 헬퍼
  const bindItemRef = React.useCallback(
    (id: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[id] = el;
    },
    []
  );

  // 핀 클릭 시: 강조 + 스크롤
  const handlePinClick = React.useCallback((id: number) => {
    setActiveId(id);
    // DOM 업데이트 이후 스크롤을 보장하기 위해 microtask 지연
    setTimeout(() => {
      const node = itemRefs.current[id];
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  }, []);

  React.useEffect(() => {
    if (activeId == null) return;
    const exists = results.some((r) => (r as any).id === activeId);
    if (!exists) setActiveId(null);
  }, [results, activeId]);

  const toggleCat = (v: string) =>
    setCatSel((prev) => {
      const next = prev.includes(v as CategoryUI)
        ? prev.filter((x) => x !== v)
        : [...prev, v as CategoryUI];
      setDirty(true);
      return next;
    });

  const toggleReg = (v: string) =>
    setRegSel((prev) => {
      const next = prev.includes(v as RegionUI)
        ? prev.filter((x) => x !== v)
        : [...prev, v as RegionUI];
      setDirty(true);
      return next;
    });

  // 지도 idle 콜백
  const handleIdleChange = React.useCallback(
    ({ center, bounds }: { center: Coord; bounds: BoundsState }) => {
      setCenter(center);
      setBounds(bounds);
      if (recenterTo) setRecenterTo(null);
      setDirty(true);
    },
    [recenterTo]
  );

  // 검색 실행
  const canSearch =
    !!bounds && !!center && catSel.length > 0 && regSel.length > 0;

  const runSearch = async () => {
    if (!canSearch) return;
    const contentTypes = Array.from(
      new Set(catSel.flatMap((c) => CATEGORY_TO_CONTENT_TYPES[c]))
    );
    const countryRegions = Array.from(
      new Set(regSel.flatMap((r) => REGION_TO_COUNTRIES[r]))
    );

    try {
      setLoading(true);
      setError(null);
      const res = await getPlacesOnMap({
        contentTypes,
        countryRegions,
        swLat: bounds!.sw.lat,
        swLng: bounds!.sw.lng,
        neLat: bounds!.ne.lat,
        neLng: bounds!.ne.lng,
        userLat: center!.lat,
        userLng: center!.lng,
      });
      if (res?.isSuccess) {
        setResults(res.data ?? []);
      } else {
        setResults([]);
        setError(res?.message ?? "요청 실패");
      }
    } catch (e: any) {
      setResults([]);
      setError(e?.message ?? "네트워크 오류");
    } finally {
      setLoading(false);
      setDirty(false);
    }
  };

  const showList = results.length > 0;

  const movedFarFromUser =
    !!userPos && !!center && distanceMeters(center, userPos) > 120;

  const handleClickRecenter = () => {
    if (!userPos) return;
    setRecenterTo({ lat: userPos.lat, lng: userPos.lng });
  };

  return (
    <Page>
      <Stage>
        {/* 힌트/에러/빈 결과 */}
        {!catSel.length || !regSel.length ? (
          <LeftPanel>
            <Hint>
              드롭다운에서 조건을 선택해
              <br />
              관광지를 찾아보세요!
            </Hint>
          </LeftPanel>
        ) : null}
        {error && <Hint>⚠️ {error}</Hint>}
        {catSel.length &&
        regSel.length &&
        center &&
        !loading &&
        results.length === 0 &&
        !dirty ? (
          <LeftPanel>
            <Hint>이 지도 범위 내 결과가 없습니다.</Hint>
          </LeftPanel>
        ) : null}

        {/* 좌측 목록 */}
        {showList && (
          <LeftPanel>
            <ChipRow>
              {catSel.map((c) => (
                <Chip key={c} onClick={() => toggleCat(c)}>
                  {c} ✕
                </Chip>
              ))}
              {regSel.map((r) => (
                <Chip key={r} onClick={() => toggleReg(r)}>
                  {r} ✕
                </Chip>
              ))}
              {loading && <Badge>검색중…</Badge>}
            </ChipRow>

            <CardList>
              {results.map((p) => {
                const score = p.reviewScoreAverage?.toFixed?.(1) ?? "0.0";
                const tags = tagsFromPlace(p);
                const pid = (p as any).id as number;
                return (
                  <ListCard
                    key={pid}
                    ref={bindItemRef(pid)}
                    $active={activeId === pid}
                    aria-current={activeId === pid ? "true" : undefined}
                    onClick={() => goDetail(p)}
                  >
                    <CardTop>
                      <Title>{p.title || "title"}</Title>

                      <BookmarkBtn
                        type="button"
                        aria-pressed={p.isBookmarked}
                        aria-label={
                          p.isBookmarked ? "북마크 해제" : "북마크 추가"
                        }
                        title={p.isBookmarked ? "북마크 해제" : "북마크 추가"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark?.(pid);
                        }}
                      >
                        {p.isBookmarked ? (
                          <BookmarkBlueSvg />
                        ) : (
                          <BookmarkGraySvg />
                        )}
                      </BookmarkBtn>

                      <MetaRow>
                        <MetaPrimary>
                          <StarIcon /> {score}
                        </MetaPrimary>
                        <MetaMuted>reviews {p.reviewCount}</MetaMuted>
                        <MetaMuted>{p.addr1}</MetaMuted>
                      </MetaRow>

                      <TagRow>
                        {tags.map((t) => (
                          <TagChip key={t}>{t}</TagChip>
                        ))}
                      </TagRow>
                    </CardTop>

                    <MediaStrip place={p} />

                    <Divider />
                  </ListCard>
                );
              })}
            </CardList>
          </LeftPanel>
        )}

        {/* 상단 툴바 */}
        <Toolbar>
          <MultiDropdown
            label="카테고리"
            items={CATEGORIES}
            selected={catSel}
            onToggle={toggleCat}
          />
          <MultiDropdown
            label="국가"
            items={REGIONS}
            selected={regSel}
            onToggle={toggleReg}
          />
        </Toolbar>

        {/* 다시 검색 */}
        {dirty && canSearch && (
          <SearchBtn
            onClick={runSearch}
            disabled={loading}
            aria-label="현재 지도에서 다시 검색"
          >
            {loading ? "검색중…" : "🔎 다시 검색"}
          </SearchBtn>
        )}

        {/* 현재 화면 좌표 */}
        {showList && center && (
          <CoordToast>
            <b>현재 화면 좌표</b>
            <div>위도 {center.lat.toFixed(5)}</div>
            <div>경도 {center.lng.toFixed(5)}</div>
          </CoordToast>
        )}

        {/* 카카오맵 */}
        <KakaoMap
          results={results}
          onIdleChange={handleIdleChange}
          showList={showList}
          onUserPosition={setUserPos}
          recenterTo={recenterTo}
          onPinClick={handlePinClick}
        />

        {/* 현재 위치로 돌아가기 */}
        {movedFarFromUser && (
          <RecenterBtn
            onClick={handleClickRecenter}
            aria-label="현재 위치로 이동"
          >
            📍 현재 위치로
          </RecenterBtn>
        )}
      </Stage>
    </Page>
  );
};

export default MapPage;
/* ============ 스타일 ============ */
const Page = styled.div`
  min-height: 100vh;
`;

/* 스테이지/지도 */
const Stage = styled.div`
  position: relative;
  margin: 0 auto;
  height: 720px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  background: radial-gradient(
    ellipse at top,
    ${({ theme }) => theme.color.primary50},
    ${({ theme }) => theme.color.gray100} 40%,
    ${({ theme }) => theme.color.gray100}
  );
`;
const MapLayer = styled.div`
  position: absolute;
  inset: 0;
`;

/* 툴바 */
const Toolbar = styled.div`
  position: absolute;
  top: 14px;
  left: 30%;
  transform: translateX(-50%);
  display: flex;
  gap: 36px;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 30;
`;

/* 드롭다운 */
const DropdownWrap = styled.div`
  position: relative;
`;
const DropdownBtn = styled.button<{ $active?: boolean; $open?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 14px;
  background: ${({ theme }) => theme.color.white};
  border: 1.5px solid
    ${({ theme, $active }) =>
      $active ? theme.color.primary300 : theme.color.gray200};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  font-weight: 800;
  color: ${({ theme, $active }) =>
    $active ? theme.color.primary700 : theme.color.gray800};
  .label {
    font-weight: 800;
  }
`;
const Caret = styled.span<{ $open?: boolean }>`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid ${({ theme }) => theme.color.gray800};
  transform: rotate(${(p) => (p.$open ? "180deg" : "0deg")});
  transition: transform 120ms ease;
`;
const Menu = styled.ul<{ $open?: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 110px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  border-radius: 14px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
  padding: 6px;
  margin: 0;
  list-style: none;
  z-index: 40;

  opacity: ${(p) => (p.$open ? 1 : 0)};
  transform: translateY(${(p) => (p.$open ? "0" : "-4px")});
  pointer-events: ${(p) => (p.$open ? "auto" : "none")};
  transition: opacity 120ms ease, transform 120ms ease;
`;
const MenuItem = styled.li<{ $selected?: boolean }>`
  list-style: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  color: ${({ theme, $selected }) =>
    $selected ? theme.color.primary700 : theme.color.gray800};
  background: ${({ theme, $selected }) =>
    $selected ? theme.color.primary50 : "transparent"};
  &:hover {
    background: ${({ theme }) => theme.color.gray100};
  }
`;

/* 힌트/빈 결과 토스트 */
const Hint = styled.div`
  position: absolute;
  left: 24px;
  top: 24px;
  z-index: 20;
  width: 280px;
  padding: 16px;
  border-radius: 20px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-weight: 800;
  color: ${({ theme }) => theme.color.gray900};
`;

/* 좌측 목록 */
const LeftPanel = styled.aside`
  position: absolute;
  left: 24px;
  z-index: 20;
  width: 320px;
  background: ${({ theme }) => theme.color.white};
  border-radius: 24px;
`;
const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 15px;
`;
const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.primary400};
  border: 1px solid ${({ theme }) => theme.color.primary200};
  cursor: pointer;
`;
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.color.gray100};
  color: ${({ theme }) => theme.color.gray600};
  font-weight: 700;
  font-size: 12px;
`;

/* 목록 컨테이너 */
const CardList = styled.div`
  height: 560px;
  overflow: auto;
  padding: 15px;
  display: block;
`;

/* 각 아이템 */
const ListCard = styled.div<{ $active?: boolean }>`
  position: relative;
  padding: 10px 10px 16px;
  border-radius: 14px;
  cursor: pointer;

  /* 활성 카드 하이라이트 */
  background: ${({ theme, $active }) =>
    $active ? theme.color.primary50 : "transparent"};
  box-shadow: ${({ $active }) =>
    $active ? "0 4px 16px rgba(0,0,0,0.08)" : "none"};
  transition: background 120ms ease, outline-color 120ms ease,
    box-shadow 120ms ease;
`;
const CardTop = styled.div`
  position: relative;
  border-radius: 14px;
  padding: 14px 16px 12px;
`;
const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 800;
  color: ${({ theme }) => theme.color.gray900};
`;
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  margin-bottom: 10px;
`;
const MetaPrimary = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.gray900};
  svg {
    width: 14px;
    height: 14px;
    transform: translateY(1px);
  }
`;
const MetaMuted = styled.span`
  color: ${({ theme }) => theme.color.gray400};
  font-size: 16px;
`;
const TagRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 10px;
  background: ${({ theme }) => theme.color.primary50};
  color: ${({ theme }) => theme.color.primary600};
  font-weight: 700;
  font-size: 12px;
`;

const BookmarkBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 12px;
  line-height: 0;
  background: transparent;
  border: 0;
  padding: 4px;
  border-radius: 10px;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
    display: block;
  }

  &:hover {
    background: ${({ theme }) => theme.color.gray100};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MoreBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.gray600};
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  cursor: pointer;
`;
const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: ${({ theme }) => theme.color.gray200};
  margin: 16px 0 0;
`;

/* 좌표 토스트 */
const CoordToast = styled.div`
  position: absolute;
  right: 24px;
  top: 90px;
  z-index: 31;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
  font-size: 12px;
  color: ${({ theme }) => theme.color.gray700};
  line-height: 1.35;
  b {
    display: block;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.color.gray900};
  }
`;

/* 현재 위치로 돌아가기 버튼 */
const RecenterBtn = styled.button`
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 35;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 14px;
  background: ${({ theme }) => theme.color.primary500};
  color: ${({ theme }) => theme.color.white};
  border: none;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
  font-weight: 800;
  cursor: pointer;
  &:hover {
    filter: brightness(0.95);
  }
`;

/* "다시 검색" 버튼 */
const SearchBtn = styled.button`
  position: absolute;
  top: 62px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 32;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.color.primary100};
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  font-weight: 800;
  color: ${({ theme }) => theme.color.primary800};
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StarIcon = styled(AirplaneSvg)`
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  color: ${({ theme }) => theme.color.primary500};
`;

const CarouselWrap = styled.div`
  position: relative;
  margin-top: 10px;
`;

const CarouselViewport = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselItem = styled.div`
  flex: 0 0 calc((100% - 16px) / 3); /* 3칸 보이도록 고정폭 */
  height: 96px;
  border-radius: 16px;
  background: ${({ theme }) => theme.color.gray200};
  scroll-snap-align: start;
`;
