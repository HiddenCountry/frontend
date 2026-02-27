import React from "react";
import styled from "styled-components";

const PolicyPage: React.FC = () => {
  return (
    <Container>
      <Card>
        <Header>
          <div>
            <Title>서비스 이용약관</Title>
            <Meta>최종 수정일: 2025-10-10</Meta>
          </div>
        </Header>

        <TwoCol>
          <Toc aria-label="목차">
            <strong>목차</strong>
            <ul>
              <li>
                <a href="#purpose">1. 목적</a>
              </li>
              <li>
                <a href="#scope">2. 약관의 효력 및 변경</a>
              </li>
              <li>
                <a href="#signup">3. 회원가입 및 계정관리</a>
              </li>
              <li>
                <a href="#service">4. 서비스 제공 및 변경</a>
              </li>
              <li>
                <a href="#user-obligations">5. 이용자의 의무</a>
              </li>
              <li>
                <a href="#copyright">6. 저작권 및 콘텐츠</a>
              </li>
              <li>
                <a href="#liability">7. 면책조항</a>
              </li>
              <li>
                <a href="#dispute">8. 기타 및 분쟁해결</a>
              </li>
            </ul>
          </Toc>

          <Content>
            <section id="purpose">
              <h2>제1조 (목적)</h2>
              <p>
                본 약관은 숨은나라찾기 (이하 '회사')이 제공하는 모든 서비스의
                이용 조건, 회원과 회사의 권리·의무 및 책임사항 등을 규정함을
                목적으로 합니다.
              </p>
            </section>

            <section id="scope">
              <h2>제2조 (약관의 효력 및 변경)</h2>
              <ol>
                <li>본 약관은 서비스를 이용하는 모든 이용자에게 적용됩니다.</li>
                <li>
                  회사는 관련 법령을 위반하지 않는 범위 내에서 약관을 변경할 수
                  있으며, 변경 시 서비스 내 공지 또는 이메일로 고지합니다.
                </li>
                <li>
                  변경된 약관은 공지 또는 통지한 시점부터 효력을 가지며,
                  이용자가 이를 수락하지 않을 경우 서비스 이용을 중단할 수
                  있습니다.
                </li>
              </ol>
            </section>

            <section id="signup">
              <h2>제3조 (회원가입 및 계정관리)</h2>
              <ol>
                <li>
                  회원가입은 회사가 정한 절차에 따라 이루어지며, 회원은 정확한
                  정보를 제공해야 합니다.
                </li>
                <li>
                  계정 및 비밀번호는 회원의 책임이며, 제3자와 공유하거나 양도할
                  수 없습니다.
                </li>
                <li>
                  개인정보 변경 시 즉시 수정해야 하며, 미수정으로 발생한
                  불이익은 회원에게 있습니다.
                </li>
              </ol>
            </section>

            <section id="service">
              <h2>제4조 (서비스의 제공 및 변경)</h2>
              <ol>
                <li>회사는 안정적인 서비스 제공을 위해 노력합니다.</li>
                <li>
                  회사는 서비스의 내용·범위를 변경할 수 있으며, 중대한 변경은
                  사전 공지합니다.
                </li>
                <li>
                  정기점검, 긴급 장애, 천재지변 등으로 서비스가 일시 중단될 수
                  있으며, 이로 인한 손해에 대해 회사는 고의·중과실이 없는 한
                  책임을 지지 않습니다.
                </li>
              </ol>
            </section>

            <section id="user-obligations">
              <h2>제5조 (이용자의 의무)</h2>
              <ul>
                <li>
                  타인의 개인정보를 도용하거나 부정한 방법으로 서비스를
                  이용해서는 안 됩니다.
                </li>
                <li>
                  서비스 운영을 방해하는 행위(과다한 요청, 악성 코드 유포 등)는
                  금지됩니다.
                </li>
                <li>
                  법령 및 공서양속에 위반되는 콘텐츠를 게시할 수 없습니다.
                </li>
              </ul>
            </section>

            <section id="copyright">
              <h2>제6조 (저작권 및 콘텐츠 이용)</h2>
              <ol>
                <li>
                  서비스 내 제공되는 모든 콘텐츠의 저작권은 회사 또는
                  원저작권자에 귀속됩니다.
                </li>
                <li>
                  이용자는 회사의 사전 서면 동의 없이 콘텐츠를 복제, 전송, 배포,
                  전시, 2차적 저작물 작성 등의 행위를 할 수 없습니다.
                </li>
              </ol>
            </section>

            <section id="liability">
              <h2>제7조 (면책조항)</h2>
              <ol>
                <li>
                  회사는 이용자의 귀책사유로 인한 서비스 이용장애에 대해서는
                  책임지지 않습니다.
                </li>
                <li>
                  회사는 서비스에 게재된 정보의 정확성·신뢰성에 대해 보증하지
                  않으며, 이용자가 이를 신뢰하여 행한 행위에 대해 책임을 지지
                  않습니다.
                </li>
              </ol>
            </section>

            <section id="dispute">
              <h2>제8조 (기타 및 분쟁해결)</h2>
              <ol>
                <li>
                  본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.
                </li>
                <li>
                  회사와 이용자 간 분쟁이 발생할 경우, 당사자 간 협의를 통해
                  해결하며, 협의가 이루어지지 않을 경우 회사 본사 소재지를
                  관할하는 법원을 관할법원으로 합니다.
                </li>
              </ol>
            </section>
            {/*
            <FooterActions>
              <Button kind="ghost" onClick={() => window.print()}>인쇄하기</Button>
              <Button kind="primary" onClick={() => {
                // 예시: 홈으로 이동
                window.location.href = '/';
              }}>홈으로 돌아가기</Button>
            </FooterActions>
            */}
          </Content>
        </TwoCol>
      </Card>
    </Container>
  );
};

