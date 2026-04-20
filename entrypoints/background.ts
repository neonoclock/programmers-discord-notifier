import { makeFingerprint } from '../lib/dedupe/fingerprint';
import { sendToDiscord, testWebhook } from '../lib/webhook/discord';
import {
  appendLog,
  getSettings,
  hasFingerprint,
  saveFingerprint,
  saveSettings,
  getLogs,
} from '../lib/storage/settings';
import type { ExtensionSettings, RuntimeMessage, RuntimeResponse, SubmissionEvent } from '../lib/types';

let cachedSettings: ExtensionSettings | null = null;

async function getCachedSettings(): Promise<ExtensionSettings> {
  if (!cachedSettings) cachedSettings = await getSettings();
  return cachedSettings;
}

function invalidateCache() {
  cachedSettings = null;
}

export default defineBackground(() => {
  chrome.runtime.onMessage.addListener(
    (message: RuntimeMessage, _sender, sendResponse) => {
      handleMessage(message)
        .then((res) => sendResponse(res))
        .catch((err) => sendResponse({ ok: false, error: String(err) }));
      return true;
    },
  );
});

async function handleMessage(message: RuntimeMessage): Promise<RuntimeResponse> {
  switch (message.type) {
    case 'SUBMISSION_EVENT':
      await handleSubmission(message.payload);
      return { ok: true };

    case 'GET_SETTINGS':
      return { ok: true, data: await getCachedSettings() };

    case 'SAVE_SETTINGS':
      await saveSettings(message.payload);
      invalidateCache();
      return { ok: true };

    case 'GET_LOGS':
      return { ok: true, data: await getLogs() };

    case 'TEST_WEBHOOK':
      await testWebhook(message.payload.webhookUrl);
      return { ok: true };

    default:
      return { ok: false, error: '알 수 없는 메시지 타입' };
  }
}

async function handleSubmission(event: SubmissionEvent): Promise<void> {
  const settings = await getCachedSettings();

  if (!settings.enabled) return;
  if (!settings.webhookUrl) return;
  if (settings.sendOnlySuccess && event.result !== 'success') return;
  if (event.result === 'unknown') return;

  const fp = makeFingerprint(event);
  if (await hasFingerprint(fp)) return;

  await saveFingerprint(fp);

  let sendError: string | undefined;

  try {
    await sendToDiscord(event, settings);
  } catch (err) {
    sendError = String(err);
  }

  await appendLog({
    fingerprint: fp,
    sentAt: Date.now(),
    success: !sendError,
    problemTitle: event.problemTitle,
    result: event.result,
    errorMessage: sendError,
  });
}
