# CareerNet 통합 프로젝트

CareerNet은 진로를 탐색하기 어려운 중고등학생과 대학생이 검사를 통해 자신에게 맞는 직업을 찾고, 그 직업과 연결된 실무자 멘토를 탐색할 수 있도록 구성하는 프로젝트입니다.

현재 구조는 WebStorm에 있던 React/Vite 프론트엔드를 IntelliJ에서 함께 열 수 있도록 이식하고, Spring Boot 백엔드를 같은 루트 안에 둔 통합 구조입니다.

## 현재 버전

```text
v0.11.0
```

## 프로젝트 구조

```text
CareerNet
├─ frontend
│  └─ React + Vite 프론트엔드
├─ backend
│  └─ Spring Boot + MySQL 백엔드
├─ docs
│  ├─ diagrams
│  ├─ figma
│  ├─ specs
│  ├─ data-model.md
│  └─ page-flow.md
└─ README.md
```

## 주요 흐름

```text
진로 검사
→ 검사 결과 분석
→ 직업 추천
→ 직업 상세 탐색
→ 관련 멘토 추천
→ 멘토 상세 조회
```

## 기술 방향

- Frontend: React, Vite, React Router
- Backend: Spring Boot, Spring MVC, Spring Data JPA
- Database: MySQL
- Migration: Flyway
- API Style: REST API
- Architecture: Controller → Service → Repository 3계층 구조

## 설계 문서

```text
docs/data-model.md  # MySQL 기준 데이터 구조
docs/page-flow.md   # 진로검사 → 직업탐색 → 멘토링 페이지 흐름
docs/submission-package.md  # 제출 산출물 사용 안내
docs/specs/project-introduction.md  # 프로젝트 소개 문서
docs/specs/user-requirements.md     # 사용자 요구사항 정의서
docs/specs/api-overview.md          # REST API 개요
docs/specs/test-scenarios.md        # 테스트 시나리오
docs/diagrams/careernet-erd.drawio  # diagrams.net용 ERD
docs/figma/*.svg                    # Figma용 와이어프레임/유저플로우/화면설계서/흐름도
```

## 백엔드 구성

```text
backend/src/main/java/com/careernet
├─ common
│  ├─ domain
│  ├─ exception
│  └─ response
├─ user
├─ assessment
├─ job
├─ mentor
├─ mentoring
├─ recruitment
├─ community
└─ bookmark
```

## 현재 API

```text
POST /api/auth/signup
POST /api/auth/login

GET /api/users/{userId}

POST /api/assessments/holland
GET /api/assessments/users/{userId}
GET /api/assessments/users/{userId}/{assessmentId}

GET /api/jobs
GET /api/jobs?category=...&keyword=...
GET /api/jobs/{jobId}
GET /api/jobs/{jobId}/mentors
GET /api/jobs/{jobId}/mentors/top

GET /api/mentors
GET /api/mentors?keyword=...
GET /api/mentors/{mentorId}

POST /api/mentoring-requests
GET /api/mentoring-requests/users/{userId}

GET /api/recruitments
GET /api/recruitments?latest=true
GET /api/recruitments/{recruitmentId}

GET /api/community/posts
GET /api/community/posts?latest=true
GET /api/community/posts/{postId}

GET /api/bookmarks/users/{userId}/jobs
GET /api/bookmarks/jobs/{jobId}?userId=...
POST /api/bookmarks/jobs
DELETE /api/bookmarks/users/{userId}/jobs/{jobId}
```

## 데이터 구성

Flyway 마이그레이션으로 아래 데이터를 준비합니다.

```text
V1__init_schema.sql
- app_user
- assessment_result
- assessment_answer
- assessment_recommendation
- job
- job_holland_code
- mentor
- mentor_job
- mentoring_request

V2__seed_jobs_and_mentors.sql
- 직업 100개
- 직업별 Holland 유형 3개
- 직업당 멘토 5명
- 총 멘토 500명
- 직업-멘토 연결 500개

V3__create_recruitment_community_bookmark.sql
- 채용공고 12건
- 커뮤니티 게시글 8건
- 사용자별 직업 즐겨찾기 테이블
```

외부 직업 정보 Open API는 추후 인증키와 호출 정책이 확정되면 연동할 수 있습니다. 현재는 백엔드와 프론트 연결 테스트가 가능하도록 MySQL seed 데이터를 우선 구성했습니다.

## 실행 방향

프론트엔드:

```powershell
cd frontend
npm install
npm run dev
```

백엔드:

```powershell
cd backend
docker compose up -d mysql
$env:DB_PASSWORD="careernet"
.\gradlew.bat bootRun
```

