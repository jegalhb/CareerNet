CREATE TABLE recruitment (
    recruitment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(150) NOT NULL,
    title VARCHAR(180) NOT NULL,
    location VARCHAR(100),
    employment_type VARCHAR(60),
    career_level VARCHAR(60),
    deadline_date DATE,
    source_url VARCHAR(500),
    summary VARCHAR(500),
    description TEXT,
    job_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_recruitment_job
        FOREIGN KEY (job_id) REFERENCES job(job_id)
);

CREATE TABLE community_post (
    post_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(40) NOT NULL,
    title VARCHAR(180) NOT NULL,
    author VARCHAR(80) NOT NULL,
    summary VARCHAR(500),
    content TEXT,
    view_count INT NOT NULL DEFAULT 0,
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

CREATE TABLE job_bookmark (
    bookmark_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_bookmark_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    CONSTRAINT fk_job_bookmark_job
        FOREIGN KEY (job_id) REFERENCES job(job_id),
    CONSTRAINT uq_job_bookmark_user_job UNIQUE (user_id, job_id)
);

CREATE INDEX idx_recruitment_deadline ON recruitment(deadline_date);
CREATE INDEX idx_recruitment_job ON recruitment(job_id);
CREATE INDEX idx_community_post_created ON community_post(pinned, created_at);
CREATE INDEX idx_job_bookmark_user ON job_bookmark(user_id, created_at);

INSERT INTO recruitment (
    company_name,
    title,
    location,
    employment_type,
    career_level,
    deadline_date,
    source_url,
    summary,
    description,
    job_id
) VALUES
('넥스트커리어랩', '주니어 백엔드 개발자 채용', '서울 강남구', '정규직', '신입/주니어', '2026-07-31', 'https://example.com/recruit/backend-junior', 'Spring Boot 기반 REST API와 데이터 처리 기능을 함께 개발합니다.', '회원, 진단, 추천 서비스의 API를 개발하고 MySQL 기반 데이터를 안정적으로 다룹니다. Java 기본기와 협업 경험을 중요하게 봅니다.', (SELECT job_id FROM job WHERE job_code = 'backend-developer')),
('브릿지에듀', '진로 교육 콘텐츠 기획자', '경기 성남시', '정규직', '경력 1년 이상', '2026-08-05', 'https://example.com/recruit/education-content', '청소년 진로 탐색 콘텐츠와 워크북을 기획합니다.', '학생들이 쉽게 이해할 수 있는 직업 소개 콘텐츠, 검사 해석 자료, 수업 활동지를 설계합니다.', (SELECT job_id FROM job WHERE job_code = 'education-content-developer')),
('데이터웨이브', '데이터 분석가 채용', '서울 마포구', '정규직', '신입 가능', '2026-08-12', 'https://example.com/recruit/data-analyst', '서비스 지표를 분석하고 사용자 행동 인사이트를 도출합니다.', 'SQL과 대시보드를 활용해 학습자 이용 흐름을 분석하고 제품 개선 방향을 제안합니다.', (SELECT job_id FROM job WHERE job_code = 'data-analyst')),
('마인드케어센터', '청소년 상담사 모집', '부산 해운대구', '계약직', '경력 2년 이상', '2026-07-25', 'https://example.com/recruit/youth-counselor', '청소년의 진로, 관계, 심리 고민을 상담합니다.', '개별 상담과 집단 프로그램을 운영하며 학교 및 보호자와 협력합니다.', (SELECT job_id FROM job WHERE job_code = 'youth-counselor')),
('클라우드허브', '클라우드 엔지니어 공개채용', '서울 영등포구', '정규직', '주니어/미들', '2026-08-18', 'https://example.com/recruit/cloud-engineer', 'AWS 기반 인프라 구축과 운영 자동화를 담당합니다.', '컨테이너, 배포 자동화, 모니터링 환경을 구성하며 안정적인 서비스 운영을 지원합니다.', (SELECT job_id FROM job WHERE job_code = 'cloud-engineer')),
('디자인스튜디오 온', 'UX/UI 디자이너 채용', '서울 성동구', '정규직', '신입 가능', '2026-08-02', 'https://example.com/recruit/ux-ui-designer', '웹/앱 서비스 화면과 사용자 경험을 설계합니다.', '사용자 리서치, 와이어프레임, 프로토타입 제작을 통해 제품 사용성을 개선합니다.', (SELECT job_id FROM job WHERE job_code = 'ux-ui-designer')),
('그린에너지솔루션', '신재생에너지 엔지니어', '대전 유성구', '정규직', '경력 1년 이상', '2026-08-20', 'https://example.com/recruit/renewable-energy', '태양광 설비와 에너지 효율화 프로젝트를 수행합니다.', '발전량 데이터 분석, 설비 점검, 고객 제안 자료 작성을 함께 담당합니다.', (SELECT job_id FROM job WHERE job_code = 'renewable-energy-engineer')),
('메디온헬스', '임상 데이터 코디네이터', '서울 송파구', '정규직', '신입/주니어', '2026-08-09', 'https://example.com/recruit/clinical-data', '의료 연구 데이터를 정리하고 품질을 관리합니다.', '임상 자료를 표준화하고 연구진과 협업해 데이터 정확도를 높입니다.', (SELECT job_id FROM job WHERE job_code = 'clinical-lab-technologist')),
('로보메이커스', '로봇 제어 소프트웨어 개발자', '경기 수원시', '정규직', '경력 2년 이상', '2026-08-27', 'https://example.com/recruit/robotics', '로봇 제어 알고리즘과 운영 도구를 개발합니다.', '센서 데이터 처리, 제어 로직 구현, 현장 테스트를 통해 로봇 서비스를 고도화합니다.', (SELECT job_id FROM job WHERE job_code = 'robotics-engineer')),
('핀업파이낸스', '핀테크 서비스 기획자', '서울 중구', '정규직', '주니어/미들', '2026-09-03', 'https://example.com/recruit/fintech-planner', '간편결제와 자산관리 서비스 기능을 기획합니다.', '금융 규정과 사용자 니즈를 함께 고려해 요구사항과 화면 정책을 정리합니다.', (SELECT job_id FROM job WHERE job_code = 'fintech-planner')),
('컬처링크', '소셜미디어 매니저', '서울 용산구', '계약직', '신입 가능', '2026-08-16', 'https://example.com/recruit/social-media', '브랜드 SNS 콘텐츠와 커뮤니케이션을 운영합니다.', '콘텐츠 캘린더를 관리하고 캠페인 성과를 분석해 개선안을 제안합니다.', (SELECT job_id FROM job WHERE job_code = 'social-media-manager')),
('시티플랜랩', '도시계획 프로젝트 매니저', '인천 연수구', '정규직', '경력 3년 이상', '2026-09-10', 'https://example.com/recruit/urban-planner', '지역 개발과 도시 공간 개선 프로젝트를 담당합니다.', '조사 자료를 분석하고 주민, 행정기관, 전문가 협업을 조율합니다.', (SELECT job_id FROM job WHERE job_code = 'urban-planner'));

INSERT INTO community_post (
    category,
    title,
    author,
    summary,
    content,
    view_count,
    pinned,
    created_at
) VALUES
('공지', '커리어넷 진로 로드맵 기능 안내', 'CareerNet 운영팀', '검사 결과, 관심 직업, 멘토링 신청을 한 곳에서 확인할 수 있습니다.', '마이페이지의 내 진로 로드맵에서 진단, 직업선택, 역량강화, 멘토링, 취업 준비 단계를 확인할 수 있습니다. 단계별 체크리스트를 활용해 다음 행동을 정리해보세요.', 124, TRUE, '2026-06-20 09:10:00'),
('새소식', '여름방학 진로 탐색 추천 코스', 'CareerNet 운영팀', '방학 기간에 직업 탐색과 멘토링을 함께 진행하는 방법을 소개합니다.', '관심 직업을 3개 이상 저장하고, 각 직업의 멘토 인터뷰를 읽은 뒤 실제 멘토링 신청으로 이어가면 진로 방향을 더 구체화할 수 있습니다.', 87, FALSE, '2026-06-22 14:30:00'),
('후기', '데이터 분석가 멘토링 후기', '김민서', '멘토링을 통해 SQL 공부 방향과 포트폴리오 주제를 정했습니다.', '데이터 분석가 직무가 막연했는데 실제 업무에서 어떤 데이터를 다루는지 들으면서 준비 방향이 선명해졌습니다.', 73, FALSE, '2026-06-23 10:20:00'),
('질문', 'AI 엔지니어와 데이터 사이언티스트 차이가 궁금합니다', '이준호', '두 직업이 비슷해 보여서 공부 순서를 정하기 어렵습니다.', 'AI 모델 개발과 데이터 분석 중심 업무가 어떻게 다른지, 고등학생 입장에서 어떤 기초를 먼저 공부하면 좋을지 궁금합니다.', 59, FALSE, '2026-06-23 16:45:00'),
('새소식', '신규 직업 정보 100종 업데이트', 'CareerNet 운영팀', '직업 정보 API에 다양한 산업군의 직업 데이터가 추가되었습니다.', 'IT, 데이터, 디자인, 교육, 의료, 공학, 금융, 환경, 미디어 분야의 직업 정보와 Holland 유형 매칭 데이터를 확장했습니다.', 142, TRUE, '2026-06-24 08:50:00'),
('후기', 'UX/UI 디자이너 직업 탐색 기록', '박서연', '직업 상세와 멘토 정보를 보며 필요한 역량을 정리했습니다.', '디자인 툴만 중요한 줄 알았는데 사용자 조사와 문제 정의가 핵심이라는 것을 알게 되었습니다.', 48, FALSE, '2026-06-24 13:15:00'),
('질문', '멘토링 신청 후에는 어떻게 진행되나요?', '최하늘', '신청 상태와 준비해야 할 질문이 궁금합니다.', '멘토링 신청을 눌렀는데 이후 진행 방식과 질문 준비 방법을 알고 싶습니다.', 36, FALSE, '2026-06-25 09:05:00'),
('새소식', '채용공고 페이지 베타 오픈', 'CareerNet 운영팀', '직업 정보와 연결된 채용공고를 확인할 수 있습니다.', '관심 직업을 탐색한 뒤 관련 채용공고를 함께 확인해 실제 시장에서 어떤 역량을 요구하는지 비교해보세요.', 66, FALSE, '2026-06-25 11:40:00');
