# Programmers Notifier

프로그래머스에서 코드를 제출하면 결과를 디스코드로 자동 전송하는 Chrome 확장 프로그램입니다.

## 기능

- 프로그래머스 채점 결과 자동 감지 (통과 / 실패)
- 디스코드 웹훅으로 결과 전송
- 언어, 레벨, 문제 링크 포함 옵션
- 성공만 전송 옵션
- 최근 전송 기록 확인

## 설치

1. 저장소 클론 후 의존성 설치
   ```bash
   npm install
   ```

2. 빌드
   ```bash
   npm run build
   ```

3. Chrome에서 `chrome://extensions` 접속 → **개발자 모드** 활성화 → **압축 해제된 확장 프로그램 로드** → `.output/chrome-mv3` 폴더 선택

## 사용법

1. 확장 프로그램 아이콘 클릭
2. 디스코드 웹훅 URL 입력 후 저장
3. 프로그래머스에서 코드 제출 시 자동으로 디스코드 알림 전송

### 디스코드 웹훅 발급 방법

디스코드 채널 설정 → **연동** → **웹후크** → **새 웹후크** → URL 복사

## 개발

```bash
npm run dev   # 개발 모드 (핫 리로드)
npm run build # 프로덕션 빌드
npm run zip   # 배포용 zip 생성
```

## 기술 스택

- [WXT](https://wxt.dev/) — Chrome 확장 프로그램 프레임워크
- React + TypeScript
- Discord Webhook API
