# KEPCO ES 프로젝트 개발 및 디자인 시스템 지침 (CLAUDE & GPT 공통 가이드)

> 본 문서는 **Claude, ChatGPT, Gemini** 등 LLM 기반 코딩 어시스턴트가 프로젝트 컨텍스트를 즉시 파악하고 일관된 디자인/UI/UX 및 코딩 원칙으로 작업을 이어갈 수 있도록 표준화된 AI 프로토콜 문서입니다.

---

## 1. 프로젝트 요약 (Project Overview)
- **고객사**: 켑코이에스(주) (KEPCO Energy Solution)
- **시스템**: 사업관리시스템 (PMS) & 전자입찰시스템 (SRM) 화면 UI/UX 프로토타입
- **현재 상태**: 
  - PMS 7개 화면 + SRM 대시보드/로그인/협력업체신청 3개 화면 + 통합 포털(`index.html`) 총 10개 화면 완료.
  - 다음 작업 대상: `docs/specs_pdf/[참고] SRM 상세화면.pdf`를 바탕으로 **`SRMDetail.html`** 신규 구축.

---

## 2. 필수 기술 스택 및 코딩 제약 (Tech Constraints)
1. **HTML/CSS/JS Core**:
   - 프레임워크 없는 순수 **HTML5 + Vanilla CSS + Vanilla JS** 사용.
   - ⚠️ **TailwindCSS 사용 금지**. 모든 스타일은 중앙 집중형 스타일시트 [`css/style.css`](css/style.css)에 정의.
2. **반응형 & 크로스 브라우징**:
   - 최소 1280px ~ 1920px 해상도에서 완벽한 레이아웃 유지.
   - 이미지 태그는 부모 컨테이너를 벗어나지 않도록 `max-width: 100%`, 로고는 `height: 25px~28px` 엄격 제한.
3. **경로 표준**:
   - 모든 화면 HTML은 루트 디렉토리에 위치 (`href="Dashboard.html"` 등 상대 경로 유지).
   - 공통 에셋은 `assets/`, `css/style.css`, `js/dashboard.js` 참조.
   - 기획 및 설계 참고 문서는 `docs/` 하위 폴더 참조.

---

## 3. 디자인/UI/UX 가이드라인 준수 (Design System)
작업 전 반드시 루트의 **[`DESIGN_GUIDE.md`](DESIGN_GUIDE.md)**를 준수하십시오:
- **메인 폰트**: `Pretendard`, sans-serif.
- **브랜드 컬러**:
  - 브랜드 네이비: `#0e3a6c` (SRM 헤더, 중요 승인 버튼)
  - 프라이머리 블루: `#1976d2` (PMS 헤더 배지, 주요 액션 버튼)
  - 포인트 오렌지: `#ff7a00`
- **시맨틱 컬러**:
  - 성공(Green): `#16a34a` / 주의(Amber): `#f59e0b` / 정보(Sky): `#0284c7` / 위험(Red): `#ef5350`
- **컴포넌트 규칙**:
  - 카드: `.app-card` (라운드 12px, 테두리 `#e2e8f0`, 그림자 `var(--shadow-sm)`)
  - 테이블 정렬: 텍스트(좌), 코드/날짜(중앙), 금액/숫자(우측)
  - 헤더: 높이 56px 고정, 좌측 로고(컴팩트 필) + 우측 시스템 전환/사용자 프로필
  - 푸터: 높이 38px 고정, 배경 다크네이비 `#0e3a6c`, 중앙 정렬 저작권 표기 (`&copy; 2026 KEPCO Energy Solution Co., Ltd. All Rights Reserved.`). **⚠️ 임시 데모/프로토타입 안내 문구 절대 삽입 금지 (실제 엔터프라이즈 디자인)**

---

## 4. 디렉토리 구조 (Directory Structure)
```plaintext
├── index.html                   # 통합 화면 런처 포털
├── Dashboard.html               # PMS 종합 대시보드
├── ProjectRegister.html         # 신규 프로젝트 등록
├── ProjectSearch.html           # 추진단계 프로젝트 현황 (검색/조회)
├── ProjectDetail.html           # 프로젝트 상세
├── PlanPerformance.html        # 계획대비 실적현황
├── BusinessSettlement.html      # 사업결산 현황
├── Statistics.html              # 통계 종합현황
├── StepWorkflow.html            # 진행상태별 업무 관리 (7-Step)
├── SRMLogin.html                # SRM 로그인
├── SRMDashboard.html            # SRM 대시보드
├── PartnerRegister.html         # SRM 협력업체 신청 (5-Step)
├── DESIGN_GUIDE.md              # 공식 디자인/UI/UX 가이드라인
├── CLAUDE.md                    # AI 어시스턴트 표준 지침 (본 파일)
├── AI_HANDOVER.md               # 토큰 소진 시 인수인계 마스터 프롬프트
├── assets/                      # CI 로고 및 썸네일
├── css/style.css                # 통합 스타일시트
├── js/dashboard.js              # 통합 인터랙션 스크립트
└── docs/                        # 기획/설계 산출물 (specs_pdf, design_refs, menu_excel)
```

---

## 5. 새로운 세션 시작 시 행동 지침 (Instruction for New Session)
1. 사용자가 특정 화면 추가/수정을 요청하면, `docs/specs_pdf/` 및 `docs/design_refs/`의 명세서를 먼저 확인합니다.
2. `DESIGN_GUIDE.md`의 컬러, 폰트, 테이블, 버튼, 모달 규격을 그대로 적용합니다.
3. 생성된 화면은 `index.html`과 `SRMDashboard.html`/`Dashboard.html` 사이드바 및 네비게이션에 즉시 연결합니다.
