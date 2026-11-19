// 프로젝트 목록 — 새 프로젝트는 여기에 추가하면 카드가 자동으로 생깁니다.
// 각 프로젝트는 projects/ 폴더 안에 있습니다. (배포 시 함께 올라가야 404가 나지 않습니다)
const projects = [
  {
    title: "Todo App",
    icon: "✅",
    description: "할 일을 추가·완료·삭제하고 브라우저에 저장하는 심플한 할 일 관리 앱.",
    tags: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    url: "projects/todo/index.html",
    color: "#4ade80",
    glow: "rgba(74, 222, 128, 0.18)",
  },
  {
    title: "환율 변환기",
    icon: "💱",
    description: "통화를 선택하고 금액을 입력하면 최신 환율로 바로 계산해주는 변환기.",
    tags: ["HTML", "CSS", "JavaScript", "API"],
    url: "projects/exchange/index.html",
    color: "#7c9cff",
    glow: "rgba(124, 156, 255, 0.18)",
  },
  {
    title: "스네이크 게임",
    icon: "🐍",
    description: "방향키로 뱀을 움직여 먹이를 먹고 점수를 쌓는 아케이드 게임.",
    tags: ["HTML", "Canvas", "JavaScript", "Game"],
    url: "projects/snake/index.html",
    color: "#f472b6",
    glow: "rgba(244, 114, 182, 0.18)",
  },
];

function createCard(project, index) {
  const card = document.createElement("a");
  card.className = "card";
  card.href = encodeURI(project.url);
  card.style.setProperty("--card-color", project.color);
  card.style.setProperty("--card-glow", project.glow);
  card.style.animationDelay = `${index * 0.12}s`;
  card.setAttribute("aria-label", `${project.title} 프로젝트로 이동`);

  card.innerHTML = `
    <div class="card-icon" aria-hidden="true">${project.icon}</div>
    <h2>${project.title}</h2>
    <p>${project.description}</p>
    <ul class="tags">
      ${project.tags.map((tag) => `<li>${tag}</li>`).join("")}
    </ul>
    <span class="card-link">프로젝트 보기 <span class="arrow">→</span></span>
  `;
  return card;
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("projects");
  projects.forEach((project, i) => grid.appendChild(createCard(project, i)));
  document.getElementById("year").textContent = new Date().getFullYear();
});
