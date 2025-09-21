import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { patchNickname } from "../api/Kakao";

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

  const handleConfirm = async () => {
    if (!isValid) return;

    try {
      const res = await patchNickname({ nickname });

      if (res.isSuccess) {
        console.log("닉네임 변경 성공:", res.data);
        localStorage.setItem("nickname", nickname);
        navigate("/signup/complete");
      } else {
        alert(res.message || "닉네임 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("닉네임 변경 오류:", error);
      alert("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
    }
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

  @media (max-width: 500px) {
    width: 90%;
    padding: 30px;
    border-radius: 24px;
  }

  @media (max-width: 480px) {
    padding: 30px;
    border-radius: 20px;
  }
`;

const Title = styled.div`
  ${({ theme }) => theme.font.xxxl.bold};
  margin-bottom: 30px;
  text-align: left;
  color: ${({ theme }) => theme.color.gray800};

  @media (max-width: 768px) {
    ${({ theme }) => theme.font.xxl.bold};
  }

  @media (max-width: 480px) {
    ${({ theme }) => theme.font.xl.bold};
  }
`;

const Label = styled.div`
  ${({ theme }) => theme.font.xxl.semibold};
  margin-bottom: 10px;
  text-align: left;
  color: ${({ theme }) => theme.color.gray800};

  @media (max-width: 768px) {
    ${({ theme }) => theme.font.xl.semibold};
  }

  @media (max-width: 480px) {
    ${({ theme }) => theme.font.xl.semibold};
  }
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

  @media (max-width: 768px) {
    height: 52px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    height: 48px;
    font-size: 12px;
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
  transition: color 0.2s ease;

  @media (max-width: 768px) {
    margin-bottom: 80px;
    font-size: 11px;
  }

  @media (max-width: 480px) {
    margin-bottom: 60px;
    font-size: 10px;
  }
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
  @media (max-width: 768px) {
    width: 150px;
    height: 48px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: 44px;
    font-size: 13px;
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

  @media (max-width: 768px) {
    width: 150px;
    height: 48px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: 44px;
    font-size: 13px;
  }
`;
