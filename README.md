<h1 align="center">
  <img src="public/icon-128.png" alt="Programmers Notifier" width="128">
  <br>
  Programmers Notifier
</h1>

<p align="center">
  <font size="5">Automatically send your Programmers results to Discord.</font>
  <br>
  <br>
  <br>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"/></a>
  <a href="https://github.com/neonoclock/programmers-discord-notifier"><img src="https://img.shields.io/github/stars/neonoclock/programmers-discord-notifier?style=social" alt="stars"/></a>
</p>

<br />

- [Programmers Notifier란?](#programmers-notifier란)
- [사용 방법](#사용-방법)
- [1. 일반 사용자](#1-일반-사용자)
- [2. 디스코드 서버 관리자](#2-디스코드-서버-관리자)
- [Contributors](#contributors)

<br />

## Programmers Notifier란?

- **Programmers Notifier**는 프로그래머스에서 코드를 제출하면 채점 결과를 디스코드로 자동 전송하는 Chrome 확장 프로그램입니다.
- 핵심 기능은 프로그래머스 제출 결과를 웹훅을 통해 디스코드 서버로 자동 공유하는 것입니다.

<br />

## 사용 방법

- 이 프로그램은 `디스코드 웹훅`을 기반으로 작동합니다.
- 웹훅은 **서버 관리자만 생성할 수 있으므로** 서버 관리자와 일반 사용자 간의 협력이 중요합니다.

<br />

## 1. 일반 사용자

**1. 확장 프로그램을 설치해주세요.**

아직 웹 스토어에 등록되지 않은 경우, 아래 개발 빌드 방법을 참고해 직접 설치할 수 있습니다.

<br />

**2. 확장 프로그램 아이콘을 클릭해 설정을 완료하세요.**

- **디스코드 웹훅 URL**: 서버 관리자에게 제공받은 웹훅 URL을 입력합니다.
- **표시 이름**: 디스코드 메시지에 표시될 이름을 설정합니다. (선택)
- **성공만 전송**: 정답인 경우에만 알림을 보냅니다.
- **문제 링크 포함**: 메시지에 문제 URL을 포함합니다.

설정 후 **저장** 버튼을 누르세요. **테스트 전송** 버튼으로 정상 연결 여부를 확인할 수 있습니다.

<br />

**3. 프로그래머스에서 코드를 제출하세요!**

`정답입니다!` 또는 `틀렸습니다` 등의 채점 결과를 자동으로 감지해 디스코드로 전송합니다.

<br />

> [!WARNING]
> 디스코드 웹훅은 URL만으로 해당 채널에 메시지를 전송할 수 있습니다.
> 반드시 신뢰할 수 있는 팀원과만 공유하며, **외부에 노출되지 않도록 각별히 주의하세요.**
> 외부에 노출될 경우 원치 않는 스팸 메시지 공격을 받을 위험이 있습니다.

<br />

## 2. 디스코드 서버 관리자

**1. `서버 설정` → `연동` → `웹후크 만들기`를 눌러주세요.**

서버 주인뿐만 아니라 관리자 권한이 있다면 누구든 가능합니다.

**2. 웹훅의 이름, 프로필 사진, 채널을 설정해주세요.**

**3. `웹훅 URL 복사` 버튼을 눌러 서버 멤버들에게 공유해주세요.**

> [!WARNING]
> 디스코드 웹훅은 URL만으로 해당 채널에 메시지를 전송할 수 있습니다.
> 반드시 신뢰할 수 있는 팀원과만 공유하며, **외부에 노출되지 않도록 각별히 주의하세요.**

<br />

## Contributors

<a href='https://github.com/neonoclock/programmers-discord-notifier/graphs/contributors'>
  <img src='https://contrib.rocks/image?repo=neonoclock/programmers-discord-notifier'>
</a>

<br />
<br />
