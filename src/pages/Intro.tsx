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
    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '2rem', color: '#0288d1' }}>
      우리는 왜 숨은 나라 찾기를 만들었을까?
    </h2>
     <p style={{ fontSize: '1.5rem', lineHeight: '2rem', maxWidth: '800px', marginBottom: '1rem' }}>
    한국에도 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>숨은 세계</span></strong>가 있습니다.
  </p>
  <div></div>
  <div></div>
  <div></div>
  <p style={{ fontSize: '1.5rem', lineHeight: '2rem', maxWidth: '800px', marginBottom: '1rem' }}>
    가평 <strong>스위스 마을</strong>, 니지모리 스튜디오에서 만나는 <strong>일본 마을</strong>
  </p>
  <div></div>
    {/* 이미지 3개 */}
  <div style={{
    position: 'relative', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: '3rem',
    gap: '20px',
    zIndex: 1
  }}>
    <img src={intro1} alt="이국적1" style={{
      width: '250px',
      height: '170px',
      objectFit: 'cover',
      borderRadius: '16px',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
      animation: 'float1 6s ease-in-out infinite alternate'
    }}/>
    <img src={intro2} alt="이국적2" style={{
      width: '280px',
      height: '180px',
      objectFit: 'cover',
      borderRadius: '16px',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
      animation: 'float2 6s ease-in-out infinite alternate'
    }}/>
    <img src={intro3} alt="이국적3" style={{
      width: '250px',
      height: '170px',
      objectFit: 'cover',
      borderRadius: '16px',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
      animation: 'float3 6s ease-in-out infinite alternate'
    }}/>
  </div>
  <br></br> <br></br>
  <p style={{ fontSize: '1.5rem', lineHeight: '2rem', maxWidth: '800px', marginBottom: '1rem' }}>
    SNS의  <strong><span style={{ fontSize: '2.5rem', fontWeight: '750' }}>‘#이국적인여행지’</span></strong> 만 봐도 사람들의 관심을 알 수 있죠.
  </p>
  <br></br>
  <div style={{
    position: 'relative', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: '3rem',
    gap: '20px',
    zIndex: 1
  }}>
    <img src={insta1} alt="이국적1" style={{
      width: '160px',
      height: '160px',
      objectFit: 'cover',
      borderRadius: '16px',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
      animation: 'float1 6s ease-in-out infinite alternate'
    }}/>
    <img src={insta2} alt="이국적2" style={{
      width: '160px',
      height: '160px',
      objectFit: 'cover',
      borderRadius: '16px',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
      animation: 'float2 6s ease-in-out infinite alternate'
    }}/>
    <img src={insta3} alt="이국적3" style={{
      width: '170px',
      height: '160px',
      objectFit: 'cover',
      borderRadius: '16px',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
      animation: 'float3 6s ease-in-out infinite alternate'
    }}/>
        <img src={insta4} alt="이국적3" style={{
      width: '160px',
      height: '160px',
      objectFit: 'cover',
      borderRadius: '16px',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
      animation: 'float3 6s ease-in-out infinite alternate'
    }}/>
  </div>
  <br></br>
  <br></br>
  <p style={{ fontSize: '1.5rem', lineHeight: '2rem', maxWidth: '800px', marginBottom: '1rem' }}>
    하지만 이렇게 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>흩어져 있는 정보</span></strong>를 일일이 찾아보는 것은 쉽지 않았습니다.
  </p>
  
  <br></br>
  <p style={{ fontSize: '1.5rem', lineHeight: '2rem', maxWidth: '800px', marginBottom: '1rem' }}>
    그래서 저희는 국내 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>이국적인 여행지</span></strong> 를 한눈에 확인할 수 있는 플랫폼
    <br></br> <br></br><br></br>
    <strong><span style={{ fontSize: '2.6rem', fontWeight: '800', textDecoration: 'underline',
  textDecorationColor: '#0288d1',
  textUnderlineOffset: '10px' }}>'숨은 나라 찾기'</span></strong> 를 만들었습니다.
  </p>
  <br></br>
  <p style={{ fontSize: '1.5rem', lineHeight: '2rem', maxWidth: '800px' }}>
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
  <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '2rem', color: '#0288d1' }}>
    이국적인 관광지, 어떻게 모았을까?
  </h2>
  <p style={{ fontSize: '1.6rem', marginBottom: '3rem' }}>
    숨은 나라 찾기는 <strong>국내 이국적인 관광지</strong>를 찾기 위해 특별한 과정을 거칩니다.
  </p>

  {/* 카드 흐름 */}
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
    {[
      { number: '50,318', label: '한국관광공사 데이터' },
      { number: '1,017', label: 'AI 모델 후보' },
      { number: '607', label: '최종 확정' }
    ].map((item, idx) => (
      <>
        <div key={idx} style={{
          backgroundColor: 'white',
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          minWidth: '180px'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0288d1' }}>{item.number}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#555' }}>{item.label}</div>
        </div>
        {idx < 2 && <div style={{ fontSize: '2rem', color: '#0288d1', fontWeight: '700' }}>→</div>}
      </>
    ))}
  </div>

  <p style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
    한국관광공사에서 제공하는 관광지 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>50,318개</span></strong>의 관광지 정보를 수집했습니다.
  </p>
  <br></br>
  <p style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
    관광지의 상세 정보는 <strong>한국관광공사</strong>와 <strong>웹 크롤링을</strong> 통해 모았으며
  </p>
  <br></br>
  <p style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
    모은 데이터들을 바탕으로 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>'숨은나라찾기'</span></strong>만의 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>AI 모델</span></strong>을 통해
  </p>
  <p style={{ fontSize: '1.6rem', marginBottom: '3rem' }}>
    <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>1017개</span></strong>의 후보지를 추출했습니다. 
  </p>
  <p style={{ fontSize: '1.6rem', marginBottom: '3rem' }}>
    그리고 최종적으로 팀원들의 검토로 최종 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>607개</span></strong>를 확정했습니다.
  </p>

