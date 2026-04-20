import { isSubmissionUrl } from '../lib/parser/programmers';

export default defineUnlistedScript(() => {
  function postSubmissionDetected(url: string, responseBody: unknown) {
    window.postMessage(
      {
        source: 'programmers-hook',
        type: 'SUBMISSION_DETECTED',
        payload: { url, responseBody, detectedAt: Date.now() },
      },
      '*',
    );
  }

  function safeParse(text: string): unknown {
    try { return JSON.parse(text); } catch { return text; }
  }

  // fetch 후킹
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const response = await originalFetch(...args);
    try {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      if (isSubmissionUrl(url)) {
        const text = await response.clone().text();
        postSubmissionDetected(url, safeParse(text));
      }
    } catch { /* 감지 실패해도 원본 응답은 그대로 반환 */ }
    return response;
  };

  // XHR 후킹
  const OriginalXHR = window.XMLHttpRequest;
  class HookedXHR extends OriginalXHR {
    private _url = '';
    open(method: string, url: string, ...rest: unknown[]) {
      this._url = url;
      return super.open(method, url, ...(rest as [boolean?, string?, string?]));
    }
    send(body?: Document | XMLHttpRequestBodyInit | null) {
      if (isSubmissionUrl(this._url)) {
        this.addEventListener('load', () => {
          try { postSubmissionDetected(this._url, safeParse(this.responseText)); }
          catch { /* ignore */ }
        });
      }
      return super.send(body);
    }
  }
  window.XMLHttpRequest = HookedXHR as typeof XMLHttpRequest;
});
