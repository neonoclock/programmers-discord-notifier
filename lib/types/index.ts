export type SubmissionResult = 'success' | 'fail' | 'unknown';

export type SubmissionEvent = {
  platform: 'programmers';
  url: string;
  detectedAt: number;
  problemId?: string;
  problemTitle?: string;
  language?: string;
  level?: string;
  result: SubmissionResult;
  rawStatus?: string;
  source: 'fetch' | 'xhr' | 'dom';
};

export type ExtensionSettings = {
  enabled: boolean;
  webhookUrl: string;
  displayName: string;
  sendOnlySuccess: boolean;
  includeProblemLink: boolean;
};

export type DeliveryLog = {
  fingerprint: string;
  sentAt: number;
  success: boolean;
  problemTitle?: string;
  result: SubmissionResult;
  errorMessage?: string;
};

// window.postMessage 페이로드 타입
export type InjectedMessage = {
  source: 'programmers-hook';
  type: 'SUBMISSION_DETECTED';
  payload: {
    url: string;
    responseBody: unknown;
    detectedAt: number;
  };
};

// content → background 메시지 타입
export type RuntimeMessage =
  | { type: 'SUBMISSION_EVENT'; payload: SubmissionEvent }
  | { type: 'GET_LOGS' }
  | { type: 'GET_SETTINGS' }
  | { type: 'SAVE_SETTINGS'; payload: ExtensionSettings }
  | { type: 'TEST_WEBHOOK'; payload: { webhookUrl: string } };

export type RuntimeResponse =
  | { ok: true; data?: unknown }
  | { ok: false; error: string };
