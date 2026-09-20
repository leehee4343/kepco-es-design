# 켑코이에스(주) 디자인/퍼블리싱 가이드

> **켑코이에스(주) 사업관리시스템(PMS) 및 전자입찰시스템(SRM) 엔터프라이즈 디자인 & 퍼블리싱 표준 포털**

본 프로젝트는 켑코이에스(주)의 주요 업무 시스템인 **사업관리시스템(PMS)**과 **전자입찰시스템(SRM)**의 실제 상용 시스템 퍼블리싱 화면 및 디자인 시스템 표준 규격을 관리하는 통합 가이드 포털입니다.

- 🌐 **GitHub Pages Live Demo**: [https://leehee4343.github.io/kepco-es-design/](https://leehee4343.github.io/kepco-es-design/)
- 📘 **디자인 시스템 가이드**: [`DESIGN_GUIDE.md`](./DESIGN_GUIDE.md)
- 🤖 **AI 작업 인수인계 프로토콜**: [`AI_HANDOVER.md`](./AI_HANDOVER.md)

---

## 🖥️ 수록 화면 목록 (총 16종)

### 1. 사업관리시스템 (PMS)
| No | 화면명 | 파일 | 주요 기능 및 특징 |
|:---:|:---|:---|:---|
| 01 | **종합 대시보드** | [`Dashboard.html`](./Dashboard.html) | 실시간 경영목표 대비 실적, 프로젝트 파이프라인 현황, 도넛 차트 |
| 02 | **신규 프로젝트 등록** | [`ProjectRegister.html`](./ProjectRegister.html) | 계약 형태 선택과 사업 기본정보 입력을 페이지 내부 작업영역으로 제공 |
| 03 | **추진단계 프로젝트 현황** | [`ProjectSearch.html`](./ProjectSearch.html) | 다차원 조건 검색 필터, 프로젝트 목록 그리드, 엑셀 다운로드 |
| 04 | **프로젝트 상세** | [`ProjectDetail.html`](./ProjectDetail.html) | 투자·상환·원리금 차트, 이력 타임라인, 계획대비 실적 표 |
| 04-1 | **프로젝트 정보 입력** | [`ProjectPromotion.html`](./ProjectPromotion.html) | 추진 탭 5단계 스텝바(기본·세부·협력업체·사업심의·사업시행), 입력 폼, 조회 모달 3종 |
| 05 | **사업결산 현황** | [`BusinessSettlement.html`](./BusinessSettlement.html) | 결산일 기준 24건 실적 데이터 그리드, 상태 뱃지, 실시간 페이징 |
| 06 | **통계 종합현황** | [`Statistics.html`](./Statistics.html) | 연도별 주요 실적 지표, 계약형태 및 사업구분별 가로 바 차트 |
| 07 | **계획대비 실적현황** | [`PlanPerformance.html`](./PlanPerformance.html) | 자금관리 다차원 분석 그리드, 분기별 집행 실적 현황 |


### 2. 전자입찰시스템 (SRM)
| No | 화면명 | 파일 | 주요 기능 및 특징 |
|:---:|:---|:---|:---|
| 08 | **SRM 협력업체 대시보드** | [`SRMDashboardPartner.html`](./SRMDashboardPartner.html) | 나의 업무 현황 요약 카드, 입찰 참여 현황, 공지사항·양식 등 자료실 |
| 09 | **SRM 사업담당자 대시보드** | [`SRMDashboardBiz.html`](./SRMDashboardBiz.html) | 나의 발주계약 요청 건(최근 3건), 진행상황 확인 팝업, 사전견적 요청 현황, 공지사항·자료실 |
| 10 | **SRM 계약담당자 대시보드** | [`SRMDashboardContract.html`](./SRMDashboardContract.html) | 나의 업무 현황 8종, 발주·계약 진행상황별 업무 현황(단계 아이콘), 입찰·수의계약 진행현황, 협력업체 요청 처리 |
| 11 | **SRM 관리자 대시보드** | [`SRMDashboardAdmin.html`](./SRMDashboardAdmin.html) | 시스템 운영 요약, 로그인 추이(일별 중심), 전자 입찰 현황 도넛, 메일/SMS 발송 현황 |
| 12 | **SRM 공급자 로그인 창구** | [`SRMLogin.html`](./SRMLogin.html) | 켑코이에스 소개 배너, 공급자 전용 로그인 폼 |
| 13 | **협력업체 신청 등록 (5-Step)** | [`PartnerRegister.html`](./PartnerRegister.html) | 5단계 위저드 스텝바, 이용약관 동의, 기업 정보 입력 폼 (팝업 화면) |
| 14 | **SRM 입찰계획 현황 (7-Step)** | [`StepWorkflow.html`](./StepWorkflow.html) | 예정가격 산출기초조서 등록, 전자결재 요청, 첨부파일 업로드 |
| 15 | **SRM 입찰공고 상세** | [`SRMDetail.html`](./SRMDetail.html) | 요약 표, 8단계 업무 탐색 탭, 첨부파일, 입찰계획으로 되돌리기 모달 |

---

## 🎨 디자인 시스템 요약

- **서체**: Pretendard (`400`, `700`; Bold는 메뉴·타이틀·버튼만 허용)
- **브랜드 컬러 토큰**:
  - `Primary Blue`: `#1976d2` (전체 시스템 기본색)
  - `Point Orange`: `#ff7a00` (강조 및 진행 상태)
  - `Point Green`: `#00b894` (성공 및 완료 상태)
  - `Point Red`: `#ef4444` (위험 및 오류 상태)
  - 그래프와 차트의 데이터 구분 색상은 예외
  - `Background`: `#f4f6fa` (페이지), `#ffffff` (카드·표·모달)
- **레이아웃 규격**:
  - 글로벌 헤더 높이: `56px` 고정
  - 좌측 사이드바 너비: `210px` 고정 (접힘 `64px`)
  - 하단 표준 푸터: `38px` 고정, 짙은 회색 `#334155` (`&copy; 2026 KEPCO Energy Solution Co., Ltd. All Rights Reserved.`)

---

## 📁 디렉토리 구조

```plaintext
├── index.html              # 켑코이에스(주) 디자인/퍼블리싱 가이드 마스터 런처 포털
├── Dashboard.html           # PMS 종합 대시보드
├── ProjectRegister.html     # PMS 신규 프로젝트 등록
├── ProjectSearch.html       # PMS 추진단계 프로젝트 현황 (검색 및 조회)
├── ProjectDetail.html       # PMS 프로젝트 상세 (투자·상환·타임라인)
├── ProjectPromotion.html    # PMS 프로젝트 정보 입력 (5단계 정보 입력 화면)
├── BusinessSettlement.html  # PMS 사업결산 현황
├── Statistics.html          # PMS 통계 종합현황 (연도별 분석)
├── StepWorkflow.html        # SRM 입찰계획 현황 (예정가/예비가 산출, 7-Step)
├── SRMDetail.html           # SRM 입찰공고 상세 (탭 기반 상세)
├── PlanPerformance.html     # PMS 계획대비 실적현황 (자금관리)
├── SRMDashboardPartner.html # SRM 협력업체 대시보드
├── SRMDashboardBiz.html     # SRM 사업담당자 대시보드
├── SRMDashboardContract.html # SRM 계약담당자 대시보드
├── SRMDashboardAdmin.html   # SRM 관리자 대시보드
├── SRMLogin.html            # SRM 공급자 로그인 창구
├── PartnerRegister.html     # SRM 협력업체 신청 등록 (5-Step)
├── css/
│   └── style.css            # 통합 엔터프라이즈 디자인 시스템 CSS (토큰, 컴포넌트, 전 화면 통합)
├── js/
│   └── dashboard.js         # 대시보드 인터랙션 & SVG 차트 렌더링 스크립트
├── assets/
│   ├── logo.png             # 켑코이에스(주) 공식 로고
│   └── thumbnails/          # 가이드 포털용 고해상도 카드 썸네일 (전 화면)
├── docs/                    # 설계 사양서(PDF), 디자인 참고 시안, 메뉴구조도(Excel), 기획서(planning)
├── DESIGN_GUIDE.md          # 공식 디자인 시스템 가이드라인 규격서
├── CLAUDE.md                # AI 어시스턴트 프로젝트 작업 지침
└── AI_HANDOVER.md           # 토큰 소진 시 새 세션 인수인계 마스터 프롬프트
```

---

## 📄 라이선스 및 저작권
&copy; 2026 KEPCO Energy Solution Co., Ltd. All Rights Reserved.
