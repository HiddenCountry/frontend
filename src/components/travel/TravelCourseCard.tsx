import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/layout/Logo.svg";

interface CardItemProps {
  courseId: number;
  firstImage?: string;
  title: string;
}

const TravelCourseCard: React.FC<CardItemProps> = ({
  courseId,
  firstImage,
  title,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() =>
        navigate("detail", {
          state: {
            courseId,
          },
        })
      }
    >
      <ImageBox>
        {firstImage ? (
          <Img style={{ backgroundImage: `url(${firstImage})` }} />
        ) : (
          <FallbackIcon>
            <Logo />
          </FallbackIcon>
        )}
      </ImageBox>

      <Content>
        <Title>{title}</Title>
      </Content>
    </Card>
  );
};

export default TravelCourseCard;

const Card = styled.div`
  width: 230px;
  background: ${({ theme }) => theme.color.white};
  border-radius: 24px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 500px) {
    width: 170px;
    border-radius: 16px;
  }
`;

const ImageBox = styled.div`
  background: ${({ theme }) => theme.color.gray200};
  height: 150px;
  border-radius: 24px 24px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 500px) {
    height: 110px;
    border-radius: 16px 16px 0 0;
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
    margin-top: 10px;
    opacity: 0.8;
  }

  @media (max-width: 500px) {
    svg {
      width: 36px;
      height: 36px;
    }
  }
`;

const Content = styled.div`
  background: ${({ theme }) => theme.color.white};
  font-size: 13px;
  padding: 12px 16px;
  border-radius: 0px 0px 24px 24px;
  text-align: left;

  @media (max-width: 500px) {
    font-size: 12px;
    padding: 10px 12px;
    border-radius: 0 0 16px 16px;
  }
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xl.bold};
  margin-bottom: 6px;

  @media (max-width: 500px) {
    ${({ theme }) => theme.font.md.bold};
  }
`;
