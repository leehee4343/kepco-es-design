/**
 * KEPCO ES (켑코이에스) PMS 대시보드 인터랙션 & 차트 렌더링 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initPermissions();
  renderDonutCharts();
  animateBarCharts();
  animateProgressBars();
  initProjectRegisterModal();
  initSRMLoginPage();
  initProjectSearchPage();
  initProjectDetailPage();
  initBusinessSettlementPage();
  initStatisticsPage();
  initStepWorkflowPage();
  initSrmDashboardPage();
  initPlanPerformancePage();
  initPartnerRegisterPage();
});

/**
 * 좌측 사이드바 인터랙션 초기화 (LeftMenu.jpeg 기준)
 */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('btnToggleSidebar');
  const navItems = document.querySelectorAll('.nav-item');

  // 사이드바 축소/확장 토글
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      // 축소 시 열려있는 모든 서브메뉴 닫기
      if (sidebar.classList.contains('collapsed')) {
        navItems.forEach(item => item.classList.remove('open'));
      }
    });
  }

  // 메뉴 아코디언 토글
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const submenu = item.querySelector('.submenu');

    if (link) {
      link.addEventListener('click', (e) => {
        if (submenu) {
          e.preventDefault();

          // 사이드바가 축소된 상태라면 먼저 확장
          if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
            setTimeout(() => {
              item.classList.toggle('open');
            }, 150);
            return;
          }

          const isOpen = item.classList.contains('open');

          // 단일 아코디언 모드 (다른 열린 메뉴 닫기)
          navItems.forEach(other => {
            if (other !== item) other.classList.remove('open');
          });

          if (!isOpen) {
            item.classList.add('open');
          } else {
            item.classList.remove('open');
          }
        }
      });
    }
  });
}

/**
 * 상단 권한 그룹 버튼 활성화 토글
 */
