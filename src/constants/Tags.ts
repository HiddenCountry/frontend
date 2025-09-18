export interface TagOption {
  key: string;
  label: string;
  type: "FOOD" | "MOOD" | "ETC";
}

export const TAGS: TagOption[] = [
  // 음식
  { key: "TASTE_GOOD", label: "음식이 맛있어요", type: "FOOD" },
  { key: "LARGE_PORTION", label: "양이 많아요", type: "FOOD" },
  { key: "LOCAL_STYLE", label: "현지 맛에 가까워요", type: "FOOD" },
  { key: "UNIQUE_MENU", label: "특별한 메뉴가 많아요", type: "FOOD" },
  { key: "WORTH_PRICE", label: "비싼 만큼 가치 있어요", type: "FOOD" },

  // 분위기
  { key: "CLEAN_FACILITY", label: "시설이 깔끔해요", type: "MOOD" },
  { key: "COZY", label: "아늑해요", type: "MOOD" },
  { key: "UNIQUE_CONCEPT", label: "컨셉이 독특해요", type: "MOOD" },
  { key: "GOOD_PHOTO", label: "사진이 잘 나와요", type: "MOOD" },
  { key: "FOREIGN_VIBE", label: "외국 느낌 낭낭", type: "MOOD" },
  { key: "NICE_VIEW", label: "뷰가 좋아요", type: "MOOD" },
  { key: "CALM", label: "차분한 분위기에요", type: "MOOD" },

  // 기타
  { key: "EASY_PARKING", label: "주차하기 편해요", type: "ETC" },
  { key: "KIND", label: "친절해요", type: "ETC" },
  { key: "CLEAN", label: "청결해요", type: "ETC" },
  { key: "CROWDED", label: "사람이 많아요", type: "ETC" },
  { key: "GOOD_TO_STAY", label: "오래 머무르기 좋아요", type: "ETC" },
  { key: "GOOD_FOR_DATE", label: "데이트하기 좋아요", type: "ETC" },
  { key: "GOOD_FOR_KIDS", label: "아이와 가기 좋아요", type: "ETC" },
  { key: "CLEAN_TOILET", label: "화장실이 깨끗해요", type: "ETC" },
];
