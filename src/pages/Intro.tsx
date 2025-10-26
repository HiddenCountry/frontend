import React, { useEffect, useRef } from 'react';
import countryImg from '../assets/intro/func1.jpg';
import func2Img from '../assets/intro/func2.jpg';
import func3Img from '../assets/intro/func3.jpg';
import func4Img from '../assets/intro/func4.jpg';
import func5Img from '../assets/intro/func5.jpg';
import intro1 from '../assets/intro/place1.png';
import intro2 from '../assets/intro/place2.png';
import intro3 from '../assets/intro/place3.png';
import insta1 from '../assets/intro/insta1.jpg';
import insta2 from '../assets/intro/insta2.jpg';
import insta3 from '../assets/intro/insta3.jpg';
import insta4 from '../assets/intro/insta4.jpg';
import {  useNavigate } from "react-router-dom";

const Intro: React.FC = () => {
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      sectionsRef.current.forEach((section) => {
        if (!section) return;
        const top = section.getBoundingClientRect().top;
        if (top < windowHeight - 100) {
          section.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="intro-page">
      {/* Hero 헤더 */}
      {/* <header className="hero">
        <h1>숨은 나라 찾기</h1>
        <p>국내에서 만나는, <strong>해외 같은 여행의 설렘</strong></p>
      </header> */}
<section
  ref={(el) => { sectionsRef.current[0] = el; }}
  style={{
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#fdfdfd',
    overflow: 'hidden',
  }}
>
  {/* 텍스트 */}
  <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
    <h2
    style={{
      fontSize: 'clamp(1.8rem, 4vw, 3rem)', // ✅ 반응형 폰트 크기
      fontWeight: '700',
      marginBottom: '2rem',
      color: '#0288d1',
      lineHeight: 1.3, // ✅ 줄 간격 안정화
      textAlign: 'center', // (선택) 가운데 정렬로 통일감
      wordBreak: 'keep-all', // ✅ 한국어 줄바꿈 안정
    }}
  >
  우리는 왜 숨은 나라 찾기를 만들었을까?
</h2>
  <p
  style={{
    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', // ✅ 반응형 폰트
    lineHeight: '1.8',                       // ✅ 줄 간격 안정화
    maxWidth: '800px',
    marginBottom: '1rem',
    wordBreak: 'keep-all',                   // ✅ 한국어 줄바꿈 안정
    textAlign: 'center',                     // ✅ 가운데 정렬 (선택)
    margin: '0 auto 1rem',                   // ✅ 가운데 정렬 보정
  }}
>
  한국에도{' '}
  <strong>
    <span
      style={{
        fontSize: 'clamp(1.4rem, 3vw, 2rem)', // ✅ 강조 부분도 반응형
        fontWeight: '700',
        color: '#0288d1',                     // (선택) 메인 컬러 강조
      }}
    >
      숨은 세계
    </span>
  </strong>
  가 있습니다.
</p>
  <p
  style={{
    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', // ✅ 반응형 폰트
    lineHeight: '1.8',                       // ✅ 줄 간격 안정화
    maxWidth: '800px',
    marginBottom: '1rem',
    wordBreak: 'keep-all',                   // ✅ 한국어 줄바꿈 안정
    textAlign: 'center',                     // ✅ 가운데 정렬
    margin: '0 auto 1rem',                   // ✅ 중앙 배치
  }}
>
  가평 <strong style={{ color: '#0288d1' }}>스위스 마을</strong>,{' '}
  니지모리 스튜디오에서 만나는{' '}
  <strong style={{ color: '#0288d1' }}>일본 마을</strong>
</p>
  <div></div>
    {/* 이미지 3개 */}
  <div
  style={{
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',              // ✅ 작은 화면에서는 자동 줄바꿈
    gap: '1.2rem',
    marginTop: '3rem',
    zIndex: 1,
  }}
>
  {[intro1, intro2, intro3].map((src, i) => (
    <img
      key={i}
      src={src}
      alt={`이국적${i + 1}`}
      style={{
        width: 'clamp(180px, 25vw, 280px)',  // ✅ 반응형 너비
        height: 'clamp(120px, 18vw, 180px)', // ✅ 반응형 높이
        objectFit: 'cover',
        borderRadius: '16px',
        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
        animation: `float${i + 1} 6s ease-in-out infinite alternate`,
      }}
    />
  ))}
</div>
  <br></br> <br></br>
  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',   // ✅ 화면 크기에 따라 자동 조정
    lineHeight: '1.8rem',
    maxWidth: '800px',
    marginBottom: '1rem',
    wordBreak: 'keep-all',                   // ✅ 줄바꿈 시 단어가 깨지지 않게
  }}
>
  SNS의{' '}
  <strong>
    <span
      style={{
        fontSize: 'clamp(1.4rem, 3vw, 2.5rem)',  // ✅ 반응형 강조 크기
        fontWeight: 750,
        color: '#0288d1',                        // 💡 살짝 색 넣으면 더 강조됨
      }}
    >
      ‘#이국적인여행지’
    </span>
  </strong>{' '}
  만 봐도 사람들의 관심을 알 수 있죠.
</p>
  <br></br>
  <div
  style={{
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap', // ✅ 화면이 좁으면 자동 줄바꿈
    marginTop: '3rem',
    gap: 'clamp(10px, 3vw, 20px)', // ✅ 반응형 간격
    zIndex: 1,
  }}
>
  {[insta1, insta2, insta3, insta4].map((img, idx) => (
    <img
      key={idx}
      src={img}
      alt={`이국적${idx + 1}`}
      style={{
        width: 'clamp(100px, 20vw, 170px)', // ✅ 화면 크기에 따라 자동 조절
        height: 'clamp(100px, 20vw, 160px)',
        objectFit: 'cover',
        borderRadius: '16px',
        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
        animation: `float${(idx % 3) + 1} 6s ease-in-out infinite alternate`,
      }}
    />
  ))}
</div>
  <br></br>
  <br></br>
  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.5rem)', // ✅ 화면 크기에 따라 폰트 크기 자동 조절
    lineHeight: '1.8em', // ✅ 가독성 높게
    maxWidth: 'min(90%, 800px)', // ✅ 화면이 좁을 때는 자동으로 줄어듦
    marginBottom: '1rem',
    wordBreak: 'keep-all', // ✅ 한국어 단어가 중간에서 끊기지 않게
    textAlign: 'center', // ✅ 문단이 중앙 정렬일 경우 보기 좋게
  }}