로컬 MySQL이 이미 있다면 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` 환경변수로 접속 정보를 바꿔 실행합니다.

## 버전 이력

### v0.11.0

- 메인 페이지 중앙 탭 UI를 카드형 세그먼트 컨트롤로 개선
- 전체 서비스 메뉴에서 로그인 필요 기능을 구분 표시
- 비로그인 사용자가 마이페이지성 기능을 누르면 회원가입/로그인 흐름으로 이동하도록 정리
- 전체 서비스 메뉴의 각 항목을 설명이 있는 서비스 카드로 개선
- 아이디 찾기 화면을 회원가입 화면과 유사한 인증 전용 레이아웃으로 개선
- 비밀번호 찾기 화면을 인증 단계 안내와 입력 폼을 포함한 화면으로 개선
- 프론트 빌드 검증

### v0.10.0

- 제출/소개용 산출물 안내 문서 추가
- 프로젝트 소개 문서 추가
- 사용자 요구사항 정의서 추가
- REST API 개요 문서 추가
- 테스트 시나리오 문서 추가
- diagrams.net에서 열 수 있는 ERD `.drawio` 파일 추가
- Figma에서 가져올 수 있는 SVG 산출물 추가
  - 기존 와이어프레임 개요
  - 사용자 요구사항 시각화
  - USERFLOW
  - 화면설계서
  - 프로그램 플로우 차트
- README의 문서 구조와 현재 버전을 v0.10.0으로 갱신

### v0.9.0

- 채용공고 도메인, Repository, Service, Controller, DTO 추가
- 커뮤니티 게시글 도메인, Repository, Service, Controller, DTO 추가
- 사용자별 직업 즐겨찾기 도메인과 생성/조회/삭제 API 추가
- Flyway V3 마이그레이션으로 `recruitment`, `community_post`, `job_bookmark` 테이블 및 테스트 데이터 추가
- 프론트 채용공고 목록/상세 페이지 추가
- 프론트 커뮤니티 목록/상세 페이지 추가
- 마이페이지 `/mypage/bookmarks` 탭과 즐겨찾기 API 연결
- 직업 상세 화면에 관심 직업 저장/해제 버튼 추가
- 메인 홈의 추천 서비스, 인기 서비스, 새소식 영역 구현
- 직업/학과 슬라이더를 현실 이미지 기반 UI로 정리하고 직업 슬라이더를 백엔드 Jobs API와 연결
- 직업 목록 카드의 이모지 중심 UI를 이미지 카드로 변경
- 전체 메뉴의 주요 링크를 실제 라우트로 연결
- 기존 개발 DB의 실패한 Flyway V2 이력 정리 후 V2/V3 마이그레이션 정상 적용 확인
- 백엔드 컴파일, 프론트 빌드, 채용공고/커뮤니티/즐겨찾기 API 호출 검증

### v0.8.0

- 사용자별 검사 결과 목록 조회 API 추가
- 사용자별 검사 결과 상세 조회 API 추가
- 검사 결과 상세 응답에 추천 직업 목록 포함
- 프론트 마이페이지 기본 화면 추가
- 마이페이지에 내 프로필, 내 진로 로드맵, 검사 결과, 멘토링 내역 탭 구성
- 메인 페이지의 내 진로 로드맵 카드에서 `/mypage/roadmap` 이동 연결
- 백엔드 컴파일, 프론트 빌드, 검사 저장/조회, 멘토링 내역 조회 API 검증

### v0.7.0

- 멘토링 신청 API 추가
- 사용자별 멘토링 신청 목록 조회 API 추가
- `REQUESTED` 상태의 동일 사용자/멘토/직업 중복 신청 방지
- 프론트 멘토링 페이지에서 멘토 상세 조회 후 연결 직업 기준으로 신청 저장
- 비로그인 사용자의 멘토링 신청 안내 처리
- 멘토링 신청 메시지 입력 UI 추가
- 백엔드 컴파일, 프론트 빌드, 신청 저장/목록 조회/중복 방지 API 검증

### v0.6.0

- 회원가입 API 추가
- 로그인 API 추가
- 사용자 조회 API 추가
- BCrypt 기반 비밀번호 해시 저장 구조 추가
- 프론트 인증 Context를 localStorage mock에서 백엔드 Auth API 호출 방식으로 변경
- 검사 제출 시 로그인 사용자의 `userId`로 Holland 검사 결과 저장 API 호출
- 직업 목록/상세 페이지를 백엔드 Jobs API와 연결
- 멘토링 페이지를 백엔드 Mentors API와 연결
- Vite 프론트 빌드와 백엔드 컴파일 검증
- 회원가입 → 로그인 → 사용자 조회 → 검사 저장 → 직업/멘토 조회 API 흐름 검증

### v0.5.0

- Docker Compose 기반 MySQL 8.4 검증 환경 추가
- `compileJava` 기준 백엔드 컴파일 검증
- Flyway V1/V2 마이그레이션 실행 검증
- 직업 100개, Holland 코드 300개, 멘토 500명, 직업-멘토 연결 500개 적재 확인
- 직업/멘토 조회 API와 Holland 검사 저장 API 응답 확인
- MySQL 임시 테이블 재사용으로 발생하던 seed SQL 오류 수정

### v0.4.0

- Flyway seed 데이터 추가
- 직업 100개 생성
- 직업별 Holland 유형 데이터 생성
- 직업당 멘토 5명씩 총 500명 생성
- 직업-멘토 연결 데이터 생성
- README를 한글 기준으로 재정리
- 앞으로 작업 시 README에 버전 이력과 작업 요약을 남기는 규칙 추가

### v0.3.0

- 직업 조회 REST API 추가
- 멘토 조회 REST API 추가
- 직업별 멘토 목록 조회 API 추가
- 직업별 대표 멘토 조회 API 추가
- Job/Mentor 응답 DTO 구성

### v0.2.0

- Spring Boot 백엔드 기반 구성
- MySQL, JPA, Flyway, Validation 의존성 추가
- 공통 응답 `ApiResponse` 추가
- 공통 예외 처리 구조 추가
- 핵심 엔티티와 Repository 구성
- Holland 검사 결과 저장 흐름을 JPA 기반으로 정리

### v0.1.0

- WebStorm CareerNet 프론트엔드를 IntelliJ 통합 프로젝트로 이식
- `frontend`, `backend` 병렬 구조 생성
- 기존 Holland 검사 백엔드 초안을 적절한 백엔드 패키지로 배치

