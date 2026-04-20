// DOM에서 문제 정보를 보조적으로 추출하는 함수들
// 프로그래머스 DOM 구조가 바뀌면 이 파일만 수정하면 됨

export function getProblemTitle(): string | undefined {
  const selectors = [
    'h1.challenge-title',
    '[data-testid="problem-title"]',
    '.challenge-info-title h1',
    '.lesson-content h1',
    'h1',
  ];

  for (const sel of selectors) {
    const text = document.querySelector(sel)?.textContent?.trim();
    if (text) return text;
  }
  return undefined;
}

export function getSelectedLanguage(): string | undefined {
  const selectors = [
    'select[name="language"] option:checked',
    '.language-select option:checked',
    '[data-testid="language-select"] option:checked',
  ];

  for (const sel of selectors) {
    const text = document.querySelector(sel)?.textContent?.trim();
    if (text) return text;
  }

  // URL 파라미터에서 시도
  const langParam = new URLSearchParams(location.search).get('language');
  return langParam ?? undefined;
}

export function getProblemLevel(): string | undefined {
  const selectors = [
    '.difficulty',
    '[data-testid="difficulty"]',
    '.challenge-info-level',
  ];

  for (const sel of selectors) {
    const text = document.querySelector(sel)?.textContent?.trim();
    if (text) return text;
  }
  return undefined;
}

export function getProblemUrl(): string {
  // 문제 고유 페이지 URL만 남기고 쿼리스트링 제거
  return `${location.origin}${location.pathname}`;
}
