import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as AILogo } from "../assets/layout/Logo.svg";
import { getChatSession, postChatQuery } from "../api/Chat";

type Role = "user" | "assistant" | "system";

interface RelevantDocument {
  title: string;
  addr1: string;
  firstImage?: string;
}

interface Message {
  id: string;
  role: Role;
  content: string;
  time?: string;
  relevantDocuments?: RelevantDocument[]; // 관련 여행지
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "AI 여행 도우미",
      messages: [
        {
          id: "m1",
          role: "assistant",
          content: "안녕하세요! 무엇을 도와드릴까요?",
          time: new Date().toLocaleTimeString(),
        },
      ],
    },
  ]);

  const recommendedPrompts = [
    "일본 컨셉 여행지 추천해줘",
    "부산 여행 코스 알려줘",
    "유럽 느낌 여행지 추천해줘",
  ];

  const [activeConvId, setActiveConvId] = useState(conversations[0].id);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 세션 초기화
  useEffect(() => {
    const initSession = async () => {
      let sessionId = localStorage.getItem("chatSessionId");
      if (!sessionId) {
        try {
          const res = await getChatSession();
          sessionId = res.data; // string
          localStorage.setItem("chatSessionId", sessionId!);
        } catch (err) {
          console.error("세션 발급 실패:", err);
          setIsSending(false);
          return; // 세션 없으면 더 이상 진행 X
        }
      }
    };
    initSession();
  }, []);

  // active 대화 보정
  useEffect(() => {
    if (
      !conversations.find((c) => c.id === activeConvId) &&
      conversations.length
    ) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId]);

  // 새 메세지 오면 스크롤 아래로
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConvId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId)!;

  function addMessageToActive(message: Message) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId ? { ...c, messages: [...c.messages, message] } : c
      )
    );
  }

  // 메시지 전송 + AI 응답 API 연동
  async function handleSend(textToSend?: string) {
    const text = textToSend ?? input.trim();
    if (!text) return;
    setIsSending(true);

    // 1️⃣ 세션 가져오기
    let sessionId = localStorage.getItem("chatSessionId");

    if (!sessionId) {
      try {
        const res = await getChatSession();
        sessionId = res.data; // 세션 문자열
        localStorage.setItem("chatSessionId", sessionId!);
        console.log("새 세션 발급:", sessionId);
      } catch (err) {
        console.error("세션 발급 실패:", err);
        setIsSending(false);
        return; // 세션 없으면 더 이상 진행 X
      }
    }

    // 2️⃣ 사용자 메시지 추가
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString(),
    };
    addMessageToActive(userMsg);
    setInput("");

    // 3️⃣ AI placeholder 메시지 추가
    const placeholderId = `a-${Date.now() + 1}`;
    const assistantPlaceholder: Message = {
      id: placeholderId,
      role: "assistant",
      content: "",
      time: new Date().toLocaleTimeString(),
    };
    addMessageToActive(assistantPlaceholder);

    // 4️⃣ AI API 호출
    try {
      const res = await postChatQuery({ query: text, sessionId: sessionId! });
      const data = res?.data;

      if (data?.answer) {
        const updatedMsg: Message = {
          ...assistantPlaceholder,
          content: data.answer,
          relevantDocuments: data.relevantDocuments ?? [],
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === placeholderId ? updatedMsg : m
                  ),
                }
              : c
          )
        );
      } else {
        throw new Error("유효한 응답이 없습니다.");
      }
    } catch (err) {
      console.error("응답 오류:", err);
      const errorMsg: Message = {
        ...assistantPlaceholder,
        content: "응답을 가져오는 중 오류가 발생했습니다.",
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === placeholderId ? errorMsg : m
                ),
              }
            : c
        )
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function escapeHtmlToMarkdown(text: string) {
    const escaped = String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");
    return escaped;
  }

  return (
    <Container>
      <Main>
        {/* 채팅 헤더 */}
        <ChatHeader>
          <HeaderTitle>{activeConversation?.title || "대화 없음"}</HeaderTitle>
          <HeaderMeta>
            <span>{activeConversation?.messages.length ?? 0} messages</span>
            <small> • </small>
            <small>{isSending ? "응답 생성중…" : "준비됨"}</small>
          </HeaderMeta>
        </ChatHeader>

        {/* 채팅 부분 */}
        <ChatArea>
          <Messages>
            {activeConversation?.messages.map((m, idx) => {
              const isLast = idx === activeConversation.messages.length - 1;
              const showLoading =
                m.role === "assistant" && m.content === "" && isSending;

              return (
                <>
                  <MessageRow key={m.id} $role={m.role}>
                    <Avatar $role={m.role}>
                      {m.role === "user" ? null : <AILogo />}
                    </Avatar>
                    <Bubble $role={m.role}>
                      {showLoading ? (
                        <LoadingDots>
                          <div></div>
                          <div></div>
                          <div></div>
                        </LoadingDots>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: escapeHtmlToMarkdown(m.content),
                          }}
                        />
                      )}

                      {/*
                  {관련 여행지 표시}
                  {m.relevantDocuments && m.relevantDocuments.length > 0 && (
                    <DocumentGrid>
                      {m.relevantDocuments.map((doc, idx) => (
                        <DocCard key={idx}>
                          <DocImage
                            src={doc.firstImage || "/placeholder.png"}
                            alt={doc.title}
                          />
                          <DocTitle>{doc.title}</DocTitle>
                          <DocAddr>{doc.addr1}</DocAddr>
                        </DocCard>
                      ))}
                    </DocumentGrid>
                  )}
            */}

                      <Time>{m.time}</Time>
                    </Bubble>
                  </MessageRow>
                  {/* 첫 assistant 메시지 아래에 추천 멘트 표시 */}
                  {idx === 0 && m.role === "assistant" && (
                    <Recommended>
                      {recommendedPrompts.map((prompt, i) => (
                        <PromptBubble
                          key={i}
                          onClick={() => handleSend(prompt)} // input 설정 없이 바로 전송
                        >
                          {prompt}
                        </PromptBubble>
                      ))}
                    </Recommended>
                  )}
                </>
              );
            })}
            <div ref={chatEndRef} />
          </Messages>
          <ComposerRow>
            <InputMessage
              placeholder="메시지를 입력하세요."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <SendButton
              onClick={() => handleSend()}
              disabled={isSending || input.trim() === ""}
            >
              {isSending ? "전송중…" : "전송"}
            </SendButton>
          </ComposerRow>
        </ChatArea>
      </Main>
    </Container>
  );
};

