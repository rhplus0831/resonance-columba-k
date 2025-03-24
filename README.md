---
name: 콜룸바 상공회의소
slug: resonance-roundtable
description: 레조넌스 콜룸바 상공회의소 데이터 공유 스테이션
framework: Next.js
css: Tailwind
database: Firebase Cloud Firestore
---

# 레조넌스 콜룸바 상공회의소 데이터 공유 스테이션

 [![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/pinisok)

## 웹사이트트

https://www.resonance-columba.com/

## Development
![Tech Stack](https://github-readme-tech-stack.vercel.app/api/cards?lineCount=1&line1=react%2Creact%2Cauto%3Bnext.js%2Cnext.js%2Cffffff%3Bvercel%2Cvercel%2Cffffff%3Bfirebase%2Cfirebase%2Cauto%3B&title=Tech%20Stack&align=center&titleAlign=center&fontSize=20&lineHeight=10)

### 개발 환경

#### 브랜치
`main` : 프로덕션 환경, `develop`: 개발 환경 브랜치 
`develop` 브랜치로 PR을 제출해주세요.

#### Web - Next.js

##### 환경
Node.js 18  
패키지 관리자 [pnpm](https://pnpm.io/installation)

##### 환경 변수
`.env.example` 파일을 `.env.local` 로 복사하고 수정해서 사용하세요. 


#### 데이터베이스스 - Firebase Cloud Firestore

##### 소프트웨어어
[firebase-cli](https://firebaseopensource.com/projects/firebase/firebase-tools/#installation) firebase 프로젝트를 설정하고, 로컬 firestore 시뮬레이터에 사용됩니다.
[firestore emulator](https://firebase.google.com/docs/emulator-suite/connect_firestore?hl=zh-cn)  로컬 데이터베이스스
`.env.local` 파일에서 `FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"`로 설정하면, firebase-admin이 자동으로 firestore 에뮬레이터과 연결됩니다.

### 배포
#### Vercel
해당 Next.js 프로젝트는 Vercel의 자동 배포로 구성되어 있습니다.
`main` 브랜치의 코드는 자동으로 [프로덕션 환경](https://resonance-roundtable.vercel.app/)에 배포됩니다.
다른 모든 브랜치의 코드는 `vercel.app` 도메인을 통해 프리뷰 환경으로 배포됩니다.  
Vercel Functions(APIs) 는 서울에 위치한 서버를 사용하도록 설정되어 있습니다.

#### Firebase Cloud Firestore
Firebase Cloud Firestore 데이터 베이스를 사용합니다.
웹사이트의 프로덕션/프리뷰 환경 모두 같은 데이터베이스에 연결되어 있습니다.
프로덕션 환경은 `columba` 컬렉션을, 미리보기 환경은 `columba-dev` 컬렉션을 사용합니다.  
Firebase 프로젝트

## 원본 프로젝트 기여자

원작자 스폰서
[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/NathanKun)
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/SilyASilyF"><img src="https://avatars.githubusercontent.com/u/18006559?v=4?s=100" width="100px;" alt="SilyASilyF"/><br /><sub><b>SilyASilyF</b></sub></a><br /><a href="#data-SilyASilyF" title="Data">🔣</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/RudeusGreyrat666"><img src="https://avatars.githubusercontent.com/u/148561865?v=4?s=100" width="100px;" alt="RudeusGreyrat666"/><br /><sub><b>RudeusGreyrat666</b></sub></a><br /><a href="#data-RudeusGreyrat666" title="Data">🔣</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Tsuk1ko"><img src="https://avatars.githubusercontent.com/u/24877906?v=4?s=100" width="100px;" alt="神代綺凛"/><br /><sub><b>神代綺凛</b></sub></a><br /><a href="#bug-Tsuk1ko" title="Bug reports">🐛</a> <a href="#code-Tsuk1ko" title="Code">💻</a> <a href="#data-Tsuk1ko" title="Data">🔣</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/arises"><img src="https://avatars.githubusercontent.com/u/19305811?v=4?s=100" width="100px;" alt="arises"/><br /><sub><b>arises</b></sub></a><br /><a href="#bug-arises" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/EEEExciting"><img src="https://avatars.githubusercontent.com/u/23447813?v=4?s=100" width="100px;" alt="EEEExciting"/><br /><sub><b>EEEExciting</b></sub></a><br /><a href="#bug-EEEExciting" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/cls1997"><img src="https://avatars.githubusercontent.com/u/6021683?v=4?s=100" width="100px;" alt="ChenLingshu"/><br /><sub><b>ChenLingshu</b></sub></a><br /><a href="#ideas-cls1997" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DaiMao204"><img src="https://avatars.githubusercontent.com/u/64579140?v=4?s=100" width="100px;" alt="DaiMao"/><br /><sub><b>DaiMao</b></sub></a><br /><a href="#data-DaiMao204" title="Data">🔣</a> <a href="#code-DaiMao204" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
