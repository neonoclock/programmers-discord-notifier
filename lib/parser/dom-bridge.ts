// content script 컨텍스트에서 DOM을 읽는 함수 묶음
// injected.ts와 달리 이쪽은 DOM 접근용

import { getProblemUrl, getProblemTitle, getSelectedLanguage, getProblemLevel } from './dom';
import { parseProblemId } from './programmers';

export function getDomInfo() {
  const problemUrl = getProblemUrl();
  return {
    problemUrl,
    problemId: parseProblemId(problemUrl),
    problemTitle: getProblemTitle(),
    language: getSelectedLanguage(),
    level: getProblemLevel(),
  };
}
