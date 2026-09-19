# 🔄 AI 인수인계 마스터 프롬프트 (AI Handover Protocol)

> **용도**: 세션 토큰 소진 또는 모델 변경(Claude ↔ ChatGPT ↔ Gemini) 시, 새로운 대화창에 아래 **[복사용 프롬프트]**를 그대로 붙여넣으면 즉시 100% 동일한 컨텍스트와 디자인 규칙으로 작업을 이어갈 수 있습니다.

---

## 📋 [새 대화창에 복사해서 붙여넣을 프롬프트]

```markdown
안녕하세요. 켑코이에스(주) 사업관리시스템(PMS) 및 전자입찰시스템(SRM) UI/UX 개발을 이어서 진행합니다.

[프로젝트 핵심 규칙]
1. 본 프로젝트는 프로토타입이 아닌 '실제 프로덕션 엔터프라이즈 디자인'입니다.
2. 기술 스택: 순수 HTML5 + Vanilla CSS (`css/style.css`) + Vanilla JS (`js/dashboard.js`) (Tailwind 금지)
3. 디자인 가이드: 프로젝트 루트의 `DESIGN_GUIDE.md` 및 `CLAUDE.md`를 100% 엄격 준수
   - 폰트: Pretendard
   - 메인 컬러: Primary Blue (`#1976d2`). 포인트 컬러: Orange (`#ff7a00`), Green (`#00b894`), Red (`#ef4444`). 그래프 외 네이비·퍼플 사용 금지.
   - 헤더: 56px 고정 헤더, 로고는 흰색 필 컨테이너 내 28px 높이 고정
   - 푸터: 38px 고정, 기본 블루 배경, 공식 저작권 중앙 정렬 (`&copy; 2026 KEPCO Energy Solution Co., Ltd. All Rights Reserved.`). **⚠️ 임시 데모/프로토타입 안내 문구 절대 금지**
   - 테이블: 상세 Key-Value 표 및 목록형 데이터 그리드(텍스트 좌측, 날짜/코드 중앙, 금액 우측 정렬)
4. 참고 자료: `docs/specs_pdf/`, `docs/design_refs/`, `docs/menu_excel/` 참조
5. 화면 연계: 신규 화면 생성 시 `index.html` (가이드 포털)에 즉시 카드 연계

[현재 진행 상태]
- `index.html` (디자인/퍼블리싱 가이드):
  - 헤더: `[켑코이에스(주) 로고]` + `디자인/퍼블리싱 가이드` 타이틀.
  - 카드: 카드 썸네일 위의 불필요한 뱃지/태그/물리적 파일명(`.html`)/#순번 완전 제거.
  - 순수 썸네일 프리뷰 + 화면 타이틀 + '새 창으로 열기' 버튼의 초깔끔 엔터프라이즈 카드 그리드 유지.
  - 썸네일 정렬 및 가공: 기본 화면 `top left` 정렬, 모달/로그인 `top center` 적용, **썸네일 하단 파란색 푸터 바 전면 크롭/제거 완료**.
  - **버튼 및 여백 표준화**: 모든 카드의 '새 창으로 열기' 버튼을 KEPCO Blue (`#1976d2`) 단일 색상으로 100% 통일하고, 제목과 버튼 사이 간격을 10px로 압축하여 불필요한 여백 전면 제거.
  - 라우팅 화면 `index.html` 제외 총 11개 화면 100% 등록 완료.
- 전 화면(11종) CSS 클래스/로고 정상화 및 푸터 데모 텍스트 전면 제거 완료
- 진행 예정 작업: `docs/specs_pdf/[참고] SRM 상세화면.pdf`를 바탕으로 SRM 입찰공고 현황 상세 화면(`SRMDetail.html`) 신규 제작
```

---

## 🛠️ 모델별 권장 설정 가이드

### 1. Claude (Anthropic) 사용 시
- 프로젝트 기능(Projects)을 사용할 경우: `CLAUDE.md`와 `DESIGN_GUIDE.md`를 Project Knowledge에 등록해 두면 별도 프롬프트 입력 없이도 자동으로 모든 디자인/코딩 규칙이 적용됩니다.
- 일반 대화창 사용 시: 위의 **[복사용 프롬프트]**를 첫 메시지로 전송하십시오.

### 2. ChatGPT (OpenAI GPT-4o / o1 / o3) 사용 시
- 대화창 시작 시 위의 **[복사용 프롬프트]**를 전송하고, 필요 시 `DESIGN_GUIDE.md` 파일을 첨부하면 완벽하게 컨텍스트가 유지됩니다.

### 3. Cursor / VS Code Copilot 사용 시
- 루트에 생성된 `CLAUDE.md` 및 `DESIGN_GUIDE.md`가 자동으로 컨텍스트 파일로 참조됩니다.

---

## 📌 직전 작업 내역 및 체크포인트 (Last Checkpoint)
- **로고 비정상 크기 버그 해결**: `index.html` 상단에서 원본 해상도로 거대하게 노출되던 문제를 `style.css` 내 `.portal-logo-img` 고정 규격으로 해결. 현재 포털 헤더는 흰색 배경을 사용.
- **전체 HTML 파일 CSS 클래스 전수 점검**: `BusinessSettlement.html`, `PlanPerformance.html`, `SRMDashboard.html` 등 누락되었던 공통 클래스 40여 종 `style.css`에 전면 통합 완료.
- **다음 착수 목표**: `SRMDetail.html` (PDF 4페이지 명세 100% 구현, 8-Step 탭, '입찰계획으로 되돌리기' 확인 모달 팝업 포함).
