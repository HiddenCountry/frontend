import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { postInquiry } from "../api/Inquiry";

const TITLE_MAX = 20;
const BODY_MAX = 1000;

const PlaceRegistrationPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const titleCount = useMemo(() => `${title.length}/${TITLE_MAX}`, [title]);
  const bodyCount = useMemo(() => `${body.length}/${BODY_MAX}`, [body]);

  const isValid = title.trim().length > 0 && body.trim().length > 0;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동해 주세요.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setLoading(true);
      await postInquiry({ title: title.trim(), content: body.trim() });
      alert("제출되었습니다. 소중한 의견 감사합니다.");
      setTitle("");
      setBody("");
    } catch (err) {
      console.error(err);
      alert("제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Inner>
        <PageTitle>장소 등록 요청하기</PageTitle>
        <SubTitle>
          아직 등록되지 않은 이국적이고 특별한 장소가 있나요? 숨겨진 명소를
          공유해주세요!
        </SubTitle>
        <SubTitle>
          여러분의 제안으로 더 많은 사람들이 새로운 여행지를 만날 수 있습니다.
        </SubTitle>

        <Form onSubmit={onSubmit}>
          <Field>
            <LabelRow>
              <Label htmlFor="title">제목</Label>
              <Counter aria-live="polite">{titleCount}</Counter>
            </LabelRow>
            <Input
              id="title"
              maxLength={TITLE_MAX}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해 주세요"
            />
          </Field>

          <Field>
            <LabelRow>
              <Label htmlFor="body">본문</Label>
              <Counter aria-live="polite">{bodyCount}</Counter>
            </LabelRow>
            <Textarea
              id="body"
              maxLength={BODY_MAX}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="본문을 입력해 주세요"
            />
          </Field>

          <Submit type="submit" disabled={!isValid}>
            {loading ? "제출 중..." : "완료"}{" "}
          </Submit>
        </Form>
      </Inner>
    </Container>
  );
};

export default PlaceRegistrationPage;

const Container = styled.div`
  background: ${({ theme }) => theme.color.gray50};
  min-height: 100vh;
`;

const Inner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 60px 24px 80px;
`;

const PageTitle = styled.h1`
  ${({ theme }) => theme.font.xxxl.bold};
  color: ${({ theme }) => theme.color.gray900};
  letter-spacing: -0.02em;
  margin-bottom: 10px;
`;

const SubTitle = styled.h1`
  ${({ theme }) => theme.font.md.medium};
  color: ${({ theme }) => theme.color.gray600};
  margin: 2px 5px;
`;

const Form = styled.form`
  margin-top: 32px;
`;

const Field = styled.div`
  & + & {
    margin-top: 28px;
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const Label = styled.label`
  ${({ theme }) => theme.font.sm.semibold};
  color: ${({ theme }) => theme.color.gray600};
`;

const Counter = styled.span`
  ${({ theme }) => theme.font.xs.regular};
  color: ${({ theme }) => theme.color.gray400};
`;

const fieldBase = css`
  ${({ theme }) => theme.font.md.regular};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  border-radius: 16px;
  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.gray900};
  padding: 14px 16px;
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &::placeholder {
    ${({ theme }) => theme.font.md.regular};
    color: ${({ theme }) => theme.color.gray400};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.primary500};
    box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.12);
  }
`;

const Input = styled.input`
  ${fieldBase}
  margin-top: 8px;
  height: 48px;
`;

const Textarea = styled.textarea`
  ${fieldBase}
  margin-top: 8px;
  min-height: 340px;
  resize: vertical;
`;

const Submit = styled.button`
  ${({ theme }) => theme.font.xl.semibold};
  margin-top: 32px;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.primary500};
  cursor: pointer;
  transition: transform 0.2s ease, background 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.color.primary600};
  }

  &:disabled {
    background: ${({ theme }) => theme.color.gray300};
    color: ${({ theme }) => theme.color.white};
    cursor: not-allowed;
    transform: none;
    opacity: 0.7;
  }
`;
