import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/layout/Logo.svg";

interface TravelCardProps {
  addr1: string;
  contentid: string;
  contenttypeid: string;
  dist: string;
  firstimage?: string;
  title: string;
  title2?: string;
  addr2?: string;
  latitude?: number;
  longitude?: number;
  onClick?: () => void;
  selected?: boolean;
}
const TravelCard: React.FC<TravelCardProps> = ({
  addr1,
  contentid,
  contenttypeid,
  dist,
  firstimage,
  title,
  title2,
  addr2,
  latitude,
  longitude,
  onClick,
  selected,
}) => {
  const navigate = useNavigate();
  return (
    <CardWrapper
      selected={selected}
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
      }}
    >
      <CardImageBox>
        {firstimage ? (
          <Img style={{ backgroundImage: `url(${firstimage})` }} />
        ) : (
          <FallbackIcon>
            <Logo />
          </FallbackIcon>
        )}
      </CardImageBox>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardSubTitle>{addr1}</CardSubTitle>
      </CardContent>
    </CardWrapper>
  );
};

export default TravelCard;

const CardWrapper = styled.div<{ selected?: boolean }>`
  display: flex;
  margin: 5px 10px;
  align-items: center;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 100%;
  cursor: pointer;
  min-height: 100px;
  border: 3px solid
    ${({ selected, theme }) =>
      selected ? theme.color.primary500 : "transparent"};
  transition: transform 0.2s, border 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const CardImageBox = styled.div`
  flex: 0 0 130px;
  aspect-ratio: 1 / 1;
  background: ${({ theme }) => theme.color.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 780px) {
    flex: 0 0 100px;
  }
`;

const Img = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
`;

const FallbackIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.gray400};
  svg {
    width: 48px;
    height: 48px;
    opacity: 0.8;
  }
`;
const CardContent = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.color.white};
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100px;
`;

const CardTitle = styled.div`
  ${({ theme }) => theme.font.xxl.bold};
  color: ${({ theme }) => theme.color.gray800};

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.xl.bold};
  }
`;

const CardSubTitle = styled.div`
  ${({ theme }) => theme.font.md.medium};
  color: ${({ theme }) => theme.color.gray500};
  @media (max-width: 780px) {
    ${({ theme }) => theme.font.sm.medium};
  }
`;

const CardDist = styled.div`
  ${({ theme }) => theme.font.md.medium};
  color: ${({ theme }) => theme.color.primary500};
  margin-top: 5px;

  @media (max-width: 780px) {
    ${({ theme }) => theme.font.sm.medium};
  }
`;
