// DOM에서 문제 정보를 보조적으로 추출하는 함수들
// 프로그래머스 DOM 구조가 바뀌면 이 파일만 수정하면 됨

export function getProblemTitle(): string | undefined {
  const selectors = [
    'h1.challenge-title',
    '[data-testid="problem-title"]',
    '.challenge-info-title h1',
    '.lesson-content h1',
    '.algorithm-title',
    'h3.title',
    'h2.title',
    'h1',
  ];

  for (const sel of selectors) {
    const text = document.querySelector(sel)?.textContent?.trim();
    if (text) return text;
  }

  // document.title 에서 파싱 (예: "문제 제목 | 프로그래머스 스쿨")
  const titleParts = document.title.split('|');
  if (titleParts.length >= 2) {
    const candidate = titleParts[0].trim();
    if (candidate) return candidate;
  }

  return undefined;
}

export function getSelectedLanguage(): string | undefined {
  const langParam = new URLSearchParams(location.search).get('language');
  if (langParam) return langParam;

  const selectors = [
    'select[name="language"] option:checked',
    '.language-select option:checked',
    '[data-testid="language-select"] option:checked',
  ];

  for (const sel of selectors) {
    const text = document.querySelector(sel)?.textContent?.trim();
    if (text) return text;
  }
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