>
  하지만 이렇게{' '}
  <strong>
    <span
      style={{
        fontSize: 'clamp(1.3rem, 3vw, 2rem)',
        fontWeight: 700,
      }}
    >
      흩어져 있는 정보
    </span>
  </strong>
  를 일일이 찾아보는 것은 쉽지 않았습니다.
</p>
  <br></br>
  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    lineHeight: '1.8em',
    maxWidth: 'min(90%, 800px)',
    marginBottom: '1rem',
    wordBreak: 'keep-all',
    textAlign: 'center',
  }}
>
  그래서 저희는 국내{' '}
  <strong>
    <span
      style={{
        fontSize: 'clamp(1.4rem, 3vw, 2.5rem)',
        fontWeight: 750,
      }}
    >
      이국적인 여행지
    </span>
  </strong>{' '}
  를 한눈에 확인할 수 있는 플랫폼
  <br />
  <br />
  <strong>
    <span
      style={{
        fontSize: 'clamp(2rem, 4vw, 2.6rem)',
        fontWeight: '800',
        textDecoration: 'underline',
        textDecorationColor: '#0288d1',
        textUnderlineOffset: '10px',
      }}
    >
      '숨은 나라 찾기'
    </span>
  </strong>{' '}
  를 만들었습니다.
</p>
  <br></br>
  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.5rem)', // 화면 크기에 따라 자동 조절
    lineHeight: '1.8em',
    maxWidth: 'min(90%, 800px)',
    marginBottom: '1rem',
    wordBreak: 'keep-all', // 한국어 단어 중간에서 끊기지 않게
    textAlign: 'center', // 중앙 정렬
  }}
>
  외국인에게는 <strong>고향의 향수</strong>를, 우리에게는 <strong>새로운 여행의 즐거움</strong>을 제공합니다.
</p>









  </div>



  {/* 애니메이션 keyframes */}
  <style>
    {`
      @keyframes float1 {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
      }
      @keyframes float2 {
        0% { transform: translateY(0); }
        100% { transform: translateY(-15px); }
      }
      @keyframes float3 {
        0% { transform: translateY(0); }
        100% { transform: translateY(-12px); }
      }
    `}
  </style>
