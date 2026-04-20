import { useEffect, useState } from 'react';
import type { DeliveryLog, ExtensionSettings } from '../../lib/types';
import { DEFAULT_SETTINGS } from '../../lib/storage/settings';

export default function App() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }),
      chrome.runtime.sendMessage({ type: 'GET_LOGS' }),
    ]).then(([settingsRes, logsRes]) => {
      if (settingsRes.ok) setSettings(settingsRes.data as ExtensionSettings);
      if (logsRes.ok) setLogs(logsRes.data as DeliveryLog[]);
      setLoading(false);
    });
  }, []);

  async function save() {
    const res = await chrome.runtime.sendMessage({ type: 'SAVE_SETTINGS', payload: settings });
    setStatus(res.ok ? '저장되었습니다' : `오류: ${res.error}`);
    setTimeout(() => setStatus(''), 2000);
  }

  async function testWebhook() {
    if (!settings.webhookUrl) return setStatus('웹훅 URL을 먼저 입력하세요');
    const res = await chrome.runtime.sendMessage({
      type: 'TEST_WEBHOOK',
      payload: { webhookUrl: settings.webhookUrl },
    });
    setStatus(res.ok ? '테스트 전송 성공!' : `오류: ${res.error}`);
    setTimeout(() => setStatus(''), 3000);
  }

  if (loading) return <div className="p">로딩 중...</div>;

  return (
    <div className="container">
      <h1>Programmers Notifier</h1>

      <label>
        <span>활성화</span>
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
        />
      </label>

      <label>
        <span>디스코드 웹훅 URL</span>
        <input
          type="text"
          placeholder="https://discord.com/api/webhooks/..."
          value={settings.webhookUrl}
          onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
        />
      </label>

      <label>
        <span>표시 이름 (선택)</span>
        <input
          type="text"
          placeholder="홍길동"
          value={settings.displayName}
          onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
        />
      </label>

      <label>
        <span>성공만 전송</span>
        <input
          type="checkbox"
          checked={settings.sendOnlySuccess}
          onChange={(e) => setSettings({ ...settings, sendOnlySuccess: e.target.checked })}
        />
      </label>

      <label>
        <span>문제 링크 포함</span>
        <input
          type="checkbox"
          checked={settings.includeProblemLink}
          onChange={(e) => setSettings({ ...settings, includeProblemLink: e.target.checked })}
        />
      </label>

      <div className="button-row">
        <button onClick={save}>저장</button>
        <button onClick={testWebhook}>테스트 전송</button>
      </div>

      {status && <p className="status">{status}</p>}

      <h2>최근 전송 기록</h2>
      {logs.length === 0 ? (
        <p className="muted">기록 없음</p>
      ) : (
        <ul className="log-list">
          {logs.slice(0, 10).map((log) => (
            <li key={log.fingerprint} className={log.success ? 'ok' : 'err'}>
              <span>{log.problemTitle ?? '제목 없음'}</span>
              <span>{log.result === 'success' ? '✅' : '❌'}</span>
              <span className="time">{new Date(log.sentAt).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
