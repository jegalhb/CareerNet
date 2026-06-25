# CareerNet 통합 프로젝트

이 프로젝트는 WebStorm에 있던 CareerNet 프론트엔드를 IntelliJ에서 함께 열 수 있도록 이식한 통합 구조입니다.

## 구성

```text
CareerNet
├─ frontend
│  └─ React + Vite 프론트엔드
└─ backend
   └─ Spring Boot 백엔드 준비 영역
```

## 설계 문서

```text
docs/data-model.md  # MySQL 기준 데이터 구조
docs/page-flow.md   # 진로검사 → 직업탐색 → 멘토링 페이지 흐름
```

## 이식 기준

- 기존 WebStorm 프로젝트의 프론트엔드 기능 코드는 변경하지 않습니다.
- `node_modules`, `dist` 같은 생성물은 새 프로젝트에 포함하지 않습니다.
- 기존에 구현하다 멈춘 `HollandMatcherService.processAssessment()` 흐름은 백엔드의 적성검사 도메인 위치에 미리 배치합니다.
- 현재 백엔드는 프론트와 아직 연결하지 않은 준비 단계입니다.

## 백엔드 준비 내용

`backend`에는 Holland 적성검사 결과 처리 흐름을 Spring 계층으로 미리 나누어 두었습니다.

```text
backend/src/main/java/com/careernet
├─ CareernetBackendApplication.java
├─ assessment
│  ├─ controller
│  ├─ dto
│  ├─ repository
│  └─ service
└─ job
   ├─ domain
   └─ repository
```

현재는 DB 연결 전 단계라 `MemoryJobRepository`, `MemoryAssessmentRepository`를 사용합니다.
이후 Oracle/MyBatis/JPA를 붙이면 repository 구현체를 DB 기반으로 교체하면 됩니다.

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

Gradle wrapper는 아직 포함하지 않았습니다. IntelliJ에서 `backend/build.gradle`을 Gradle 프로젝트로 인식시켜 사용할 수 있습니다.
