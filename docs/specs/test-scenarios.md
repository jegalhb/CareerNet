# 테스트 시나리오

## 사전 조건

```powershell
cd backend
docker compose up -d mysql
$env:DB_PASSWORD="careernet"
.\gradlew.bat bootRun

cd frontend
npm install
npm run dev
```

## 핵심 시나리오

### TS-01 회원가입/로그인

1. 메인 페이지 접속
2. 회원가입 페이지 이동
3. 이름, 이메일, 비밀번호, 학력, 관심 분야 입력
4. 회원가입 완료 후 로그인 상태 확인
5. 새로고침 후 사용자 정보 복원 확인

### TS-02 진로 검사와 결과 저장

1. `/design` 이동
2. Holland 검사 진행
3. 결과 제출
4. 추천 직업 표시 확인
5. `/mypage/tests`에서 검사 결과 목록과 상세 확인

### TS-03 직업 탐색과 관심 직업

1. `/jobs` 이동
2. 직업 키워드 검색
3. 직업 상세 페이지 이동
4. 관심 직업 저장 버튼 클릭
5. `/mypage/bookmarks`에서 저장된 직업 확인
6. 다시 상세 페이지에서 저장 해제 확인

### TS-04 멘토링 신청

1. `/mentoring` 이동
2. 멘토 상세 정보 확인
3. 로그인 상태에서 신청 메시지 입력
4. 멘토링 신청
5. `/mypage/mentoring`에서 신청 내역 확인

### TS-05 채용공고

1. `/recruit` 이동
2. 채용공고 목록 확인
3. 키워드 검색
4. 채용공고 상세 이동
5. 연결된 직업 정보 보기 클릭

### TS-06 커뮤니티

1. `/community` 이동
2. 게시글 목록 확인
3. 공지/새소식/질문/후기 게시글 상세 이동
4. 메인 페이지 새소식 탭에서 최신 게시글 연결 확인

### TS-07 메인 페이지 로그인 분기

1. 로그아웃 상태로 메인 페이지 접속
2. 진로 로드맵 영역에 비회원 안내 UI가 표시되는지 확인
3. 로그인
4. 메인 페이지 진로 로드맵 영역에 개인 로드맵이 표시되는지 확인

## 빌드 검증

```powershell
cd backend
.\gradlew.bat compileJava

cd frontend
npm.cmd run build
```