</section>


<section ref={(el) => { sectionsRef.current[1] = el; }} style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#f7f9fc', borderRadius: '24px'  }}>
  <h2
  style={{
    fontSize: 'clamp(1.8rem, 3vw, 3rem)', // 화면 크기에 따라 자동 조절
    fontWeight: 700,
    marginBottom: '2rem',
    color: '#0288d1',
    textAlign: 'center', // 필요 시 중앙 정렬
  }}
>
  이국적인 관광지, 어떻게 모았을까?
</h2>

  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)', // 화면 크기에 따라 자동 조절
    lineHeight: '1.8em', // 가독성 확보
    maxWidth: 'min(90%, 800px)', // 화면이 좁을 때도 잘림 방지
    marginBottom: '3rem',
    wordBreak: 'keep-all', // 한국어 단어 중간에서 끊기지 않게
    textAlign: 'center', // 중앙 정렬로 모바일에서도 보기 좋게
  }}
>
  숨은 나라 찾기는 <strong>국내 이국적인 관광지</strong>를 찾기 위해 특별한 과정을 거칩니다.
</p>

  {/* 카드 흐름 */}
  <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '3rem',
    flexWrap: 'wrap', // 좁은 화면에서 자동 줄바꿈
  }}
>
  {[
    { number: '50,318', label: '한국관광공사 데이터' },
    { number: '1,017', label: 'AI 모델 후보' },
    { number: '607', label: '최종 확정' }
  ].map((item, idx) => (
    <React.Fragment key={idx}>
      <div
        style={{
          backgroundColor: 'white',
          padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 2rem)', // 반응형 패딩
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          minWidth: '180px',
          flex: '1 1 180px', // 반응형으로 최소 180px 유지, 가로로 늘어남
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', // 반응형 글자
            fontWeight: '700',
            color: '#0288d1',
          }}
        >
          {item.number}
        </div>
        <div
          style={{
            marginTop: '0.5rem',
            fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', // 반응형 글자
            color: '#555',
          }}
        >
          {item.label}
        </div>
      </div>
      {idx < 2 && (
        <div
          style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            color: '#0288d1',
            fontWeight: '700',
          }}
        >
          →
        </div>
      )}
    </React.Fragment>
  ))}
</div>

  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)', // 화면에 따라 폰트 크기 자동 조절
    lineHeight: '1.8em',
    maxWidth: 'min(90%, 800px)',
    marginBottom: '0.5rem',
    wordBreak: 'keep-all', // 단어 중간에서 끊기지 않도록
  }}
>
  한국관광공사에서 제공하는 관광지{' '}
  <strong>
    <span style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: '700' }}>
      50,318개
    </span>
  </strong>
  의 관광지 정보를 수집했습니다.
</p>

  <br></br>
  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)',
    lineHeight: '1.8em',
    maxWidth: 'min(90%, 800px)',
    marginBottom: '0.5rem',
    wordBreak: 'keep-all',
  }}
>
  관광지의 상세 정보는 <strong>한국관광공사</strong>와 <strong>웹 크롤링을</strong> 통해 모았으며
</p>
  <br></br>
  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)',
    lineHeight: '1.8em',
    maxWidth: 'min(90%, 800px)',
    marginBottom: '0.5rem',
    wordBreak: 'keep-all',
  }}
>
    모은 데이터들을 바탕으로 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>'숨은나라찾기'</span></strong>만의 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>AI 모델</span></strong>을 통해
  </p>
  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)',
    lineHeight: '1.8em',
    maxWidth: 'min(90%, 800px)',
    marginBottom: '3rem',
    wordBreak: 'keep-all',
  }}
>
  <strong>
    <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '700' }}>
      1017개
    </span>
  </strong>의 후보지를 추출했습니다.
</p>
 <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)',
    lineHeight: '1.8em',
    maxWidth: 'min(90%, 800px)',
    marginBottom: '3rem',
    wordBreak: 'keep-all',
  }}
>
  그리고 최종적으로 팀원들의 검토로 최종{' '}
  <strong>
    <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '700' }}>
      607개
    </span>
  </strong>를 확정했습니다.
</p>

</section>

