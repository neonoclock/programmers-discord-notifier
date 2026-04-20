import { getDomInfo } from '../lib/parser/dom-bridge';
import { parseResultFromModalTitle } from '../lib/parser/programmers';
import type { SubmissionEvent } from '../lib/types';

export default defineContentScript({
  matches: [
    'https://school.programmers.co.kr/*',
    'https://programmers.co.kr/*',
  ],
  runAt: 'document_idle',

  async main(ctx) {
    watchResultModal(ctx);
  },
});

function watchResultModal(ctx: { onInvalidated: (cb: () => void) => void }) {
  let lastSentTitle = '';
  let lastSentAt = 0;

  function handleModalChange(modal: Element) {
    if (!modal.classList.contains('show')) return;

    const titleEl = modal.querySelector('h4.modal-title');
    if (!titleEl?.textContent) return;

    const titleText = titleEl.textContent.trim();
    const result = parseResultFromModalTitle(titleText);
    if (result === 'unknown') return;

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

    try {
      chrome.runtime.sendMessage({ type: 'SUBMISSION_EVENT', payload: event });
    } catch {
      // 컨텍스트 무효화 시 무시
    }
  }

  // #modal-dialog가 이미 있으면 바로 감시, 없으면 body에서 찾을 때까지 대기
  function attachModalObserver(modal: Element): MutationObserver {
    const obs = new MutationObserver(() => handleModalChange(modal));
    obs.observe(modal, { attributes: true, attributeFilter: ['class'] });
    return obs;
  }

  let modalObserver: MutationObserver | null = null;

  const existingModal = document.querySelector('#modal-dialog');
  if (existingModal) {
    modalObserver = attachModalObserver(existingModal);
  }

  // 모달이 아직 없으면 body를 잠깐 감시하다 발견하면 전환
  const bodyObserver = new MutationObserver(() => {
    if (modalObserver) return;
    const modal = document.querySelector('#modal-dialog');
    if (!modal) return;
    modalObserver = attachModalObserver(modal);
    bodyObserver.disconnect();
  });

  if (!existingModal) {
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

  ctx.onInvalidated(() => {
    modalObserver?.disconnect();
    bodyObserver.disconnect();
  });
}
