// tourAPI 대표 이미지 불러오기 함수
export const fetchTourImages = async (
  contentId: number,
  serviceKey: string
): Promise<string[]> => {
  try {
    const res = await fetch(
      `https://apis.data.go.kr/B551011/KorService2/detailImage2?serviceKey=${serviceKey}&MobileApp=AppTest&MobileOS=ETC&pageNo=1&numOfRows=30&contentId=${contentId}&imageYN=Y&_type=json`
    );
    const data = await res.json();
    const items = data.response.body.items.item ?? [];
    const urls = items.map((img: any) => img.originimgurl);
    return urls;
  } catch (error) {
    console.error("tourAPI 이미지 불러오기 실패:", error);
    return [];
  }
};

// tourAPI 인근 관광지 불러오기 함수
export const fetchNearbyPlaces = async (
  contentTypeId: number,
  longitude: number,
  latitude: number,
  serviceKey: string
) => {
  try {
    const res = await fetch(
      `https://apis.data.go.kr/B551011/KorService2/locationBasedList2?serviceKey=${serviceKey}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&mapX=${longitude}&mapY=${latitude}&arrange=C&radius=20000&contentTypeId=${contentTypeId}`
    );
    const data = await res.json();
    const items = data?.response?.body?.items?.item ?? [];

    const mappedPlaces = items.map((item: any) => ({
      title: item.title || "제목 없음",
      addr1: item.addr1 || "주소 없음",
      firstimage: item.firstimage || "",
      dist: item.dist || "",
    }));
    return mappedPlaces;
  } catch (error) {
    console.error("tourAPI 인근 관광지 불러오기 실패:", error);
    return [];
  }
};
