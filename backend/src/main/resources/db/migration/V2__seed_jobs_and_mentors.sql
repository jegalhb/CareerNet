CREATE TEMPORARY TABLE seed_jobs (
    job_code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    summary VARCHAR(500) NOT NULL
);

INSERT INTO seed_jobs (job_code, name, category, summary) VALUES
('web-developer', '웹 개발자', 'IT/개발', '웹 브라우저에서 동작하는 서비스와 화면을 설계하고 구현합니다.'),
('backend-developer', '백엔드 개발자', 'IT/개발', '서버 로직, 데이터 처리, API를 설계하고 안정적으로 운영합니다.'),
('frontend-developer', '프론트엔드 개발자', 'IT/개발', '사용자가 직접 만나는 웹 화면과 상호작용을 구현합니다.'),
('mobile-app-developer', '모바일 앱 개발자', 'IT/개발', '스마트폰 앱을 설계하고 배포하며 사용자 경험을 개선합니다.'),
('game-developer', '게임 개발자', 'IT/개발', '게임 규칙, 그래픽, 네트워크 기능을 코드로 구현합니다.'),
('devops-engineer', 'DevOps 엔지니어', 'IT/개발', '개발과 운영 사이의 배포, 자동화, 모니터링 환경을 구축합니다.'),
('cloud-engineer', '클라우드 엔지니어', 'IT/개발', '클라우드 인프라를 설계하고 안정적인 서비스 운영을 지원합니다.'),
('embedded-developer', '임베디드 개발자', 'IT/개발', '기기 내부에서 동작하는 소프트웨어를 개발합니다.'),
('qa-engineer', 'QA 엔지니어', 'IT/개발', '소프트웨어 품질을 검증하고 오류를 찾아 개선합니다.'),
('software-architect', '소프트웨어 아키텍트', 'IT/개발', '서비스 전체 구조와 기술 방향을 설계합니다.'),
('ai-engineer', 'AI 엔지니어', '데이터/AI', '인공지능 모델을 설계하고 서비스에 적용합니다.'),
('data-analyst', '데이터 분석가', '데이터/AI', '데이터를 분석해 의사결정에 필요한 인사이트를 찾습니다.'),
('data-scientist', '데이터 사이언티스트', '데이터/AI', '통계와 머신러닝을 활용해 예측 모델과 분석 결과를 만듭니다.'),
('machine-learning-engineer', '머신러닝 엔지니어', '데이터/AI', '머신러닝 모델을 학습시키고 실제 서비스에 배포합니다.'),
('data-engineer', '데이터 엔지니어', '데이터/AI', '데이터 수집, 저장, 처리 파이프라인을 구축합니다.'),
('prompt-engineer', '프롬프트 엔지니어', '데이터/AI', '생성형 AI가 원하는 결과를 내도록 입력과 흐름을 설계합니다.'),
('computer-vision-engineer', '컴퓨터 비전 엔지니어', '데이터/AI', '이미지와 영상 데이터를 분석하는 AI 모델을 개발합니다.'),
('nlp-engineer', '자연어처리 엔지니어', '데이터/AI', '텍스트와 언어 데이터를 이해하는 AI 기술을 개발합니다.'),
('bi-developer', 'BI 개발자', '데이터/AI', '데이터 시각화와 대시보드로 비즈니스 지표를 제공합니다.'),
('ai-product-manager', 'AI 프로덕트 매니저', '데이터/AI', 'AI 기술을 활용한 제품의 방향과 요구사항을 설계합니다.'),
('ux-ui-designer', 'UX/UI 디자이너', '디자인/콘텐츠', '사용자 경험과 화면 인터페이스를 설계합니다.'),
('product-designer', '프로덕트 디자이너', '디자인/콘텐츠', '제품 문제를 정의하고 사용성 높은 경험을 설계합니다.'),
('graphic-designer', '그래픽 디자이너', '디자인/콘텐츠', '시각 자료와 브랜드 이미지를 디자인합니다.'),
('motion-graphic-designer', '모션그래픽 디자이너', '디자인/콘텐츠', '움직이는 영상 그래픽과 애니메이션을 제작합니다.'),
('content-planner', '콘텐츠 기획자', '디자인/콘텐츠', '사용자에게 전달할 콘텐츠의 주제와 구성을 기획합니다.'),
('video-editor', '영상 편집자', '디자인/콘텐츠', '촬영된 영상을 목적에 맞게 편집하고 완성합니다.'),
('game-artist', '게임 원화가', '디자인/콘텐츠', '게임 캐릭터, 배경, 아이템의 시각 콘셉트를 만듭니다.'),
('webtoon-creator', '웹툰 작가', '디자인/콘텐츠', '이야기와 그림을 결합해 웹툰 콘텐츠를 제작합니다.'),
('brand-designer', '브랜드 디자이너', '디자인/콘텐츠', '브랜드의 정체성을 시각적으로 표현합니다.'),
('three-d-artist', '3D 아티스트', '디자인/콘텐츠', '3D 모델, 공간, 캐릭터를 제작합니다.'),
('service-planner', '서비스 기획자', '경영/기획', '사용자 문제를 분석해 서비스 기능과 정책을 기획합니다.'),
('product-manager', '프로덕트 매니저', '경영/기획', '제품 목표, 일정, 우선순위를 조율합니다.'),
('marketing-manager', '마케팅 매니저', '경영/기획', '고객에게 제품과 브랜드를 알리는 전략을 세웁니다.'),
('business-analyst', '비즈니스 분석가', '경영/기획', '사업 데이터를 분석해 개선 방향을 제안합니다.'),
('project-manager', '프로젝트 매니저', '경영/기획', '프로젝트 일정, 범위, 리스크를 관리합니다.'),
('startup-founder', '창업가', '경영/기획', '새로운 문제를 해결하는 사업을 만들고 운영합니다.'),
('hr-manager', '인사 담당자', '경영/기획', '채용, 평가, 조직문화, 인재 성장을 관리합니다.'),
('sales-manager', '영업 관리자', '경영/기획', '고객과 시장을 이해하고 매출 성장을 이끕니다.'),
('customer-success-manager', '고객성공 매니저', '경영/기획', '고객이 제품을 잘 활용하도록 지원하고 관계를 관리합니다.'),
('operations-manager', '운영 관리자', '경영/기획', '서비스 운영 절차와 품질을 관리합니다.'),
('career-counselor', '진로상담사', '교육/상담', '학생과 구직자의 적성과 목표를 함께 탐색합니다.'),
('teacher', '교사', '교육/상담', '학생에게 지식과 태도를 가르치고 성장을 돕습니다.'),
('education-content-developer', '교육 콘텐츠 개발자', '교육/상담', '학습 목표에 맞는 수업 자료와 콘텐츠를 제작합니다.'),
('learning-designer', '러닝 디자이너', '교육/상담', '효과적인 학습 경험과 교육 과정을 설계합니다.'),
('youth-counselor', '청소년 상담사', '교육/상담', '청소년의 심리, 진로, 관계 문제를 상담합니다.'),
('speech-therapist', '언어치료사', '교육/상담', '언어와 의사소통 발달을 평가하고 치료합니다.'),
('special-education-teacher', '특수교사', '교육/상담', '특수교육 대상 학생의 학습과 생활을 지원합니다.'),
('education-consultant', '교육 컨설턴트', '교육/상담', '교육기관과 학습자의 문제를 분석해 해결책을 제안합니다.'),
('tutoring-platform-manager', '학습 플랫폼 매니저', '교육/상담', '온라인 학습 서비스의 운영과 개선을 담당합니다.'),
('librarian', '사서', '교육/상담', '자료를 수집, 정리하고 이용자의 정보 탐색을 돕습니다.'),
('nurse', '간호사', '의료/보건', '환자의 건강 상태를 돌보고 치료 과정을 지원합니다.'),
('doctor', '의사', '의료/보건', '질병을 진단하고 치료 계획을 세웁니다.'),
('physical-therapist', '물리치료사', '의료/보건', '운동과 물리적 치료로 신체 회복을 돕습니다.'),
('occupational-therapist', '작업치료사', '의료/보건', '일상생활에 필요한 기능 회복을 지원합니다.'),
('clinical-lab-technologist', '임상병리사', '의료/보건', '검체를 분석해 진단에 필요한 자료를 제공합니다.'),
('pharmacist', '약사', '의료/보건', '약품을 조제하고 복약 정보를 안내합니다.'),
('nutritionist', '영양사', '의료/보건', '건강한 식단과 영양 관리를 설계합니다.'),
('public-health-specialist', '보건 전문가', '의료/보건', '지역사회 건강 문제를 예방하고 관리합니다.'),
('mental-health-counselor', '정신건강 상담사', '의료/보건', '마음 건강과 심리적 어려움을 상담합니다.'),
('emergency-medical-technician', '응급구조사', '의료/보건', '응급 상황에서 환자를 처치하고 이송합니다.'),
('robotics-engineer', '로봇공학자', '공학/제조', '로봇 시스템을 설계하고 제어 기술을 개발합니다.'),
('mechanical-engineer', '기계공학자', '공학/제조', '기계 장치와 설비를 설계하고 개선합니다.'),
('electrical-engineer', '전기공학자', '공학/제조', '전기 시스템과 설비를 설계하고 관리합니다.'),
('chemical-engineer', '화학공학자', '공학/제조', '화학 공정과 소재 생산 기술을 개발합니다.'),
('civil-engineer', '토목공학자', '공학/제조', '도로, 교량, 시설물 같은 인프라를 설계합니다.'),
('industrial-engineer', '산업공학자', '공학/제조', '생산성과 품질을 높이는 시스템을 설계합니다.'),
('semiconductor-engineer', '반도체 엔지니어', '공학/제조', '반도체 공정, 장비, 회로 기술을 다룹니다.'),
('automotive-engineer', '자동차 엔지니어', '공학/제조', '자동차와 이동 수단의 부품과 시스템을 개발합니다.'),
('aerospace-engineer', '항공우주공학자', '공학/제조', '항공기와 우주 시스템을 설계하고 연구합니다.'),
('smart-factory-engineer', '스마트팩토리 엔지니어', '공학/제조', '제조 공정에 자동화와 데이터 기술을 적용합니다.'),
('accountant', '회계사', '금융/법률', '기업과 개인의 회계와 재무 정보를 검토합니다.'),
('tax-advisor', '세무사', '금융/법률', '세금 신고, 납부, 절세 전략을 지원합니다.'),
('financial-analyst', '재무 분석가', '금융/법률', '재무 자료를 분석해 투자와 경영 판단을 돕습니다.'),
('investment-analyst', '투자 분석가', '금융/법률', '시장과 기업을 분석해 투자 의견을 제시합니다.'),
('insurance-actuary', '보험계리사', '금융/법률', '확률과 통계로 보험 상품의 위험과 가격을 계산합니다.'),
('compliance-manager', '컴플라이언스 매니저', '금융/법률', '기업이 법과 규정을 지키도록 관리합니다.'),
('lawyer', '변호사', '금융/법률', '법률 문제를 분석하고 의뢰인을 대리합니다.'),
('paralegal', '법률 사무원', '금융/법률', '법률 문서와 사건 자료를 정리하고 지원합니다.'),
('patent-attorney', '변리사', '금융/법률', '특허와 지식재산권 출원 및 분쟁을 지원합니다.'),
('fintech-planner', '핀테크 기획자', '금융/법률', '금융 서비스에 기술을 접목한 제품을 기획합니다.'),
('environmental-engineer', '환경공학자', '환경/에너지', '환경오염 문제를 분석하고 개선 기술을 개발합니다.'),
('renewable-energy-engineer', '신재생에너지 엔지니어', '환경/에너지', '태양광, 풍력 등 친환경 에너지 시스템을 설계합니다.'),
('energy-manager', '에너지 관리 전문가', '환경/에너지', '에너지 사용량을 분석하고 절감 방안을 제안합니다.'),
('climate-data-analyst', '기후 데이터 분석가', '환경/에너지', '기후 데이터를 분석해 변화와 위험을 예측합니다.'),
('urban-planner', '도시계획가', '환경/에너지', '도시 공간과 교통, 주거 환경을 계획합니다.'),
('smart-farm-specialist', '스마트팜 전문가', '환경/에너지', '농업에 센서와 자동화 기술을 적용합니다.'),
('marine-scientist', '해양과학자', '환경/에너지', '바다 생태와 자원을 연구합니다.'),
('forest-manager', '산림 관리자', '환경/에너지', '숲과 산림 자원을 보호하고 관리합니다.'),
('esg-consultant', 'ESG 컨설턴트', '환경/에너지', '기업의 환경, 사회, 지배구조 전략을 지원합니다.'),
('water-treatment-engineer', '수처리 엔지니어', '환경/에너지', '물 정화와 하수 처리 시스템을 설계합니다.'),
('journalist', '기자', '미디어/문화', '사건과 이슈를 취재하고 기사로 전달합니다.'),
('broadcast-producer', '방송 프로듀서', '미디어/문화', '방송 프로그램의 기획과 제작을 총괄합니다.'),
('announcer', '아나운서', '미디어/문화', '방송과 행사에서 정보를 정확하게 전달합니다.'),
('advertising-planner', '광고 기획자', '미디어/문화', '브랜드 메시지를 전달하는 광고 전략을 기획합니다.'),
('social-media-manager', '소셜미디어 매니저', '미디어/문화', '온라인 채널 콘텐츠와 커뮤니케이션을 운영합니다.'),
('museum-curator', '큐레이터', '미디어/문화', '전시를 기획하고 작품과 자료를 관리합니다.'),
('performing-arts-producer', '공연기획자', '미디어/문화', '공연의 기획, 제작, 운영을 조율합니다.'),
('translator', '번역가', '미디어/문화', '언어와 문화를 고려해 글과 말을 옮깁니다.'),
('tourism-planner', '관광 기획자', '미디어/문화', '여행 상품과 지역 관광 콘텐츠를 기획합니다.'),
('sports-manager', '스포츠 매니저', '미디어/문화', '선수, 팀, 스포츠 행사의 운영을 관리합니다.');

