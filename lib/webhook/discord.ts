import type { ExtensionSettings, SubmissionEvent } from '../types';

type DiscordEmbed = {
  title: string;
  description?: string;
  color: number;
  fields: { name: string; value: string; inline?: boolean }[];
  url?: string;
  footer?: { text: string };
  timestamp?: string;
};

type WebhookPayload = {
  username: string;
  embeds: DiscordEmbed[];
};

const COLOR = {
  success: 0x2ecc71, // green
  fail: 0xe74c3c,    // red
  unknown: 0x95a5a6, // gray
} as const;

function buildEmbed(event: SubmissionEvent, settings: ExtensionSettings): DiscordEmbed {
  const isSuccess = event.result === 'success';
  const resultLabel = isSuccess ? '✅ 통과' : event.result === 'fail' ? '❌ 실패' : '❓ 알 수 없음';
  const title = `${resultLabel} — ${event.problemTitle ?? '제목 미확인'}`;

  const fields: DiscordEmbed['fields'] = [
    { name: '플랫폼', value: 'Programmers', inline: true },
    { name: '결과', value: resultLabel, inline: true },
  ];

  if (event.language) fields.push({ name: '언어', value: event.language, inline: true });
  if (event.level) fields.push({ name: '레벨', value: event.level, inline: true });
  if (settings.displayName) fields.push({ name: '풀이자', value: settings.displayName, inline: true });

  return {
    title,
    color: COLOR[event.result],
    fields,
    url: settings.includeProblemLink ? event.url : undefined,
    timestamp: new Date(event.detectedAt).toISOString(),
    footer: { text: 'Programmers Discord Notifier' },
  };
}

export async function sendToDiscord(
  event: SubmissionEvent,
  settings: ExtensionSettings,
): Promise<void> {
  if (!settings.webhookUrl) throw new Error('웹훅 URL이 설정되지 않았습니다');

  const payload: WebhookPayload = {
    username: 'Programmers Notifier',
    embeds: [buildEmbed(event, settings)],
  };

  const res = await fetch(settings.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Discord 전송 실패: ${res.status} ${text.slice(0, 100)}`);
  }
}

export async function testWebhook(webhookUrl: string): Promise<void> {
  const payload: WebhookPayload = {
    username: 'Programmers Notifier',
    embeds: [
      {
        title: '✅ 웹훅 연결 테스트',
        description: '정상적으로 연결되었습니다!',
        color: COLOR.success,
        fields: [],
        timestamp: new Date().toISOString(),
        footer: { text: 'Programmers Discord Notifier' },
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`테스트 실패: ${res.status}`);
}
