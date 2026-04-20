import type { SubmissionResult } from '../types';

// 모달 제목 텍스트로 결과 판별
// "정답입니다!" → success, "틀렸습니다" / "시간 초과" 등 → fail
export function parseResultFromModalTitle(title: string): SubmissionResult {
  if (title.includes('정답')) return 'success';
  if (
    title.includes('틀렸') ||
    title.includes('시간 초과') ||
    title.includes('런타임 에러') ||
    title.includes('컴파일 에러') ||
    title.includes('메모리 초과') ||
    title.includes('실패')
  ) return 'fail';
  return 'unknown';
}

// URL에서 문제 ID 추출
export function parseProblemId(url: string): string | undefined {
  const match = url.match(/\/challenges\/(\d+)/) ?? url.match(/\/lessons\/(\d+)/);
  return match?.[1];
}
