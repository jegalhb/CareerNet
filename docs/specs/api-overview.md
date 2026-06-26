# REST API 개요

## 공통 응답 형식

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

## 인증/사용자

| Method | URL | 설명 |
| --- | --- | --- |
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| GET | `/api/users/{userId}` | 사용자 조회 |

## 진로 검사

| Method | URL | 설명 |
| --- | --- | --- |
| POST | `/api/assessments/holland` | Holland 검사 제출 |
| GET | `/api/assessments/users/{userId}` | 사용자별 검사 결과 목록 |
| GET | `/api/assessments/users/{userId}/{assessmentId}` | 사용자별 검사 결과 상세 |

## 직업/멘토

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/jobs` | 직업 목록 |
| GET | `/api/jobs?category=...&keyword=...` | 직업 필터 검색 |
| GET | `/api/jobs/{jobId}` | 직업 상세 |
| GET | `/api/jobs/{jobId}/mentors` | 직업별 멘토 목록 |
| GET | `/api/jobs/{jobId}/mentors/top` | 직업별 대표 멘토 |
| GET | `/api/mentors` | 멘토 목록 |
| GET | `/api/mentors/{mentorId}` | 멘토 상세 |

## 멘토링

| Method | URL | 설명 |
| --- | --- | --- |
| POST | `/api/mentoring-requests` | 멘토링 신청 |
| GET | `/api/mentoring-requests/users/{userId}` | 사용자별 멘토링 신청 내역 |

## 관심 직업

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/bookmarks/users/{userId}/jobs` | 사용자별 관심 직업 목록 |
| GET | `/api/bookmarks/jobs/{jobId}?userId=...` | 관심 직업 저장 여부 |
| POST | `/api/bookmarks/jobs` | 관심 직업 저장 |
| DELETE | `/api/bookmarks/users/{userId}/jobs/{jobId}` | 관심 직업 삭제 |

## 채용공고

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/recruitments` | 채용공고 목록 |
| GET | `/api/recruitments?latest=true` | 최신 채용공고 |
| GET | `/api/recruitments/{recruitmentId}` | 채용공고 상세 |

## 커뮤니티

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/community/posts` | 커뮤니티 게시글 목록 |
| GET | `/api/community/posts?latest=true` | 최신 게시글 |
| GET | `/api/community/posts/{postId}` | 게시글 상세 |