<section ref={(el) => { sectionsRef.current[2] = el; }} style={{ position: 'relative', padding: '6rem 2rem', backgroundColor: '#fdfdfd', overflow: 'hidden' }}>
  <h2
  style={{
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '4rem',
    color: '#0288d1',
    position: 'relative',
    zIndex: 10,
    lineHeight: '1.2em',
    wordBreak: 'keep-all',
  }}
>
  숨은 나라 찾기, 이렇게 이용해보세요
</h2>


  {[ 
    { title: '1️⃣ 마음 속 여행지, 지도에서 바로 선택', desc: ['지도를 펼쳐 마음속 여행지를 골라보세요.', '클릭 한 번으로, 마치 해외로 떠나는 설렘을 느낄 수 있어요.'], img: countryImg, floatX: -30, floatY: 0 ,color: '#0288d1'},
    { title: '2️⃣ 국내 이국적 장소, 한눈에 확인', desc: ['비행기 없이 즐기는 세계 여행!', '국내 곳곳 숨은 이국적인 명소를 찾아보세요.'], img: func2Img, floatX: 30, floatY: 20,color: '#0288d1' },
    { title: '3️⃣ 숨은 여행지, 지도 위에서 발견', desc: ['지도 위에서 한눈에 보는 “작은 세계”.', '우리나라 곳곳에 숨겨진 다양한 분위기를 자유롭게 탐험해보세요.'], img: func3Img, floatX: -20, floatY: -10,color: '#0288d1' },
    { title: '4️⃣ 나만의 ‘세계 여행 코스’', desc: ['서울에서 즐기는 파리 감성', '제주에서 느끼는 발리의 여유.', '당신의 ‘작은 세계 여행 코스’를 만들어보세요.'], img: func4Img, floatX: 20, floatY: 10, color: '#0288d1' },
    { title: '5️⃣ AI 여행 도우미', desc: ['여행지 소개부터 추천까지, AI가 도와드립니다.', '당신의 여행을 더욱 스마트하게 만들어보세요.'], img: func5Img, floatX: -20, floatY: 10, color: '#0288d1' }

  ].map((feature, idx) => (
    <div key={idx} style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '6rem',
    }}>
      {/* 텍스트 */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '600px', marginBottom: '3rem' }}>
        <h3
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', // 화면 크기에 따라 자동 조절
            fontWeight: 700,
            color: feature.color || '#1e3a8a',
            marginBottom: '1rem',
            lineHeight: '1.2em',
            wordBreak: 'keep-all',
            textAlign: 'center', // 필요시 중앙 정렬
          }}
        >
          {feature.title}
        </h3>
        {feature.desc.map((d, i) => (
  <p
    key={i}
    style={{
      fontSize: 'clamp(1rem, 2vw, 1.4rem)', // 화면 크기에 따라 폰트 자동 조절
      lineHeight: '1.6em',                // 가독성 높이기
      marginBottom: '0.5rem',
      wordBreak: 'keep-all',              // 한국어 단어 중간 끊김 방지
      textAlign: 'center',                // 필요시 중앙 정렬
    }}
  >
    {d}
  </p>
))}
      </div>

      {/* 이미지 */}
      <img src={feature.img} alt={feature.title} style={{
        position: 'relative',
        width: '80%',
        maxWidth: '500px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        transform: `translate(${feature.floatX}px, ${feature.floatY}px)`,
        animation: `floatAnim${idx} 6s ease-in-out infinite alternate`,
        zIndex: 5,
      }}/>
      
      {/* 애니메이션 keyframes */}
      <style>
        {`
          @keyframes floatAnim${idx} {
            0% { transform: translate(${feature.floatX}px, ${feature.floatY}px); }
            100% { transform: translate(${feature.floatX + 10}px, ${feature.floatY - 10}px); }
          }
        `}
      </style>
    </div>
  ))}
</section>

<section ref={(el) => { sectionsRef.current[3] = el; }} style={{ textAlign: 'center', padding: '6rem 2rem', backgroundColor: '#f7f9fc', borderRadius: '24px' }}>
  <h2
  style={{
    fontSize: 'clamp(1.8rem, 4vw, 3rem)', // 화면 크기에 따라 자동 조절
    fontWeight: '700',
    marginBottom: '2rem',
    color: '#0288d1',
    textAlign: 'center', // 작은 화면에서 중앙 정렬
    lineHeight: '1.2em',
  }}