export default ChatPage;

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  padding: 0 15%;
  height: 95vh;
  background: ${({ theme }) => theme.color.gray50};
  color: ${({ theme }) => theme.color.gray900};

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.header`
  padding: 18px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.8;
  font-size: 13px;
`;

const ChatArea = styled.section`
  display: flex;
  flex-direction: column;
  padding: 18px;
  gap: 12px;
  height: 80vh;
`;

const Messages = styled.div`
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const MessageRow = styled.div<{ $role: Role }>`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: ${({ $role }) =>
    $role === "user" ? "flex-end" : "flex-start"};
`;

const Avatar = styled.div<{ $role: Role }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $role, theme }) =>
    $role === "user" ? theme.color.white : theme.color.black};
  background: ${({ $role, theme }) =>
    $role === "user" ? "transparent" : theme.color.primary50};

  svg {
    width: 25px;
  }
`;

const Bubble = styled.div<{ $role: Role }>`
  max-width: 70%;
  padding: 12px 14px;
  border-radius: 12px;
  background: ${({ $role }) =>
    $role === "user"
      ? "linear-gradient(90deg,#4066ff,#2db2ff)"
      : "rgba(255,255,255,0.03)"};
  color: ${({ $role }) => ($role === "user" ? "white" : "inherit")};
  line-height: 1.6;
  box-shadow: 0 1px 3px ${({ theme }) => theme.color.primary500};

  animation: slideUpFade 0.3s ease forwards;
  transform: translateY(10px);
  opacity: 0;

  @keyframes slideUpFade {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 500px) {
    font-size: 0.85rem;
    padding: 10px 12px;
  }
`;

const Time = styled.div`
  margin-top: 8px;
  font-size: 11px;
  opacity: 0.6;
  text-align: right;
`;
const Recommended = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 46px; /* assistant 말풍선과 맞춤 */
  margin-top: 8px;
`;

const PromptBubble = styled.button`
  background: ${({ theme }) => theme.color.primary50};
  color: ${({ theme }) => theme.color.primary600};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.color.primary200};
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.color.primary500};
    color: white;
  }
`;

const PromptButton = styled.button`
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.color.primary500};
  background: ${({ theme }) => theme.color.primary50};
  color: ${({ theme }) => theme.color.primary600};
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.color.primary500};
    color: white;
  }
`;

const ComposerRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 0;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 12px 16px;
    background: ${({ theme }) => theme.color.gray50};
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
`;

const InputMessage = styled.input`
  flex: 1;
  padding: 20px 25px;
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.color.gray300};
  font-size: 14px;
`;

const SendButton = styled.button`
  padding: 15px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: #3b82f6;
  color: white;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  div {
    width: 6px;
    height: 6px;
    background: #3b82f6;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  div:nth-child(2) {
    animation-delay: 0.2s;
  }
  div:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

/* 관련 여행지 카드 스타일 */
const DocumentGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
`;

const DocCard = styled.div`
  background: ${({ theme }) => theme.color.gray100};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DocImage = styled.img`
  width: 100%;
  height: 90px;
  object-fit: cover;
`;

const DocTitle = styled.div`
  ${({ theme }) => theme.font.sm.bold};
  padding: 8px 10px 2px;
`;

const DocAddr = styled.div`
  ${({ theme }) => theme.font.xs.regular};
  padding: 0 10px 8px;
  color: ${({ theme }) => theme.color.gray600};
`;
