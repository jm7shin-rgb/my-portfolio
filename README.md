# My Portfolio

클로드 코드(Claude Code)와 바이브 코딩으로 만든 작은 웹 프로젝트 모음입니다.
메인 페이지에서 프로젝트 카드를 클릭하면 각 앱으로 이동합니다.

## 데모

- **Vercel**: https://my-portfolio-liart-omega-21.vercel.app/
- **GitHub Pages**: https://jm7shin-rgb.github.io/my-portfolio/

## 프로젝트

| 프로젝트 | 설명 | 주요 기술 |
| --- | --- | --- |
| ✅ [Todo App](projects/todo/) | 할 일을 추가·완료·삭제하고 브라우저에 저장하는 할 일 관리 앱 | JavaScript, LocalStorage |
| 💱 [환율 변환기](projects/exchange/) | 통화를 고르고 금액을 입력하면 최신 환율로 계산해 주는 변환기 | JavaScript, Fetch API |
| 🐍 [스네이크 게임](projects/snake/) | 방향키로 뱀을 움직여 먹이를 먹고 점수를 쌓는 아케이드 게임 | JavaScript, Canvas |

## 폴더 구조

```
my-portfolio/
├── index.html      # 포트폴리오 메인 페이지
├── style.css       # 다크 모드 스타일
├── main.js         # 프로젝트 카드 목록 및 렌더링
└── projects/
    ├── todo/       # Todo App
    ├── exchange/   # 환율 변환기
    └── snake/      # 스네이크 게임
```

## 로컬에서 실행하기

별도 설치 없이 `index.html`을 브라우저로 열면 됩니다.

## 새 프로젝트 추가하기

1. `projects/` 아래에 새 폴더를 만들고 앱 파일을 넣습니다.
2. `main.js`의 `projects` 배열에 항목을 하나 추가하면 카드가 자동으로 생깁니다.

## 사용 기술

HTML · CSS · JavaScript (프레임워크 없이 순수 웹 기술로 제작)
