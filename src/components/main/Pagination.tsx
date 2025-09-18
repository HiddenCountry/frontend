import React from "react";
import styled from "styled-components";

interface PaginationProps {
  page: number; // 현재 페이지 (0-based)
  totalPages: number; // 총 페이지 수
  onPageChange: (n: number) => void; // 0-based 페이지 변경
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const maxVisible = 5;

  // 보여줄 페이지 범위 계산 (UI용은 1-based)
  let start = Math.max(0, page - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;

  if (end > totalPages - 1) {
    end = totalPages - 1;
    start = Math.max(0, end - maxVisible + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <Wrapper>
      <PageArrow
        disabled={page <= 0}
        onClick={() => onPageChange(Math.max(0, page - 1))}
        aria-label="이전 페이지"
      >
        &lt;
      </PageArrow>

      {pages.map((n) => (
        <PageBtn key={n} $active={n === page} onClick={() => onPageChange(n)}>
          {n + 1 /* 사용자에게는 1-based로 표시 */}
        </PageBtn>
      ))}

      <PageArrow
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        aria-label="다음 페이지"
      >
        &gt;
      </PageArrow>
    </Wrapper>
  );
};

export default Pagination;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 50px 6px;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  ${({ theme }) => theme.font.md.medium};
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
