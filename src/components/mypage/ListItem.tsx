import React from "react";
import styled from "styled-components";
import { ReactComponent as AirplaneSvg } from "../../assets/main/Airplane.svg";

type SavedItemProps = {
  variant: "saved";
  name: string;
  rating: number;
  reviews: number;
  address: string;
  imageUrl?: string | null;
  onClick?: () => void;
};

type ReviewItemProps = {
  variant: "review";
  placeName: string;
  rating: number;
  message: string; // 예: “좋았어요!”
  snippet: string;
  imageUrl?: string | null; // ✅ 추가
  onClick?: () => void;
};

type Props = SavedItemProps | ReviewItemProps;

const ListItem: React.FC<Props> = (props) => {
  if (props.variant === "saved") {
    const { name, rating, reviews, address, imageUrl, onClick } = props;
    return (
      <Row role="button" onClick={onClick}>
        <Thumb $src={imageUrl} role="img" aria-label={name} />
        <Texts>
          <Title title={name}>{name}</Title>
          <Meta>
            <StarIcon />
            <span>{rating}</span>
            <Dot>리뷰</Dot>
            <span>{reviews}</span>
          </Meta>
          <Secondary title={address}>{address}</Secondary>
        </Texts>
        <ChevronRight aria-hidden />
      </Row>
    );
  }

  const { placeName, rating, message, snippet, imageUrl, onClick } = props;
  return (
    <Row role="button" onClick={onClick}>
      <Thumb $src={imageUrl} role="img" aria-label={placeName} />
      <Texts>
        <Title title={placeName}>{placeName}</Title>
        <Meta>
          <StarIcon />
          <span>{rating}</span>
          <Dot>·</Dot>
          <span>{message}</span>
        </Meta>
        <Secondary title={snippet}>{snippet}</Secondary>
      </Texts>
      <ChevronRight aria-hidden />
    </Row>
  );
};

export default ListItem;

/* ----- styles ----- */
export const Row = styled.li`
  display: grid;
  grid-template-columns: 80px 1fr 20px;
  align-items: start;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

const Thumb = styled.div<{ $src?: string | null }>`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: ${({ theme }) => theme.color.gray200};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  align-self: start;
  overflow: hidden;

  ${({ $src }) =>
    $src &&
    `
    background-image: url('${$src}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `}
`;

const Texts = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const Title = styled.div`
  ${({ theme }) => theme.font.md.semibold};
  color: ${({ theme }) => theme.color.gray900};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${({ theme }) => theme.font.xs.medium};
  color: ${({ theme }) => theme.color.gray600};
`;

const Dot = styled.span`
  margin: 0 2px;
  color: ${({ theme }) => theme.color.gray400};
`;

const Secondary = styled.div`
  ${({ theme }) => theme.font.xs.regular};
  color: ${({ theme }) => theme.color.gray500};
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const StarIcon = styled(AirplaneSvg)`
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  color: ${({ theme }) => theme.color.primary500};
`;

const ChevronRight = styled.i`
  width: 20px;
  height: 20px;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="%23000" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>')
    center / contain no-repeat;
  background: ${({ theme }) => theme.color.gray300};
  justify-self: end;
  align-self: center;
`;
