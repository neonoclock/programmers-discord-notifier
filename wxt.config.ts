import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Programmers Notifier',
    description: '프로그래머스 제출 결과를 디스코드로 자동 전송합니다',
    icons: {
      '16': 'icon-16.png',
      '32': 'icon-32.png',
      '48': 'icon-48.png',
      '128': 'icon-128.png',
    },
    permissions: ['storage'],
    host_permissions: [
      'https://school.programmers.co.kr/*',
      'https://programmers.co.kr/*',
      'https://discord.com/api/webhooks/*',
    ],
  },
});
