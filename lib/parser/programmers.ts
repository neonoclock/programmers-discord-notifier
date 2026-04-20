import type { SubmissionResult } from '../types';

// 제출 관련 URL인지 판단
export function isSubmissionUrl(url: string): boolean {
  const patterns = [
    /\/submissions$/,
    /\/submit$/,
    /\/judge/,
    /\/result/,
    /\/grading/,
    /challenges\/\d+\/submissions/,
  ];
  return patterns.some((p) => p.test(url));
}

// 응답 JSON에서 제출 결과 파싱
export function parseResultFromResponse(body: unknown): SubmissionResult {
  if (typeof body !== 'object' || body === null) return 'unknown';

  const b = body as Record<string, unknown>;

  // 프로그래머스 응답 구조에 맞게 확장 필요
  const status =
    b['result'] ?? b['status'] ?? b['grade'] ?? b['pass'] ?? b['success'];

  if (status === true || status === 'success' || status === 'pass' || status === 'correct') {
    return 'success';
  }
  if (status === false || status === 'fail' || status === 'failure' || status === 'wrong') {
    return 'fail';
  }

  // 배열 형태 케이스 (테스트케이스별 결과)
  if (Array.isArray(b['results'])) {
    const results = b['results'] as unknown[];
    const allPass = results.every((r) => {
      if (typeof r === 'object' && r !== null) {
        const result = (r as Record<string, unknown>)['result'];
        return result === true || result === 'pass' || result === 'success';
      }
      return false;
    });
    if (results.length > 0) return allPass ? 'success' : 'fail';
  }

  return 'unknown';
}

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