</section>

<section ref={(el) => { sectionsRef.current[2] = el; }} style={{ position: 'relative', padding: '6rem 2rem', backgroundColor: '#fdfdfd', overflow: 'hidden' }}>
  <h2 style={{ fontSize: '3rem', fontWeight: '700', textAlign: 'center', marginBottom: '4rem', color: '#0288d1', position: 'relative', zIndex: 10 }}>
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
        <h3 style={{ fontSize: '2rem', fontWeight: '700', color: feature.color || '#1e3a8a', marginBottom: '1rem' }}>
          {feature.title}
        </h3>
        {feature.desc.map((d, i) => <p key={i} style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{d}</p>)}
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
  <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '2rem', color: '#0288d1' }}>
    함께 만드는 서비스
  </h2>

  <p style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
    숨은 나라 찾기는 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>혼자서 만드는 서비스가 아닙니다.</span></strong>
  </p>
  
  <p style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
    사용자들의 <strong><span style={{ fontSize: '2rem', fontWeight: '600' }}>피드백</span>과 <span style={{ fontSize: '2rem', fontWeight: '600' }}>참여</span></strong> 덕분에, 서비스는 날마다 <span style={{ fontSize: '2rem', fontWeight: '500' }}><strong>발전</strong></span>하고 있습니다.
  </p>
  
  <p style={{ fontSize: '1.6rem', marginBottom: '3rem' }}>
   여러분의 참여가 모여, <span style={{ fontSize: '2rem', fontWeight: '500' }}><strong>'숨은 나라 찾기'</strong></span>의 <strong><span style={{ fontSize: '2rem', fontWeight: '700' }}>가치</span>를 높이고</strong> <br></br>더 풍부한 여행 경험을 만들어갑니다.
  </p>
  
  {/* 커뮤니티 카드 */}
  <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '2rem',
  flexWrap: 'nowrap', // 무조건 한 줄
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
        cursor: 'pointer'
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
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#0ea5e9' }}>{card.title}</h3>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>{card.desc}</p>
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
  <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</h2>
  <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
    비행기 없이 세계를 느껴요
  </h2>
  <p style={{ fontSize: '1.6rem', marginBottom: '2rem', lineHeight: '2rem' }}>
    숨은 나라 찾기와 떠나는 작은 여행
  </p>
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

        /* 카드 플로우 */
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
        .card .number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 6px;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
        }
        .arrow { font-size: 1.5rem; color: #0288d1; font-weight: 700; }

        /* 글 ↔ 이미지 레이아웃 */
        .feature-row {
          display: flex;
          align-items: center;
          gap: 40px;
          margin: 40px 0;
        }
        .feature-row.reverse { flex-direction: row-reverse; }
        .feature-text { flex: 1; }
        .feature-image { flex: 1; overflow: hidden; border-radius: 16px; border: 1.5px solid #c8e0ffff; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* 기본 그림자 */}
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
  background: #ffffff; /* 하늘색 제거 */
  border-radius: 20px;
  /* box-shadow 제거해도 됨, 아니면 얇게 */
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
  overflow: hidden;
}

/* 반투명 원 배경 제거 */
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

        /* 반응형 */
        @media (max-width: 768px) {
          .feature-row, .feature-row.reverse {
            flex-direction: column;
          }
          .feature-image, .feature-text { width: 100%; }
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
