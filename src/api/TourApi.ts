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
    console.error("이미지 불러오기 실패:", error);
    return [];
  }
};