>
  함께 만드는 서비스
</h2>

  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)', // 화면 크기에 따라 폰트 자동 조절
    lineHeight: '1.8em',
    marginBottom: '0.5rem',
    textAlign: 'center', // 작은 화면에서도 중앙 정렬
    wordBreak: 'keep-all', // 한국어 단어가 중간에서 끊기지 않게
  }}
>
  숨은 나라 찾기는{' '}
  <strong>
    <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '700' }}>
      혼자서 만드는 서비스가 아닙니다.
    </span>
  </strong>
</p>
  
  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)',
    lineHeight: '1.8em',
    marginBottom: '0.5rem',
    textAlign: 'center',
    wordBreak: 'keep-all',
  }}
>
  사용자들의{' '}
  <strong>
    <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '600' }}>피드백</span>과{' '}
    <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '600' }}>참여</span>
  </strong>{' '}
  덕분에, 서비스는 날마다{' '}
  <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '500' }}>
    <strong>발전</strong>
  </span>{' '}
  하고 있습니다.
</p>

  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)', // 화면 크기에 따라 폰트 자동 조절
    lineHeight: '1.8em',
    marginBottom: '3rem',
    textAlign: 'center',
    wordBreak: 'keep-all',
  }}
>
  여러분의 참여가 모여, <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '500' }}><strong>'숨은 나라 찾기'</strong></span>의 <strong><span style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '700' }}>가치</span>를 높이고</strong> <br></br>더 풍부한 여행 경험을 만들어갑니다.
</p>

  {/* 커뮤니티 카드 */}
  <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '2rem',
  flexWrap: 'wrap', // 무조건 한 줄
  overflowX: 'auto', // 화면을 넘어가면 가로 스크롤
  paddingBottom: '1rem', // 스크롤 공간 확보
  marginTop: '3rem',
  // marginBottom: '3rem'
  }}>
    {[
      { title: '이국력 평가', desc: '다녀온 여행지의 이국적인 정도를 평가하여 다른 사용자들과 공유할 수 있습니다.' },
      { title: '여행지 추천', desc: '발견한 숨은 여행지를 등록하여 서비스에 기여할 수 있습니다.' },
      { title: '나만의 코스 등록', desc: '나만의 비행기 없이 떠나는 세계여행 코스를 만들어 공유해보세요.' },
      // { title: '피드백 반영', desc: 'AI 모델이 학습하여 더 나은 추천과 코스를 제공합니다.' }
    ].map((card, idx) => (
      <div key={idx} style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        flex: '1 1 250px',
      }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 25px 40px rgba(0,0,0,0.2)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
        }}
      >
        <h3
  style={{
    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#0ea5e9',
  }}
>
  {card.title}
</h3>
<p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: '#555',
    lineHeight: '1.6em',
  }}
>
  {card.desc}
</p>

      </div>
    ))}
  </div>
