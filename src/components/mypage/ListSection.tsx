import React, { ReactNode } from "react";
import styled from "styled-components";

type ListSectionProps = {
  title: string;
  count?: number | ReactNode;
  children: ReactNode;               
  page?: number;                  
  totalPages?: number;
  onPageChange?: (n: number) => void;
};

const ListSection: React.FC<ListSectionProps> = ({
  title,
  count,
  children,
  page,
  totalPages = 5,
  onPageChange,
}) => {
  const showPagination = typeof page === "number" && !!onPageChange;

  return (
    <Card>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {typeof count !== "undefined" && <CountBadge>{count}</CountBadge>}
      </SectionHeader>

      {children}

      {showPagination && (
        <Pagination>
          <PageArrow
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            aria-label="이전 페이지"
          >
            &lt;
          </PageArrow>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <PageBtn key={n} $active={n === page} onClick={() => onPageChange(n)}>
              {n}
            </PageBtn>
          ))}

          <PageArrow
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            aria-label="다음 페이지"
          >
            &gt;
          </PageArrow>
        </Pagination>
      )}
    </Card>
  );
};

export default ListSection;

// 내보내는 리스트 래퍼(편의용)
export const CardList = styled.ul`
  margin-top: 12px;
`;

const Card = styled.section`
  background: ${({ theme }) => theme.color.white};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  padding: 20px 28px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const SectionTitle = styled.h2`
  ${({ theme }) => theme.font.md.bold};
  color: ${({ theme }) => theme.color.gray900};
`;

const CountBadge = styled.span`
  ${({ theme }) => theme.font.sm.semibold};
  color: ${({ theme }) => theme.color.primary600};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 18px 0 6px;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  ${({ theme }) => theme.font.xs.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.color.white : theme.color.gray700};
  background: ${({ theme, $active }) =>
    $active ? theme.color.primary500 : "transparent"};

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.color.primary500 : theme.color.gray100};
  }
`;

const PageArrow = styled(PageBtn)`
  width: 28px;
  background: transparent;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
