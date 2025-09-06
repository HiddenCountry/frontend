import React from "react";
import styled from "styled-components";
import CardItem from "./CardItem";

const CardGrid: React.FC = () => {
  return (
    <Wrapper>
      {Array.from({ length: 6 }).map((_, i) => (
        <CardItem key={i} />
      ))}
    </Wrapper>
  );
};

export default CardGrid;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
`;
