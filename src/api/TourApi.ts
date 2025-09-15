import axios from "axios";

const SERVICE_KEY =
  "c9hiuEIQHvK%2FVddDwn5RZKMwJ96BDrFFkG%2Ft0kV0%2FsmxGS%2BqaImJtp1YtlsLD0sF0L3DgME71frj8EQXt6lkqw%3D%3D";

export const fetchNearbyPlaces = async (
  mapX: number,
  mapY: number,
  radius: number = 20000
) => {
  try {
    const url = `http://apis.data.go.kr/B551011/KorService2/locationBasedList2`;
    const { data } = await axios.get(url, {
      params: {
        serviceKey: SERVICE_KEY,
        numOfRows: 20,
        pageNo: 1,
        MobileOS: "ETC",
        MobileApp: "AppTest",
        _type: "json",
        mapX,
        mapY,
        radius,
        arrange: "C", // 거리순
        contentTypeId: 39, // 음식점 (관광지: 12)
      },
    });

    // Optional chaining + 기본값
    const items = data?.response?.body?.items?.item ?? [];
    return items;
  } catch (error) {
    console.error("Failed to fetch nearby places:", error);
    return [];
  }
};
