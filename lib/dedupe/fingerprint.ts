import type { SubmissionEvent } from '../types';

// 같은 제출이 여러 경로(fetch+xhr+dom)로 동시에 감지될 수 있어서
// 분 단위 버킷으로 묶어 중복 처리
export function makeFingerprint(event: SubmissionEvent): string {
  const timeBucket = Math.floor(event.detectedAt / (60 * 1000)); // 1분 버킷
  const id = event.problemId ?? new URL(event.url).pathname;
  return `${event.platform}:${id}:${event.result}:${timeBucket}`;
}