INSERT INTO job (
    job_code,
    name,
    category,
    summary,
    description,
    required_skills,
    roadmap,
    avg_salary,
    outlook_label
)
SELECT
    job_code,
    name,
    category,
    summary,
    CONCAT(summary, ' 실제 현장에서는 문제 정의, 자료 조사, 협업, 결과 검증을 반복하며 사용자와 조직에 필요한 가치를 만듭니다.'),
    CASE category
        WHEN 'IT/개발' THEN '프로그래밍, 문제 해결, 버전 관리, API 이해, 협업 커뮤니케이션'
        WHEN '데이터/AI' THEN '통계, 데이터 처리, Python, 모델링, 시각화, 문제 정의'
        WHEN '디자인/콘텐츠' THEN '사용자 이해, 시각 표현, 스토리텔링, 도구 활용, 피드백 반영'
        WHEN '경영/기획' THEN '문제 정의, 문서화, 데이터 해석, 일정 관리, 이해관계자 조율'
        WHEN '교육/상담' THEN '경청, 설명력, 학습 설계, 상담 윤리, 성장 지원'
        WHEN '의료/보건' THEN '전문 지식, 관찰력, 윤리의식, 정확한 기록, 협업'
        WHEN '공학/제조' THEN '수학/과학 기초, 설계, 실험, 안전관리, 품질 개선'
        WHEN '금융/법률' THEN '분석력, 규정 이해, 문서 작성, 윤리의식, 숫자 감각'
        WHEN '환경/에너지' THEN '환경 지식, 데이터 분석, 현장 조사, 정책 이해, 지속가능성 관점'
        ELSE '커뮤니케이션, 기획력, 자료 조사, 표현력, 협업'
    END,
    CASE category
        WHEN 'IT/개발' THEN '기초 프로그래밍 → 작은 프로젝트 → 협업 도구 학습 → 포트폴리오 구축 → 실무 프로젝트 경험'
        WHEN '데이터/AI' THEN '통계 기초 → 데이터 분석 실습 → 모델링 학습 → 프로젝트 정리 → 서비스 적용 경험'
        WHEN '디자인/콘텐츠' THEN '기초 도구 학습 → 레퍼런스 분석 → 개인 작업물 제작 → 포트폴리오 정리 → 협업 경험'
        WHEN '경영/기획' THEN '산업 이해 → 문제 정의 연습 → 문서화 훈련 → 데이터 기반 제안 → 프로젝트 운영 경험'
        WHEN '교육/상담' THEN '전공 기초 → 현장 관찰 → 상담/교육 실습 → 사례 기록 → 자격과 경험 축적'
        WHEN '의료/보건' THEN '전공 기초 → 실습 경험 → 자격 취득 → 현장 적응 → 전문 분야 심화'
        WHEN '공학/제조' THEN '수학/과학 기초 → 설계 실습 → 장비/도구 학습 → 프로젝트 제작 → 현장 경험'
        WHEN '금융/법률' THEN '기초 법/회계 지식 → 사례 분석 → 자격 준비 → 문서 작성 → 실무 경험'
        WHEN '환경/에너지' THEN '환경/에너지 기초 → 데이터와 현장 조사 → 정책 이해 → 프로젝트 참여 → 전문 분야 심화'
        ELSE '분야 이해 → 콘텐츠 분석 → 제작 실습 → 포트폴리오 구축 → 현장 협업'
    END,
    CASE category
        WHEN 'IT/개발' THEN '3,800만원 이상'
        WHEN '데이터/AI' THEN '4,200만원 이상'
        WHEN '디자인/콘텐츠' THEN '3,200만원 이상'
        WHEN '경영/기획' THEN '3,500만원 이상'
        WHEN '교육/상담' THEN '3,000만원 이상'
        WHEN '의료/보건' THEN '3,600만원 이상'
        WHEN '공학/제조' THEN '4,000만원 이상'
        WHEN '금융/법률' THEN '4,000만원 이상'
        WHEN '환경/에너지' THEN '3,700만원 이상'
        ELSE '3,300만원 이상'
    END,
    CASE category
        WHEN 'IT/개발' THEN '매우 밝음'
        WHEN '데이터/AI' THEN '매우 밝음'
        WHEN '디자인/콘텐츠' THEN '밝음'
        WHEN '경영/기획' THEN '밝음'
        WHEN '교육/상담' THEN '안정적'
        WHEN '의료/보건' THEN '안정적'
        WHEN '공학/제조' THEN '밝음'
        WHEN '금융/법률' THEN '안정적'
        WHEN '환경/에너지' THEN '성장 중'
        ELSE '밝음'
    END
