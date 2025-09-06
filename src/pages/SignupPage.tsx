import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null); // null: 입력 전, true: 유효, false: 유효X
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    setNickname(value);
    if (value === "") {
      setIsValid(null); // 입력 전
      setError("");
      return;
    }
    const valid = /^[가-힣a-zA-Z0-9]{1,6}$/.test(value);
    setIsValid(valid);
    setError(valid ? "" : "특수문자 제외 최대 6자까지 가능해요");
  };

  const handleConfirm = () => {
    if (!isValid) {
      return;
    }
    navigate("/signup/complete");
  };

  return (
    <Container>
      <Card>
        <Title>회원가입</Title>
        <Label>사용하실 닉네임을 입력해 주세요</Label>
        <Input
          value={nickname}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="닉네임"
          $status={isValid}
        />
        <InfoText $status={isValid}>
          {isValid === false ? error : "특수문자 제외 최대 6자까지 가능해요"}
        </InfoText>

        <ButtonRow>
          <CancelButton onClick={() => navigate("/")}>취소</CancelButton>
          <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
        </ButtonRow>
      </Card>
    </Container>
  );
};

export default SignupPage;

const Container = styled.div`
  background: ${({ theme }) => theme.color.gray100};
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 480px;
  background: white;
  border-radius: 32px;
  padding: 50px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  margin-bottom: 30px;
  text-align: left;
  color: ${({ theme }) => theme.color.gray800};
`;

const Label = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  margin-bottom: 10px;
  text-align: left;
  color: ${({ theme }) => theme.color.gray800};
`;
const Input = styled.input<{ $status: boolean | null }>`
  width: 100%;
  height: 62px;
  padding: 12px;
  border: 1px solid
    ${({ $status, theme }) => {
      if ($status === null) return theme.color.gray200; // 입력 전: 회색
      if ($status) return theme.color.primary500 || "#3182f6"; // 유효: 파란색
      return "red"; // 유효하지 않음: 빨간색
    }};
  border-radius: 16px;
  font-size: 14px;
  margin-bottom: 8px;
  transition: border-color 0.2s ease; /* 색상 변경 부드럽게 */

  &:focus {
    outline: none;
    border-color: ${({ $status, theme }) =>
      $status === false ? "red" : theme.color.primary500};
  }
`;

const InfoText = styled.div<{ $status: boolean | null }>`
  font-size: 12px;
  margin-bottom: 20px;
  text-align: left;
  margin-bottom: 120px;

  color: ${({ $status, theme }) => {
    if ($status === null) return theme.color.gray500;
    if ($status) return theme.color.primary500;
    return theme.color.red500;
  }};
  transition: color 0.2s ease; /* 색상 변경 부드럽게 */
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  ${({ theme }) => theme.font.md.semibold};
  width: 178px;
  height: 56px;
  border: 1.6px solid ${({ theme }) => theme.color.primary500};

  background: white;
  color: ${({ theme }) => theme.color.primary500};
  padding: 10px 20px;
  border-radius: 16px;
  cursor: pointer;

  &:hover {
    background: #f0f8ff;
  }
`;

const ConfirmButton = styled.button`
  ${({ theme }) => theme.font.md.semibold};
  width: 178px;
  height: 56px;
  border: none;
  background: ${({ theme }) => theme.color.primary500};
  color: white;
  padding: 10px 20px;
  border-radius: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