function initPermissions() {
  const permBtns = document.querySelectorAll('.perm-btn');
  permBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      permBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/**
 * 도넛 차트 SVG 동적 렌더링
 */
function renderDonutCharts() {
  // 1. 계약 형태 (총 180건)
  // ESCO 계약: 140 (Blue #0284c7)
  // EPC(용역) 계약: 20 (Cyan #38bdf8)
  // 기타: 20 (Amber #f59e0b)
  createDonut('chartContractForm', [
    { label: 'ESCO 계약', value: 140, color: '#0284c7' },
    { label: 'EPC(용역) 계약', value: 20, color: '#38bdf8' },
    { label: '기타', value: 20, color: '#f59e0b' }
  ]);

  // 2. 계약 유형 (총 184건)
  // 수익사업: 140 (Purple #8b5cf6)
  // 정책사업: 20 (Coral #f87171)
  // 정책사업(비표준): 20 (Teal #2dd4bf)
  // 기타: 4 (Gold #fbbf24)
  createDonut('chartContractType', [
    { label: '수익사업', value: 140, color: '#8b5cf6' },
    { label: '정책사업', value: 20, color: '#f87171' },
    { label: '정책사업(비표준)', value: 20, color: '#2dd4bf' },
    { label: '기타', value: 4, color: '#fbbf24' }
  ]);

  // 3. 사업 심의 (총 160건)
  // 심의 대상: 140 (Emerald #10b981)
  // 심의 면제: 20 (Orange #f97316)
  createDonut('chartReviewStatus', [
    { label: '심의 대상', value: 140, color: '#10b981' },
    { label: '심의 면제', value: 20, color: '#f97316' }
  ]);
}

/**
 * SVG 도넛 차트 생성기
 */
function createDonut(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const size = 100;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2; // 39
  const circumference = 2 * Math.PI * radius; // ~245.04

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

  let accumulatedOffset = 0;

  data.forEach(item => {
    const sliceRatio = item.value / total;
    const strokeDash = sliceRatio * circumference;
    const gap = circumference - strokeDash;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', size / 2);
    circle.setAttribute('cy', size / 2);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', item.color);
    circle.setAttribute('stroke-width', strokeWidth);
    circle.setAttribute('stroke-dasharray', `${strokeDash} ${gap}`);
    circle.setAttribute('stroke-dashoffset', -accumulatedOffset);
    circle.style.transition = 'all 0.3s ease';
    circle.style.cursor = 'pointer';

    // 마우스 오버 인터랙션
    circle.addEventListener('mouseenter', () => {
      circle.setAttribute('stroke-width', strokeWidth + 3);
    });
    circle.addEventListener('mouseleave', () => {
      circle.setAttribute('stroke-width', strokeWidth);
    });

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${item.label}: ${item.value}건 (${Math.round(sliceRatio * 100)}%)`;
    circle.appendChild(title);

    svg.appendChild(circle);
    accumulatedOffset += strokeDash;
  });

  container.innerHTML = '';
  container.appendChild(svg);
}

/**
 * 목표 대비 실적 막대 그래프 부드러운 애니메이션
 */
function animateBarCharts() {
  const bars = document.querySelectorAll('.bar-fill');
  bars.forEach(bar => {
    const targetHeight = bar.getAttribute('data-height');
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.height = targetHeight + '%';
    }, 200);
  });
}

/**
 * 투자/상환 현황 게이지 바 애니메이션
 */
function animateProgressBars() {
  const bars = document.querySelectorAll('.finance-progress-bar');
  bars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-progress') || '85%';
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 300);
  });
}

/**
 * 신규 프로젝트 등록 모달 인터랙션 ([참고]신규프로젝트 등록.jpeg)
 */
function initProjectRegisterModal() {
  const modalBackdrop = document.getElementById('modalProjectRegister');
  if (!modalBackdrop) return;

  const btnOpenModal = document.getElementById('btnOpenRegisterModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const contractCards = document.querySelectorAll('.contract-option-card');
  const step1 = document.getElementById('modalStep1');
  const step2 = document.getElementById('modalStep2');
  const btnFormPrev = document.getElementById('btnFormPrev');
  const projectForm = document.getElementById('projectRegisterForm');
  const contractBadge = document.getElementById('selectedContractBadge');

  // 모달 열기
  function openModal() {
    modalBackdrop.classList.add('show');
    resetModal();
  }

  // 모달 닫기
  function closeModal() {
    modalBackdrop.classList.remove('show');
  }

  // 모달 상태 초기화 (Step 1로 복귀)
  function resetModal() {
    if (step1) step1.style.display = 'block';
    if (step2) step2.classList.remove('active');
    if (projectForm) projectForm.reset();
  }

  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', openModal);
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
  }

  if (btnCancelModal) {
    btnCancelModal.addEventListener('click', closeModal);
  }

  // 백드롭 클릭 시 닫기
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // ESC 키 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('show')) {
      closeModal();
    }
  });

  // Step 1: 계약 형태 카드 선택 시 Step 2 폼으로 이동
  contractCards.forEach(card => {
    card.addEventListener('click', () => {
      const contractType = card.getAttribute('data-contract') || 'ESCO 계약';
      if (contractBadge) {
        contractBadge.textContent = `계약 형태 : ${contractType}`;
      }
      if (step1) step1.style.display = 'none';
      if (step2) step2.classList.add('active');
    });
  });

  // Step 2 -> Step 1 이전 버튼
  if (btnFormPrev) {
    btnFormPrev.addEventListener('click', () => {
      if (step2) step2.classList.remove('active');
      if (step1) step1.style.display = 'block';
    });
  }

  // Step 2 폼 제출 (프로젝트 등록 완료 시뮬레이션)
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pName = document.getElementById('regProjectName')?.value || '신규 프로젝트';
      const pClient = document.getElementById('regClientName')?.value || '고객사';
      const pAmount = document.getElementById('regAmount')?.value || '1,000,000,000';
      const cType = contractBadge?.textContent.replace('계약 형태 : ', '') || 'ESCO계약';

      // 테이블 맨 위에 새 행 추가
      const tbody = document.querySelector('.data-table tbody');
      if (tbody) {
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
        const tr = document.createElement('tr');
        tr.style.backgroundColor = '#f0fdf4';
        tr.innerHTML = `
          <td><input type="checkbox"></td>
          <td>NEW</td>
          <td>2026</td>
          <td>${today}</td>
          <td>23213-2399</td>
          <td><strong>${cType}</strong></td>
          <td style="text-align: left;"><a class="project-title-link">${pName}</a></td>
          <td><span class="status-pill active-ing">신규 접수</span></td>
          <td>${pClient}</td>
          <td>서울</td>
          <td>신규설비</td>
          <td>건축물</td>
          <td>수익사업</td>
          <td>신규제안</td>
          <td style="text-align: right;">${pAmount}</td>
          <td style="text-align: right;">-</td>
        `;
        tbody.prepend(tr);
      }

      alert(`[${cType}] "${pName}" 프로젝트가 성공적으로 등록되었습니다.`);
      closeModal();
    });
  }
}

/**
 * SRM 로그인 화면 인터랙션 ([참고]로그인 화면.jpeg & [설계] 로그인 화면.pdf)
 */
function initSRMLoginPage() {
  const loginForm = document.getElementById('srmLoginForm');
  if (!loginForm && !document.querySelector('.bidding-notice-card')) return;

  const idInput = document.getElementById('loginUserId');
  const pwInput = document.getElementById('loginUserPw');
  const demoBtns = document.querySelectorAll('.demo-account-btn');
  const tabBtns = document.querySelectorAll('.bidding-tab-btn');
  const slides = document.querySelectorAll('.bidding-slide');
  const prevBtn = document.getElementById('btnPrevBidding');
  const nextBtn = document.getElementById('btnNextBidding');
  const dots = document.querySelectorAll('.bidding-dot');

  let currentSlideIndex = 0;

  function showSlide(index) {
    if (!slides.length) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlideIndex = index;

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlideIndex);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentSlideIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentSlideIndex + 1));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      showSlide(idx);
    });
  });

  // 탭 클릭 필터
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetCategory = tab.getAttribute('data-tab');
      // 해당 카테고리의 첫 번째 슬라이드 찾기
      const targetIndex = Array.from(slides).findIndex(s => s.getAttribute('data-category') === targetCategory);
      if (targetIndex !== -1) {
        showSlide(targetIndex);
      }
    });
  });

  // 시연 계정 4종 퀵 로그인 자동입력
  const demoAccounts = {
    'contract': { id: 'contract_manager', pw: 'kepco1234!', role: '계약담당자' },
    'biz': { id: 'biz_manager', pw: 'kepco1234!', role: '사업담당자' },
    'admin': { id: 'admin', pw: 'admin1234!', role: '관리자' },
    'partner': { id: 'hanbit_power', pw: 'partner1234!', role: '협력업체(한빛전력)' }
  };

  demoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const roleKey = btn.getAttribute('data-role');
      const account = demoAccounts[roleKey];
      if (account && idInput && pwInput) {
        idInput.value = account.id;
        pwInput.value = account.pw;
        // 시각적 피드백 후 SRM 대시보드로 로그인 시뮬레이션
        btn.style.borderColor = '#1976d2';
        setTimeout(() => {
          window.location.href = `SRMDashboard.html?role=${roleKey}`;
        }, 300);
      }
    });
  });

  // 일반 로그인 폼 제출
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredId = idInput?.value.trim();
      const enteredPw = pwInput?.value.trim();

      if (!enteredId || !enteredPw) {
        alert('아이디와 비밀번호를 모두 입력해 주세요.');
        return;
      }

      // 로그인 성공 시뮬레이션 -> SRM 대시보드로 이동
      window.location.href = 'SRMDashboard.html';
    });
  }

  // 입찰공고 클릭 시 상세 팝업 모달 토글 ([설계] 로그인 화면.pdf ④번 명세)
  const noticeTitles = document.querySelectorAll('.bidding-project-name');
  const biddingModal = document.getElementById('modalBiddingDetail');
  const closeBiddingModal = document.getElementById('btnCloseBiddingModal');

  noticeTitles.forEach(title => {
    title.addEventListener('click', () => {
      if (biddingModal) {
        biddingModal.classList.add('show');
      }
    });
  });

  if (closeBiddingModal && biddingModal) {
    closeBiddingModal.addEventListener('click', () => {
      biddingModal.classList.remove('show');
    });
    biddingModal.addEventListener('click', (e) => {
      if (e.target === biddingModal) {
        biddingModal.classList.remove('show');
      }
    });
  }

  // 협력업체 신청 모달 토글
  const btnPartnerReg = document.getElementById('btnPartnerRegister');
  const partnerModal = document.getElementById('modalPartnerRegister');
  const closePartnerModal = document.getElementById('btnClosePartnerModal');

  if (btnPartnerReg && partnerModal) {
    btnPartnerReg.addEventListener('click', () => {
      partnerModal.classList.add('show');
    });
  }

  if (closePartnerModal && partnerModal) {
    closePartnerModal.addEventListener('click', () => {
      partnerModal.classList.remove('show');
    });
    partnerModal.addEventListener('click', (e) => {
      if (e.target === partnerModal) {
        partnerModal.classList.remove('show');
      }
    });
  }
}

/**
 * 프로젝트 검색 및 조회 화면 인터랙션 (ProjectSearch.html)
 */
function initProjectSearchPage() {
  const filterCard = document.querySelector('.search-filter-card');
  if (!filterCard) return;

  const startDateInput = document.getElementById('searchStartDate');
  const endDateInput = document.getElementById('searchEndDate');
  const periodBtns = document.querySelectorAll('.btn-period-pill');
  const btnSearch = document.getElementById('btnDoSearch');
  const btnReset = document.getElementById('btnDoReset');
  const keywordInput = document.getElementById('searchKeyword');
  const contractTypeSelect = document.getElementById('selectContractType');
  const tableRows = document.querySelectorAll('.data-table tbody tr');
  const countBadge = document.getElementById('searchResultCount');
  const btnExcel = document.getElementById('btnExcelDownload');

  // 퀵 기간 버튼 클릭 로직
  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const period = btn.getAttribute('data-period');
      const baseEnd = new Date('2026-07-30'); // 기준 종료일
      const newStart = new Date(baseEnd);

      if (period === '1d') {
        newStart.setDate(baseEnd.getDate() - 1);
      } else if (period === '1m') {
        newStart.setMonth(baseEnd.getMonth() - 1);
      } else if (period === '3m') {
        newStart.setMonth(baseEnd.getMonth() - 3);
      } else if (period === '1y') {
        newStart.setFullYear(baseEnd.getFullYear() - 1);
      }

      const fmt = d => d.toISOString().slice(0, 10).replace(/-/g, '.');
      if (startDateInput && endDateInput) {
        startDateInput.value = fmt(newStart);
        endDateInput.value = fmt(baseEnd);
      }
    });
  });

  // 검색 버튼 클릭 시 실시간 필터링
  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      const kw = keywordInput?.value.trim().toLowerCase() || '';
      const cType = contractTypeSelect?.value || '';
      let visibleCount = 0;

      tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matchesKeyword = !kw || text.includes(kw);
        const matchesType = !cType || text.includes(cType.toLowerCase());

        if (matchesKeyword && matchesType) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countBadge) {
        countBadge.textContent = `${visibleCount}건`;
      }
    });
  }

  // 초기화 버튼
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (keywordInput) keywordInput.value = '';
      if (contractTypeSelect) contractTypeSelect.value = '';
      const allSelects = filterCard.querySelectorAll('select');
      allSelects.forEach(s => s.selectedIndex = 0);
      const allInputs = filterCard.querySelectorAll('input[type="text"]');
      allInputs.forEach(i => i.value = '');

      tableRows.forEach(row => {
        row.style.display = '';
      });

      if (countBadge) {
        countBadge.textContent = `${tableRows.length}건`;
      }

      // 1개월 버튼 기본 활성화
      periodBtns.forEach((b, idx) => {
        b.classList.toggle('active', b.getAttribute('data-period') === '1m');
      });
      if (startDateInput) startDateInput.value = '2025.07.31';
      if (endDateInput) endDateInput.value = '2026.07.30';
    });
  }

  // 엑셀 다운로드 안내
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      alert('현재 조회된 프로젝트 목록 데이터를 엑셀(XLSX) 파일로 다운로드합니다.');
    });
  }
}

/**
 * 프로젝트 상세 화면 인터랙션 (ProjectDetail.html)
 */
function initProjectDetailPage() {
  const detailContainer = document.querySelector('.detail-tabs-bar');
  if (!detailContainer) return;

  // 상단 프로세스 탭 전환 (HOME, 추진, 계약, 투자, 상환, 발주)
  const tabBtns = document.querySelectorAll('.detail-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 투자금 정보 거래처 서브탭 전환
  const subtabBtns = document.querySelectorAll('.detail-subtab-btn');
  const partnerDataMap = {
    'posco': { name: '(주)포스코무역', total: '242,000,000', start: '2026.07.31', paid: '180,000,000', end: '2026.08.30', tax: '22,000,000', contract: '220,000,000', ratio: '33.3 / 33.3 / 33.4', supply: '220,000,000', rate: '60.5' },
    'garam': { name: '(주)가람석재', total: '154,000,000', start: '2026.08.01', paid: '92,400,000', end: '2026.09.15', tax: '14,000,000', contract: '140,000,000', ratio: '30.0 / 30.0 / 40.0', supply: '140,000,000', rate: '60.0' },
    'homemart': { name: '홈마트', total: '88,000,000', start: '2026.08.10', paid: '52,800,000', end: '2026.09.30', tax: '8,000,000', contract: '80,000,000', ratio: '20.0 / 40.0 / 40.0', supply: '80,000,000', rate: '60.0' }
  };

  subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subtabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const partnerKey = btn.getAttribute('data-partner');
      const data = partnerDataMap[partnerKey];
      if (data) {
        const setTxt = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        };
        setTxt('f_partner_name', data.name);
        setTxt('f_total_vat', data.total);
        setTxt('f_start_date', data.start);
        setTxt('f_paid_amount', data.paid);
        setTxt('f_end_date', data.end);
        setTxt('f_tax_amount', data.tax);
        setTxt('f_contract_amount', data.contract);
        setTxt('f_pay_ratio', data.ratio);
        setTxt('f_supply_amount', data.supply);
        setTxt('f_pay_rate', data.rate);
      }
    });
  });

  // 프로젝트 첨부파일 버튼
  const btnFile = document.getElementById('btnProjectAttachment');
  if (btnFile) {
    btnFile.addEventListener('click', () => {
      alert('프로젝트 첨부파일 목록:\n1. 20260701_천안_선영LED_사업계획서.pdf (3.4MB)\n2. 공사도급계약서_날인본.pdf (1.8MB)\n3. 설비사양서_및_도면.zip (14.2MB)\n\n다운로드 가능한 파일 3건이 확인되었습니다.');
    });
  }

  // 카드 헤더 플러스(+) 토글
  const plusBtns = document.querySelectorAll('.btn-card-plus');
  plusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      alert('상세 내역 드릴다운(Drill-down) 팝업을 호출합니다.');
    });
  });
}

/**
 * 사업 결산 화면 인터랙션 (BusinessSettlement.html)
 */
function initBusinessSettlementPage() {
  const settleFilter = document.querySelector('.settlement-filter-card');
  if (!settleFilter) return;

  const periodBtns = settleFilter.querySelectorAll('.btn-period-pill');
  const startDateInput = document.getElementById('settleStartDate');
  const endDateInput = document.getElementById('settleEndDate');
  const btnSearch = document.getElementById('btnSettleSearch');
  const btnReset = document.getElementById('btnSettleReset');
  const typeSelect = document.getElementById('selectSettleType');
  const keywordInput = document.getElementById('settleKeyword');
  const tableRows = document.querySelectorAll('.settlement-table tbody tr');
  const countBadge = document.getElementById('settleResultCount');
  const btnExcel = document.getElementById('btnSettleExcel');

  // 기간 빠른 선택
  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const period = btn.getAttribute('data-period');
      const baseEnd = new Date('2026-07-30');
      const newStart = new Date(baseEnd);

      if (period === '1d') {
        newStart.setDate(baseEnd.getDate() - 1);
      } else if (period === '1m') {
        newStart.setMonth(baseEnd.getMonth() - 1);
      } else if (period === '3m') {
        newStart.setMonth(baseEnd.getMonth() - 3);
      } else if (period === '1y') {
        newStart.setFullYear(baseEnd.getFullYear() - 1);
      }

      const fmt = d => d.toISOString().slice(0, 10).replace(/-/g, '.');
      if (startDateInput && endDateInput) {
        startDateInput.value = fmt(newStart);
        endDateInput.value = fmt(baseEnd);
      }
    });
  });

  // 결산 검색 필터링
  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      const selectedType = typeSelect?.value || '';
      const kw = keywordInput?.value.trim().toLowerCase() || '';
      let matchCount = 0;

      tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matchesType = !selectedType || text.includes(selectedType.toLowerCase());
        const matchesKw = !kw || text.includes(kw);

        if (matchesType && matchesKw) {
          row.style.display = '';
          matchCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countBadge) {
        countBadge.textContent = matchCount;
      }
    });
  }

  // 초기화 버튼
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (typeSelect) typeSelect.selectedIndex = 0;
      if (keywordInput) keywordInput.value = '';
      if (startDateInput) startDateInput.value = '2026.07.01';
      if (endDateInput) endDateInput.value = '2026.07.30';

      periodBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-period') === '1m');
      });

      tableRows.forEach(row => row.style.display = '');
      if (countBadge) countBadge.textContent = tableRows.length;
    });
  }

  // 엑셀 다운로드
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      alert('현재 조회된 사업 결산 데이터를 엑셀(XLSX) 파일로 내려받습니다.');
    });
  }
}

/**
 * 통계 종합현황 화면 인터랙션 (Statistics.html)
 */
function initStatisticsPage() {
  const statsFilter = document.querySelector('.stats-filter-card');
  if (!statsFilter) return;

  const yearSelect = document.getElementById('statsYearSelect');
  const btnSearch = document.getElementById('btnStatsSearch');
  const btnExcel = document.getElementById('btnStatsExcel');
  const headerYearIndicator = document.getElementById('headerYearIndicator');

  // 연도 변경 인터랙션
  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      const yr = yearSelect ? yearSelect.value : '2025';
      if (headerYearIndicator) {
        headerYearIndicator.textContent = `기준연도 : ${yr}`;
      }
      alert(`${yr}년도 기준 프로젝트·투자·상환 및 설비/경로별 실적 데이터를 성공적으로 조회하였습니다.`);
    });
  }

  // 엑셀 다운로드
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      const yr = yearSelect ? yearSelect.value : '2025';
      alert(`${yr}년도 종합 통계 분석 현황 데이터를 엑셀(XLSX) 파일로 다운로드합니다.`);
    });
  }
}

/**
 * 진행상태별 업무 관리 화면 인터랙션 (StepWorkflow.html)
 */
function initStepWorkflowPage() {
  const stepperGrid = document.querySelector('.main-stepper-grid');
  if (!stepperGrid) return;

  const btnOpenCalcModal = document.querySelectorAll('.btn-open-calc-modal');
  const modalCalc = document.getElementById('modalCalcPrice');
  const btnCloseCalcModal = document.getElementById('btnCloseCalcModal');
  const btnCancelCalc = document.getElementById('btnCancelCalc');
  const btnAddRow = document.getElementById('btnAddCalcRow');
  const tbodyCalc = document.getElementById('tbodyCalcRows');

  const btnRequestApproval = document.getElementById('btnRequestApproval');
  const modalConfirm = document.getElementById('modalApprovalConfirm');
  const btnCloseConfirmModal = document.getElementById('btnCloseConfirmModal');
  const btnCancelConfirm = document.getElementById('btnCancelConfirm');
  const btnDoConfirmApproval = document.getElementById('btnDoConfirmApproval');

  // 모달 1 열기
  btnOpenCalcModal.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalCalc) modalCalc.classList.add('show');
    });
  });

  // 모달 1 닫기
  const closeCalc = () => {
    if (modalCalc) modalCalc.classList.remove('show');
  };
  if (btnCloseCalcModal) btnCloseCalcModal.addEventListener('click', closeCalc);
  if (btnCancelCalc) btnCancelCalc.addEventListener('click', closeCalc);

  // 실시간 합산 계산 함수
  function recalculateTotals() {
    let sumEstimated = 0;
    let sumAssessed = 0;

    const rowInputsEstimated = document.querySelectorAll('.calc-est-val');
    const rowInputsAssessed = document.querySelectorAll('.calc-ass-val');

    rowInputsEstimated.forEach(input => {
      const val = parseInt(input.value.replace(/[^0-9]/g, ''), 10) || 0;
      sumEstimated += val;
    });

    rowInputsAssessed.forEach(input => {
      const val = parseInt(input.value.replace(/[^0-9]/g, ''), 10) || 0;
      sumAssessed += val;
    });

    const vatEstimated = Math.round(sumEstimated * 0.1);
    const vatAssessed = Math.round(sumAssessed * 0.1);

    const totalEstimated = sumEstimated + vatEstimated;
    const totalAssessed = sumAssessed + vatAssessed;

    const fmt = n => n.toLocaleString();

    // 공급가액
    const elSupplyEst = document.getElementById('calcSupplyEstimated');
    const elSupplyAss = document.getElementById('calcSupplyAssessed');
    if (elSupplyEst) elSupplyEst.textContent = fmt(sumEstimated) + ' 원';
    if (elSupplyAss) elSupplyAss.textContent = fmt(sumAssessed) + ' 원';

    // 부가세
    const elVatEst = document.getElementById('calcVatEstimated');
    const elVatAss = document.getElementById('calcVatAssessed');
    if (elVatEst) elVatEst.textContent = fmt(vatEstimated) + ' 원';
    if (elVatAss) elVatAss.textContent = fmt(vatAssessed) + ' 원';

    // 총계
    const elTotEst = document.getElementById('calcTotalEstimated');
    const elTotAss = document.getElementById('calcTotalAssessed');
    if (elTotEst) elTotEst.textContent = fmt(totalEstimated) + ' 원';
    if (elTotAss) elTotAss.textContent = fmt(totalAssessed) + ' 원';
  }

  // 행 추가
  if (btnAddRow && tbodyCalc) {
    btnAddRow.addEventListener('click', () => {
      const newTr = document.createElement('tr');
      newTr.innerHTML = `
        <td><input type="text" class="calc-num-input" style="text-align: left;" value="기타 추가 항목"></td>
        <td><input type="text" class="calc-num-input calc-est-val" value="1,000,000"></td>
        <td><input type="text" class="calc-num-input calc-ass-val" value="1,000,000"></td>
        <td><span class="diff-val">0원</span></td>
        <td><input type="text" class="filter-input" style="height: 32px; font-size: 12px; width: 100%;" placeholder="20자 이내로 간략히 작성해주세요."></td>
        <td><button type="button" class="btn-row-del">삭제</button></td>
      `;
      tbodyCalc.appendChild(newTr);

      // 이벤트 바인딩
      const delBtn = newTr.querySelector('.btn-row-del');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          newTr.remove();
          recalculateTotals();
        });
      }

      const inputs = newTr.querySelectorAll('.calc-est-val, .calc-ass-val');
      inputs.forEach(inp => {
        inp.addEventListener('input', recalculateTotals);
      });

      recalculateTotals();
    });
  }

  // 기존 행 삭제 및 인풋 이벤트
  const existingDelBtns = document.querySelectorAll('.btn-row-del');
  existingDelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      if (tr) {
        tr.remove();
        recalculateTotals();
      }
    });
  });

  const existingInputs = document.querySelectorAll('.calc-est-val, .calc-ass-val');
  existingInputs.forEach(inp => {
    inp.addEventListener('input', recalculateTotals);
  });

  // 전자결재 요청 모달 2 열기
  if (btnRequestApproval && modalConfirm) {
    btnRequestApproval.addEventListener('click', () => {
      modalConfirm.classList.add('show');
    });
  }

  const closeConfirm = () => {
    if (modalConfirm) modalConfirm.classList.remove('show');
  };
  if (btnCloseConfirmModal) btnCloseConfirmModal.addEventListener('click', closeConfirm);
  if (btnCancelConfirm) btnCancelConfirm.addEventListener('click', closeConfirm);

  // 전자결재 최종 승인 처리
  if (btnDoConfirmApproval) {
    btnDoConfirmApproval.addEventListener('click', () => {
      closeConfirm();
      closeCalc();

      alert('그룹웨어로 예정가격 산출기초조서 전자결재 요청이 정상 전송되었습니다.\nSTEP 02 단계가 [진행중]으로 전환됩니다.');

      // STEP 01 완료 상태 전환
      const step1Btn = document.querySelector('.sub-step-card:nth-child(1) .btn-sub-green');
      if (step1Btn) {
        step1Btn.textContent = '완료';
        step1Btn.classList.remove('btn-sub-green');
        step1Btn.classList.add('btn-sub-dark');
      }

      // STEP 02 진행중 활성화
      const step2Card = document.querySelector('.sub-step-card:nth-child(2)');
      if (step2Card) {
        step2Card.classList.add('active-substep');
        const pBtn = step2Card.querySelector('.btn-sub-gray');
        if (pBtn) {
          pBtn.classList.remove('btn-sub-gray');
          pBtn.classList.add('btn-sub-green');
        }
      }
    });
  }
}

/**
 * SRM 전자입찰 업무 포털 대시보드 인터랙션 (SRMDashboard.html)
 * - [참고]메뉴구조도(SRM).xlsx 기준 사내담당자 10대 메뉴 ↔ 협력업체 5대 메뉴 전환
 */
function initSrmDashboardPage() {
  const roleChips = document.querySelectorAll('.srm-role-chip');
  const navInternal = document.getElementById('srmNavInternal');
  const navPartner = document.getElementById('srmNavPartner');
  const userRoleEl = document.getElementById('srmUserRole');
  const userNameEl = document.getElementById('srmUserName');
  const modeNoticeText = document.getElementById('srmModeNoticeText');
  const pageSubtitle = document.getElementById('srmPageSubtitle');

  if (!roleChips.length && !navInternal) return;

  const roleConfigs = {
    'contract': {
      name: '홍길동 과장',
      role: '[계약담당자]',
      sub: '(계약담당자 종합 현황)',
      notice: '현재 <strong>계약담당자</strong> 모드로 접속 중입니다. 좌측 메뉴에서 10대 사내 업무 메뉴를 확인하시거나 상단 역할 버튼을 통해 협력업체 전용 창구 모드로 전환하실 수 있습니다.',
      isPartner: false
    },
    'biz': {
      name: '김사업 차장',
      role: '[사업담당자]',
      sub: '(사업담당자 종합 현황)',
      notice: '현재 <strong>사업담당자</strong> 모드로 접속 중입니다. 사전 견적 요청, 발주계약 요청 및 사업부서 소관 입찰 현황을 확인하실 수 있습니다.',
      isPartner: false
    },
    'admin': {
      name: '이희성 부장',
      role: '[시스템관리자]',
      sub: '(시스템 총괄 관리)',
      notice: '현재 <strong>시스템 관리자</strong> 모드로 접속 중입니다. 사용자 권한, 공통 품목, 기준정보 및 시스템 로그 전반을 관리하실 수 있습니다.',
      isPartner: false
    },
    'partner': {
      name: '박전력 대표',
      role: '[한빛전력공사]',
      sub: '(협력업체 전용 창구)',
      notice: '현재 <strong>협력업체(한빛전력공사)</strong> 전용 모드로 접속 중입니다. 좌측 메뉴가 협력업체용 5대 전용 메뉴로 자동 전환되었습니다.',
      isPartner: true
    }
  };

  function setRole(roleKey) {
    const config = roleConfigs[roleKey] || roleConfigs['contract'];

    roleChips.forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-role') === roleKey);
    });

    if (userRoleEl) userRoleEl.textContent = config.role;
    if (userNameEl) userNameEl.textContent = config.name;
    if (pageSubtitle) pageSubtitle.textContent = config.sub;
    if (modeNoticeText) modeNoticeText.innerHTML = config.notice;

    if (navInternal && navPartner) {
      if (config.isPartner) {
        navInternal.style.display = 'none';
        navPartner.style.display = 'block';
      } else {
        navInternal.style.display = 'block';
        navPartner.style.display = 'none';
      }
    }
  }

  // URL 쿼리 파라미터 role 확인
  const urlParams = new URLSearchParams(window.location.search);
  const initialRole = urlParams.get('role') || 'contract';
  setRole(initialRole);

  // 칩 클릭 이벤트
  roleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const roleKey = chip.getAttribute('data-role');
      setRole(roleKey);
    });
  });
}

/**
 * 계획대비 실적현황 인터랙션 (PlanPerformance.html)
 * - 퀵 기간 버튼 자동 날짜 계산
 * - 사업구분 및 대상설비, 키워드 실시간 필터링
 * - 엑셀 다운로드
 */
function initPlanPerformancePage() {
  const searchForm = document.getElementById('planSearchForm');
  const tableBody = document.getElementById('planPerfTableBody');
  const quickBtns = document.querySelectorAll('.quick-date-btns .btn-quick-date');
  const startDateInput = document.getElementById('planStartDate');
  const endDateInput = document.getElementById('planEndDate');
  const bizTypeSelect = document.getElementById('selBizType');
  const facilitySelect = document.getElementById('selFacility');
  const keywordInput = document.getElementById('inputKeyword');
  const resCountEl = document.getElementById('resCount');
  const resetBtn = document.getElementById('btnFilterReset');
  const excelBtn = document.getElementById('btnExcelDownload');

  if (!tableBody) return;

  // 퀵 날짜 계산
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quickBtns.forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = '#cbd5e1';
        b.style.background = '#ffffff';
        b.style.color = '#475569';
      });
      btn.classList.add('active');
      btn.style.borderColor = '#1976d2';
      btn.style.background = '#f0f7ff';
      btn.style.color = '#1976d2';

      const range = btn.getAttribute('data-range');
      const now = new Date(2026, 8, 19); // 2026-09-19 기준
      const endStr = '2030-10-19';
      let startObj = new Date(2021, 6, 15);

      if (range === '1d') {
        startObj = new Date(now);
        startObj.setDate(startObj.getDate() - 1);
      } else if (range === '1m') {
        startObj = new Date(now);
        startObj.setMonth(startObj.getMonth() - 1);
      } else if (range === '3m') {
        startObj = new Date(now);
        startObj.setMonth(startObj.getMonth() - 3);
      } else if (range === '1y') {
        startObj = new Date(now);
        startObj.setFullYear(startObj.getFullYear() - 1);
      }

      if (startDateInput) startDateInput.value = startObj.toISOString().slice(0, 10);
      if (endDateInput) endDateInput.value = endStr;
    });
  });

  // 필터 검색 핸들러
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });
  }

  function applyFilters() {
    const selectedBiz = bizTypeSelect?.value || 'all';
    const selectedFac = facilitySelect?.value || 'all';
    const keyword = keywordInput?.value.trim().toLowerCase() || '';

    const rows = tableBody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const rowBiz = row.getAttribute('data-biz') || '';
      const rowFac = row.getAttribute('data-facility') || '';
      const rowText = row.textContent.toLowerCase();

      let matchBiz = (selectedBiz === 'all' || rowBiz === selectedBiz);
      let matchFac = (selectedFac === 'all' || rowFac === selectedFac);
      let matchKw = (!keyword || rowText.includes(keyword));

      if (matchBiz && matchFac && matchKw) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (resCountEl) resCountEl.textContent = visibleCount;
  }

  // 초기화 핸들러
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (bizTypeSelect) bizTypeSelect.value = 'all';
      if (facilitySelect) facilitySelect.value = 'all';
      if (keywordInput) keywordInput.value = '';
      if (startDateInput) startDateInput.value = '2021-07-15';
      if (endDateInput) endDateInput.value = '2030-10-19';

      const rows = tableBody.querySelectorAll('tr');
      rows.forEach(row => row.style.display = '');
      if (resCountEl) resCountEl.textContent = rows.length;
    });
  }

  // 엑셀 다운로드
  if (excelBtn) {
    excelBtn.addEventListener('click', () => {
      alert('계획대비 실적 현황 엑셀 파일(PlanPerformance_2026.xlsx) 다운로드를 시작합니다.');
    });
  }
}

/**
 * 협력업체 신청 5-Step 위자드 인터랙션 (PartnerRegister.html)
 * - [참고]협력업체 신청(팝업).pdf 기준 5단계 순차 전환
 * - 유효성 검사 및 최종 요약 데이터 반영
 */
function initPartnerRegisterPage() {
  const stepper = document.getElementById('wizardStepper');
  const panels = [
    document.getElementById('panelStep1'),
    document.getElementById('panelStep2'),
    document.getElementById('panelStep3'),
    document.getElementById('panelStep4'),
    document.getElementById('panelStep5')
  ];

  if (!stepper || !panels[0]) return;

  function goToStep(stepNum) { // 1-indexed (1 to 5)
    // Update Stepper
    const stepBoxes = stepper.querySelectorAll('.wizard-step-box');
    stepBoxes.forEach((box, idx) => {
      const boxStep = idx + 1;
      box.classList.toggle('active', boxStep === stepNum);
      box.classList.toggle('completed', boxStep < stepNum);
    });

    // Update Panels
    panels.forEach((panel, idx) => {
      if (panel) {
        panel.classList.toggle('active', idx + 1 === stepNum);
      }
    });

    // Step 4 종합 검토 데이터 자동 복사
    if (stepNum === 4) {
      const bizNo = document.getElementById('regBizNo')?.value || '';
      const comp = document.getElementById('regCompanyName')?.value || '';
      const ceo = document.getElementById('regCeoName')?.value || '';
      const tel1 = document.getElementById('regTel1')?.value || '02';
      const tel2 = document.getElementById('regTel2')?.value || '';
      const sector = document.getElementById('regSector')?.value || '';
      const bizType = document.getElementById('regBizType')?.value || '';
      const postCode = document.getElementById('regPostCode')?.value || '';
      const baseAddr = document.getElementById('regBaseAddr')?.value || '';
      const detailAddr = document.getElementById('regDetailAddr')?.value || '';

      const mgrName = document.getElementById('regManagerName')?.value || '';
      const mgrPos = document.getElementById('regManagerPosition')?.value || '';
      const emailId = document.getElementById('regEmailId')?.value || '';
      const emailDom = document.getElementById('regEmailDomain')?.value || '';
      const mob1 = document.getElementById('regMobile1')?.value || '010';
      const mob2 = document.getElementById('regMobile2')?.value || '';
      const mgrTel1 = document.getElementById('regMgrTel1')?.value || '02';
      const mgrTel2 = document.getElementById('regMgrTel2')?.value || '';
      const mgrTask = document.getElementById('regManagerTask')?.value || '';

      const sumBizNo = document.getElementById('sumBizNo');
      const sumCompany = document.getElementById('sumCompany');
      const sumCeo = document.getElementById('sumCeo');
      const sumTel = document.getElementById('sumTel');
      const sumSector = document.getElementById('sumSector');
      const sumAddr = document.getElementById('sumAddr');

      const sumMgrName = document.getElementById('sumMgrName');
      const sumMgrEmail = document.getElementById('sumMgrEmail');
      const sumMgrMobile = document.getElementById('sumMgrMobile');
      const sumMgrTel = document.getElementById('sumMgrTel');
      const sumMgrTask = document.getElementById('sumMgrTask');

      if (sumBizNo) sumBizNo.textContent = bizNo;
      if (sumCompany) sumCompany.textContent = comp;
      if (sumCeo) sumCeo.textContent = ceo;
      if (sumTel) sumTel.textContent = `${tel1}-${tel2}`;
      if (sumSector) sumSector.textContent = `${sector} / ${bizType}`;
      if (sumAddr) sumAddr.textContent = `(${postCode}) ${baseAddr} ${detailAddr}`;

      if (sumMgrName) sumMgrName.textContent = `${mgrName} (${mgrPos})`;
      if (sumMgrEmail) sumMgrEmail.textContent = `${emailId}@${emailDom}`;
      if (sumMgrMobile) sumMgrMobile.textContent = `${mob1}-${mob2}`;
      if (sumMgrTel) sumMgrTel.textContent = `${mgrTel1}-${mgrTel2}`;
      if (sumMgrTask) sumMgrTask.textContent = mgrTask;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Step 1 -> Step 2
  const btnNextToStep2 = document.getElementById('btnNextToStep2');
  if (btnNextToStep2) {
    btnNextToStep2.addEventListener('click', () => {
      const chkTerms = document.getElementById('chkTerms');
      const chkPrivacy = document.getElementById('chkPrivacy');
      if (!chkTerms?.checked || !chkPrivacy?.checked) {
        alert('이용약관 및 개인정보 수집/이용 동의에 모두 체크해 주세요.');
        return;
      }
      goToStep(2);
    });
  }

  // Step 2 이전/다음
  const btnPrevToStep1 = document.getElementById('btnPrevToStep1');
  if (btnPrevToStep1) btnPrevToStep1.addEventListener('click', () => goToStep(1));

  const btnNextToStep3 = document.getElementById('btnNextToStep3');
  if (btnNextToStep3) btnNextToStep3.addEventListener('click', () => goToStep(3));

  // Step 3 이전/다음
  const btnPrevToStep2 = document.getElementById('btnPrevToStep2');
  if (btnPrevToStep2) btnPrevToStep2.addEventListener('click', () => goToStep(2));

  const btnNextToStep4 = document.getElementById('btnNextToStep4');
  if (btnNextToStep4) btnNextToStep4.addEventListener('click', () => goToStep(4));

  // Step 4 이전/최종제출
  const btnPrevToStep3 = document.getElementById('btnPrevToStep3');
  if (btnPrevToStep3) btnPrevToStep3.addEventListener('click', () => goToStep(3));

  const btnFinalSubmit = document.getElementById('btnFinalSubmit');
  if (btnFinalSubmit) {
    btnFinalSubmit.addEventListener('click', () => {
      alert('협력업체 신청서 및 증빙서류가 켑코이에스(주) 관리자에게 최종 제출되었습니다.');
      goToStep(5);
    });
  }

  // 사업자번호 중복확인 시뮬레이션
  const btnCheckBizNo = document.getElementById('btnCheckBizNo');
  if (btnCheckBizNo) {
    btnCheckBizNo.addEventListener('click', () => {
      const bizNo = document.getElementById('regBizNo')?.value.trim();
      if (!bizNo) {
        alert('사업자등록번호를 입력해 주세요.');
        return;
      }
      alert(`[${bizNo}] 사용 가능한 사업자등록번호입니다.\n기존 등록된 협력업체 데이터가 없습니다.`);
    });
  }

  // 이메일 도메인 자동완성
  const selEmailDom = document.getElementById('selEmailDomain');
  const regEmailDom = document.getElementById('regEmailDomain');
  if (selEmailDom && regEmailDom) {
    selEmailDom.addEventListener('change', () => {
      if (selEmailDom.value !== 'direct') {
        regEmailDom.value = selEmailDom.value;
      } else {
        regEmailDom.value = '';
        regEmailDom.focus();
      }
    });
  }
}