FROM seed_jobs;

CREATE TEMPORARY TABLE seed_category_holland (
    category VARCHAR(100) PRIMARY KEY,
    type1 VARCHAR(10) NOT NULL,
    type2 VARCHAR(10) NOT NULL,
    type3 VARCHAR(10) NOT NULL
);

INSERT INTO seed_category_holland (category, type1, type2, type3) VALUES
('IT/개발', 'I', 'C', 'R'),
('데이터/AI', 'I', 'C', 'R'),
('디자인/콘텐츠', 'A', 'S', 'E'),
('경영/기획', 'E', 'C', 'S'),
('교육/상담', 'S', 'E', 'A'),
('의료/보건', 'S', 'I', 'R'),
('공학/제조', 'R', 'I', 'C'),
('금융/법률', 'C', 'E', 'I'),
('환경/에너지', 'I', 'R', 'S'),
('미디어/문화', 'A', 'E', 'S');

INSERT INTO job_holland_code (job_id, holland_type, weight, sort_order)
SELECT j.job_id, h.type1, 1.00, 1
FROM job j
JOIN seed_jobs sj ON sj.job_code = j.job_code
JOIN seed_category_holland h ON h.category = j.category
UNION ALL
SELECT j.job_id, h.type2, 0.70, 2
FROM job j
JOIN seed_jobs sj ON sj.job_code = j.job_code
JOIN seed_category_holland h ON h.category = j.category
UNION ALL
SELECT j.job_id, h.type3, 0.50, 3
FROM job j
JOIN seed_jobs sj ON sj.job_code = j.job_code
JOIN seed_category_holland h ON h.category = j.category;

