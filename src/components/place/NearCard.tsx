import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface NearCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

const NearCard: React.FC<NearCardProps> = ({ title, subtitle, imageUrl }) => {
  const navigate = useNavigate();
  return (
    <CardWrapper onClick={() => navigate("near")}>
      <CardImageBox
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
      />
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardSubTitle>{subtitle}</CardSubTitle>
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
`;

const CardImageBox = styled.div`
  background: ${({ theme }) => theme.color.gray200};
  background-size: cover;
  background-position: center;
  height: 150px;
  border-radius: 24px 24px 0px 0px;
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
