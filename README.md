# CareerNet 통합 프로젝트

CareerNet은 진로를 탐색하기 어려운 중고등학생과 대학생이 검사를 통해 자신에게 맞는 직업을 찾고, 그 직업과 연결된 실무자 멘토를 탐색할 수 있도록 구성하는 프로젝트입니다.

현재 구조는 WebStorm에 있던 React/Vite 프론트엔드를 IntelliJ에서 함께 열 수 있도록 이식하고, Spring Boot 백엔드를 같은 루트 안에 둔 통합 구조입니다.

## 현재 버전

```text
v0.4.0
```

## 프로젝트 구조

```text
CareerNet
├─ frontend
│  └─ React + Vite 프론트엔드
├─ backend
│  └─ Spring Boot + MySQL 백엔드
├─ docs
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
└─ mentoring
```

## 현재 API

```text
POST /api/assessments/holland

GET /api/jobs
GET /api/jobs?category=...&keyword=...
GET /api/jobs/{jobId}
GET /api/jobs/{jobId}/mentors
GET /api/jobs/{jobId}/mentors/top

GET /api/mentors
GET /api/mentors?keyword=...
GET /api/mentors/{mentorId}
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
gradle bootRun
```

현재 Gradle wrapper는 포함되어 있지 않습니다. IntelliJ에서 `backend/build.gradle`을 Gradle 프로젝트로 인식시켜 사용하는 방향을 권장합니다.

## 버전 이력

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

## 작업 기록 규칙

앞으로 기능을 추가하거나 구조를 변경할 때는 아래 내용을 README에 함께 기록합니다.

```text
버전
작업 요약
추가/변경된 주요 파일
다음 작업 후보
```