CREATE TEMPORARY TABLE seed_mentor_slot (
    slot_no INT PRIMARY KEY,
    priority INT NOT NULL,
    recommendation_weight DECIMAL(5, 2) NOT NULL
);

INSERT INTO seed_mentor_slot (slot_no, priority, recommendation_weight) VALUES
(1, 1, 1.00),
(2, 2, 0.90),
(3, 3, 0.80),
(4, 4, 0.70),
(5, 5, 0.60);

INSERT INTO mentor (
    name,
    job_title,
    company_name,
    profile_image_url,
    headline,
    short_description,
    interview_title,
    interview_content,
    career_summary,
    recommendation_count,
    is_active
)
SELECT
    CONCAT(j.name, ' 멘토 ', s.slot_no),
    CONCAT(j.name, ' 실무자'),
    CASE s.slot_no
        WHEN 1 THEN '커리어넷 파트너스'
        WHEN 2 THEN '현장실무 연구소'
        WHEN 3 THEN '미래직업 멘토랩'
        WHEN 4 THEN '청년진로 코칭센터'
        ELSE '프로페셔널 네트워크'
    END,
    CONCAT('https://placehold.co/320x320/e5e7eb/1a365d?text=Mentor+', s.slot_no),
    CASE s.slot_no
        WHEN 1 THEN CONCAT(j.name, ' 현장을 가장 가까이 설명하는 전문가')
        WHEN 2 THEN CONCAT(j.category, ' 커리어 성장을 안내하는 실무자')
        WHEN 3 THEN CONCAT(j.name, ' 준비 과정을 현실적으로 알려주는 멘토')
        WHEN 4 THEN CONCAT('학생 눈높이로 ', j.name, ' 업무를 풀어주는 전문가')
        ELSE CONCAT(j.name, ' 진로 선택을 도와주는 현장 멘토')
    END,
    CONCAT(j.summary, ' 학생 눈높이에 맞춰 업무, 준비 과정, 실무 역량을 설명합니다.'),
    CONCAT(j.name, ' 실무자 인터뷰'),
    CONCAT('이 멘토는 ', j.name, ' 분야에서 실제 프로젝트와 협업을 경험한 실무자입니다. 주요 업무, 필요한 역량, 준비 과정, 처음 시작할 때의 시행착오를 학생들이 이해하기 쉬운 언어로 설명합니다.'),
    CONCAT(j.category, ' 분야에서 실무 경험을 쌓았으며, 직무 이해와 진로 선택에 필요한 조언을 제공합니다.'),
    50 + ((j.job_id * 17 + s.slot_no * 29) % 450),
    TRUE
FROM job j
JOIN seed_jobs sj ON sj.job_code = j.job_code
CROSS JOIN seed_mentor_slot s;

INSERT INTO mentor_job (mentor_id, job_id, priority, recommendation_weight)
SELECT
    m.mentor_id,
    j.job_id,
    s.priority,
    s.recommendation_weight
FROM job j
JOIN seed_jobs sj ON sj.job_code = j.job_code
CROSS JOIN seed_mentor_slot s
JOIN mentor m ON m.name = CONCAT(j.name, ' 멘토 ', s.slot_no);

DROP TEMPORARY TABLE seed_mentor_slot;
DROP TEMPORARY TABLE seed_category_holland;
DROP TEMPORARY TABLE seed_jobs;
