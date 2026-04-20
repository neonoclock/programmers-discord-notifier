import type { DeliveryLog, ExtensionSettings } from '../types';

const SETTINGS_KEY = 'settings';
const LOGS_KEY = 'delivery_logs';
const FINGERPRINTS_KEY = 'recent_fingerprints';

const MAX_LOGS = 50;
const MAX_FINGERPRINTS = 100;

export const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  webhookUrl: '',
  displayName: '',
  sendOnlySuccess: false,
  includeProblemLink: true,
};

export async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] ?? {}) };
}

export async function saveSettings(settings: ExtensionSettings): Promise<void> {
  await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
}

export async function getLogs(): Promise<DeliveryLog[]> {
  const result = await chrome.storage.local.get(LOGS_KEY);
  return result[LOGS_KEY] ?? [];
}

export async function appendLog(log: DeliveryLog): Promise<void> {
  const logs = await getLogs();
  const updated = [log, ...logs].slice(0, MAX_LOGS);
  await chrome.storage.local.set({ [LOGS_KEY]: updated });
}

export async function getFingerprints(): Promise<Record<string, number>> {
  const result = await chrome.storage.local.get(FINGERPRINTS_KEY);
  return result[FINGERPRINTS_KEY] ?? {};
}

export async function hasFingerprint(fp: string): Promise<boolean> {
  const fps = await getFingerprints();
  const savedAt = fps[fp];
  if (!savedAt) return false;
  // 1시간 TTL
  return Date.now() - savedAt < 60 * 60 * 1000;
}

export async function saveFingerprint(fp: string): Promise<void> {
  const fps = await getFingerprints();
  fps[fp] = Date.now();

  // 오래된 것 제거 후 최대 개수 유지
  const entries = Object.entries(fps)
    .filter(([, ts]) => Date.now() - ts < 60 * 60 * 1000)
    .sort(([, a], [, b]) => b - a)
    .slice(0, MAX_FINGERPRINTS);

  await chrome.storage.local.set({
    [FINGERPRINTS_KEY]: Object.fromEntries(entries),
  });
}