</section>
<section
  ref={(el) => { sectionsRef.current[4] = el; }}
  style={{
    textAlign: 'center',
    padding: '0rem 2rem 20rem', // 위: 8rem, 아래: 12rem → 더 길쭉하게
    color: '#0288d1',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <h2
  style={{
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    marginBottom: '1rem',
  }}
>
  ✈️
</h2>
<h2
  style={{
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: '700',
    marginBottom: '1rem',
  }}
>
  비행기 없이 세계를 느껴요
</h2>
  <p
  style={{
    fontSize: 'clamp(1rem, 2vw, 1.6rem)',
    marginBottom: '2rem',
    lineHeight: 'clamp(1.5rem, 2.5vw, 2rem)',
  }}
></p>
  <button style={{
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    fontWeight: '700',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0288d1',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
  }}
  onMouseOver={e => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.15)';
  }}
  onMouseOut={e => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)';
  }}
  onClick={() => navigate('/')} // 클릭 시 "/" 경로로 이동
  >
    지금 떠나기
  </button>

  <p style={{ marginTop: '3rem', fontSize: '1.2rem', fontWeight: '500', color: '#555', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.8' }}>
    국내 곳곳 숨은 세계를 탐험하고 새로운 여행 경험을 만들어보세요.
  </p>

  {/* 아래에 아주 연한 그라데이션 */}
  <div style={{
    borderRadius: '12px',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '80px',
    background: 'linear-gradient(to top, rgba(2,136,209,0.3), transparent)',
    pointerEvents: 'none',
    paddingBottom: '400px'
  }} />
</section>
<style>{`
  .intro-page {
    font-family: 'Noto Sans KR', sans-serif;
    margin: 0;
    background-color: #ffffff;
    color: #323232ff;
    line-height: 1.8;
  }

  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  section {
    max-width: 900px;
    margin: 60px auto;
    padding: 0 20px;
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s ease;
  }
  section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  h2 {
    color: #0288d1;
    font-size: 2.2rem;
    margin-top: 30px;
    font-weight: 900;
  }
  p { font-size: 1.15rem; margin: 15px 0; }
  strong { color: #0288d1; }

  .image-container {
    width: 100%;
    height: 350px;
    overflow: hidden;
    border-radius: 20px;
    margin: 30px 0;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  .image-container img:hover { transform: scale(1.05); }

  .cards-flow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 20px 0;
  }
  .card {
    flex: 1;
    min-width: 0;
    background: linear-gradient(135deg, #81d4fa, #9dd7f9);
    color: white;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .card:hover {
    transform: translateY(-6px) scale(1.05);
    box-shadow: 0 12px 25px rgba(0,0,0,0.2);
  }

  .arrow { font-size: 1.5rem; color: #0288d1; font-weight: 700; }

  .feature-row {
    display: flex;
    align-items: center;
    gap: 40px;
    margin: 40px 0;
  }
  .feature-row.reverse { flex-direction: row-reverse; }
  .feature-text { flex: 1; }
  .feature-image { flex: 1; overflow: hidden; border-radius: 16px; border: 1.5px solid #c8e0ffff; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); }
  .feature-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  .feature-image img:hover { transform: scale(1.05); }

  /* 함께 만드는 서비스 */
  .community-section {
    text-align: center;
    margin: 60px 0;
    position: relative;
    padding: 60px 30px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.05);
    overflow: hidden;
  }
  .community-section::before,
  .community-section::after {
    display: none;
  }

  .community-cards {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin: 30px 0;
  }

  .community-card {
    background: linear-gradient(135deg, #0288d1, #81d4fa);
    color: white;
    flex: 1;
    min-width: 140px;
    max-width: 180px;
    padding: 25px 15px;
    border-radius: 16px;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .community-card:hover {
    transform: translateY(-6px) scale(1.05);
    box-shadow: 0 12px 25px rgba(0,0,0,0.2);
  }

  .participants {
    font-size: 1.2rem;
    margin-top: 20px;
    color: #0288d1;
    font-weight: 700;
  }

  /* 반응형 시작 */
  @media (max-width: 1024px) {
    h2 {
      font-size: 1.9rem;
    }
    p {
      font-size: 1.1rem;
    }
    .feature-row {
      gap: 20px;
    }
  }

  @media (max-width: 768px) {
    section {
      max-width: 100%;
      margin: 40px auto;
      padding: 0 16px;
    }

    h2 {
      font-size: 1.8rem;
      line-height: 2.2rem;
    }
    p {
      font-size: 1rem;
      line-height: 1.6rem;
    }

    .image-container {
      height: 220px;
      border-radius: 12px;
    }

    .feature-row, .feature-row.reverse {
      flex-direction: column;
      gap: 20px;
    }

    .feature-image {
      width: 100%;
      border-radius: 12px;
    }

    .card {
      padding: 1rem;
      font-size: 0.9rem;
    }

    .community-cards {
      flex-direction: column;
      gap: 1rem;
    }

    .community-card {
      width: 100%;
      max-width: 100%;
      font-size: 1rem;
    }

    button {
      width: 80%;
      font-size: 1rem;
      padding: 0.8rem 1.5rem;
    }
  }

  @media (max-width: 480px) {
    h2 {
      font-size: 1.6rem;
    }
    p {
      font-size: 0.95rem;
    }
    button {
      font-size: 0.9rem;
      padding: 0.8rem 1rem;
    }
    .image-container {
      height: 180px;
    }
  }

  footer {
    text-align: center;
    padding: 60px 20px;
    background-color: #e1f5fe;
    color: #333;
    font-weight: 500;
  }
`}</style>

     
    </div>
  );
};

export default Intro;