export default PolicyPage;

const Container = styled.div`
  margin: 0px auto;
  padding: 24px 40px;
  color: ${({ theme }) =>
    theme && (theme as any).text ? (theme as any).text : "#222"};
  background: ${({ theme }) => theme.color.gray50};
  scroll-behavior: smooth;
`;

const Card = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(20, 20, 30, 0.06);
  padding: 28px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.6rem;
`;

const Meta = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin: 5px 0 0 5px;
`;
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  margin-top: 18px;

  @media (max-width: 880px) {
    display: flex;
    flex-direction: column;

    nav {
      order: -1;
      position: relative;
      top: 0;
      box-shadow: none;
      background: rgba(250, 250, 250, 0.9);
      padding: 12px 16px;
    }
  }
`;

const Toc = styled.nav`
  position: sticky;
  top: 24px;
  align-self: start;
  background: rgba(250, 250, 250, 0.9);
  border-radius: 10px;
  padding: 16px;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(20, 20, 30, 0.03);

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  a {
    color: #2b6cb0;
    text-decoration: none;
  }
  li {
    margin: 10px 0;
  }
`;

const Content = styled.div`
  line-height: 1.72;
  color: #333;

  section {
    margin-bottom: 28px;
  }
  h2 {
    font-size: 1.08rem;
    margin: 0 0 8px 0;
  }
  p,
  li {
    font-size: 0.98rem;
    margin: 6px 0;
  }
  ol,
  ul {
    padding-left: 18px;
  }
`;

// const FooterActions = styled.div`
//   display: flex;
//   gap: 12px;
//   margin-top: 18px;
// `;

// const Button = styled.button<{ kind?: "primary" | "ghost" }>`
//   padding: 10px 14px;
//   border-radius: 8px;
//   border: none;
//   cursor: pointer;
//   font-weight: 600;
//   background: ${({ kind }) => (kind === "primary" ? "#2b6cb0" : "transparent")};
//   color: ${({ kind }) => (kind === "primary" ? "#fff" : "#2b6cb0")};
//   box-shadow: ${({ kind }) =>
//     kind === "primary" ? "0 6px 12px rgba(43,108,176,0.12)" : "none"};

//   &:hover {
//     opacity: 0.92;
//   }
// `;
