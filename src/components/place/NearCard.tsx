import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/layout/Logo.svg";

interface NearCardProps {
  addr1: string;
  contentid: string;
  contenttypeid: string;
  dist: string;
  firstimage?: string;
  title: string;
}

const NearCard: React.FC<NearCardProps> = ({
  addr1,
  contentid,
  contenttypeid,
  dist,
  firstimage,
  title,
}) => {
  const navigate = useNavigate();
  return (
    <CardWrapper
      onClick={() =>
        navigate("near", {
          state: { addr1, contentid, contenttypeid, dist, firstimage, title },
        })
      }
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
        <CardDist>
          해당 관광지에서{" "}
          <strong>{Math.round(Number(dist)).toLocaleString()}m</strong>
        </CardDist>
      </CardContent>
    </CardWrapper>
  );
};

export default NearCard;

const CardWrapper = styled.div`
  min-width: 200px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  max-width: 100px;
`;

const CardImageBox = styled.div`
  background: ${({ theme }) => theme.color.gray200};
  height: 150px;
  border-radius: 24px 24px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
    margin-top: 10px;
    opacity: 0.8;
  }
`;

const CardContent = styled.div`
  background: ${({ theme }) => theme.color.white};
  border-radius: 0px 0px 24px 24px;
  padding: 10px 20px;
  text-align: left;
`;

const CardTitle = styled.div`
  ${({ theme }) => theme.font.xxl.bold};
  color: ${({ theme }) => theme.color.gray800};
`;

const CardSubTitle = styled.div`
  ${({ theme }) => theme.font.md.medium};
  color: ${({ theme }) => theme.color.gray500};
`;
const CardDist = styled.div`
  ${({ theme }) => theme.font.md.medium};
  color: ${({ theme }) => theme.color.primary500};
  margin-top: 5px;
`;
