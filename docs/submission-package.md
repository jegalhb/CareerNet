# CareerNet 제출 산출물 안내

이 문서는 CareerNet 프로젝트를 소개하거나 제출할 때 함께 사용할 산출물의 위치와 용도를 정리합니다.

## 산출물 구성

| 구분 | 파일 | 용도 |
| --- | --- | --- |
| 프로젝트 소개 | `docs/specs/project-introduction.md` | 프로젝트 목적, 주요 기능, 기술 구조 설명 |
| 사용자 요구사항 | `docs/specs/user-requirements.md` | 사용자/서비스 관점의 요구사항 정리 |
| API 개요 | `docs/specs/api-overview.md` | REST API 목록과 주요 응답 흐름 |
| 테스트 시나리오 | `docs/specs/test-scenarios.md` | 발표 전 기능 검증 체크리스트 |
| ERD | `docs/diagrams/careernet-erd.drawio` | diagrams.net에서 열 수 있는 DB 관계도 |
| 프로그램 흐름도 | `docs/figma/05-program-flow-chart.svg` | Figma에서 가져올 수 있는 전체 프로그램 흐름 |
| 기존 와이어프레임 | `docs/figma/01-wireframe-overview.svg` | 화면 구성 초안 설명용 |
| 사용자 요구사항 시각화 | `docs/figma/02-user-requirements.svg` | 요구사항을 카드 형태로 시각화 |
| USERFLOW | `docs/figma/03-user-flow.svg` | 사용자의 주요 이동 흐름 |
| 화면설계서 | `docs/figma/04-screen-spec.svg` | 주요 화면별 UI 구성과 데이터 연결 |

## 사용 방법

- diagrams.net: `docs/diagrams/careernet-erd.drawio` 파일을 열면 ERD를 바로 확인할 수 있습니다.
- Figma: `docs/figma/*.svg` 파일을 드래그 앤 드롭 또는 `File > Place image`로 가져와 편집할 수 있습니다.
- GitHub: Markdown 문서는 그대로 열람 가능하며, SVG는 브라우저에서 바로 미리보기할 수 있습니다.

## 발표 설명 흐름 추천

1. `project-introduction.md`로 프로젝트 목적과 대상 사용자 설명
2. `02-user-requirements.svg`로 왜 이 기능들이 필요한지 설명
3. `03-user-flow.svg`로 사용자가 어떤 순서로 서비스를 이용하는지 설명
4. `careernet-erd.drawio`로 데이터가 어떻게 저장되고 연결되는지 설명
5. `04-screen-spec.svg`로 화면과 API 연결 상태 설명
6. `05-program-flow-chart.svg`로 React, REST API, Spring MVC, JPA, MySQL 흐름 설명
7. `test-scenarios.md`로 실제 검증 가능한 시나리오 제시
