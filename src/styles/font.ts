import { css } from "styled-components";

const fontFamily = `"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

const createFontStyle = (fontSize: string, lineHeight: string) => ({
  regular: css`
    font-family: ${fontFamily};
    font-size: ${fontSize};
    line-height: ${lineHeight};
    font-weight: 400;
  `,
  medium: css`
    font-family: ${fontFamily};
    font-size: ${fontSize};
    line-height: ${lineHeight};
    font-weight: 500;
  `,
  semibold: css`
    font-family: ${fontFamily};
    font-size: ${fontSize};
    line-height: ${lineHeight};
    font-weight: 600;
  `,
  bold: css`
    font-family: ${fontFamily};
    font-size: ${fontSize};
    line-height: ${lineHeight};
    font-weight: 700;
  `,
});

const FONT = {
  xxxl: createFontStyle("28px", "150%"),
  xxl: createFontStyle("20px", "150%"),
  xl: createFontStyle("18px", "150%"),
  md: createFontStyle("16px", "150%"),
  sm: createFontStyle("14px", "150%"),
  xs: createFontStyle("12px", "150%"),
};

export default FONT;
