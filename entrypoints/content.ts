import { getDomInfo } from '../lib/parser/dom-bridge';
import { parseResultFromModalTitle } from '../lib/parser/programmers';
import type { SubmissionEvent } from '../lib/types';

export default defineContentScript({
  matches: [
    'https://school.programmers.co.kr/*',
    'https://programmers.co.kr/*',
  ],
  runAt: 'document_idle',

  async main() {
    watchResultModal();
  },
});

function watchResultModal() {
  // 같은 모달을 여러 번 전송하지 않기 위한 플래그
  let lastSentTitle = '';
  let lastSentAt = 0;

  const observer = new MutationObserver(() => {
    const modal = document.querySelector('#modal-dialog');
    if (!modal?.classList.contains('show')) return;

    const titleEl = modal.querySelector('h4.modal-title');
    if (!titleEl?.textContent) return;

    const titleText = titleEl.textContent.trim();
    const result = parseResultFromModalTitle(titleText);
    if (result === 'unknown') return;

    // 같은 텍스트가 5초 안에 또 오면 무시 (MutationObserver 중복 방지)
    const now = Date.now();
    if (titleText === lastSentTitle && now - lastSentAt < 5000) return;

    lastSentTitle = titleText;
    lastSentAt = now;

    const domInfo = getDomInfo();

    const event: SubmissionEvent = {
      platform: 'programmers',
      url: domInfo.problemUrl ?? location.href,
      detectedAt: now,
      problemId: domInfo.problemId,
      problemTitle: domInfo.problemTitle,
      language: domInfo.language,
      level: domInfo.level,
      result,
      rawStatus: titleText,
      source: 'dom',
    };

    chrome.runtime.sendMessage({ type: 'SUBMISSION_EVENT', payload: event });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
}
