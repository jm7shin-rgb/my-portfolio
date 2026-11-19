const STORAGE_KEY = "todos";

// 할 일 데이터 (LocalStorage에서 불러옴)
let todos = loadTodos();
let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;

// 현재 필터: "all" | "active" | "completed"
let currentFilter = "all";

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // 저장소를 쓸 수 없는 환경(시크릿 모드 등)에서는 메모리에만 유지
  }
}

function initApp() {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const filters = document.getElementById("filters");
  const clearButton = document.getElementById("clear-completed");

  // 데이터 변경 후 호출: 저장 + 화면 갱신
  const update = () => {
    saveTodos();
    render();
  };

  // 추가: 버튼 클릭과 Enter 키 모두 form의 submit 이벤트로 처리됨
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();

    if (text === "") {
      alert("할 일을 입력하세요");
      input.focus();
      return;
    }

    if (todos.some((t) => t.text === text)) {
      alert("이미 등록된 할 일입니다");
      input.focus();
      return;
    }

    todos.push({ id: nextId++, text, completed: false });
    input.value = "";
    input.focus();
    update();
  });

  // 완료 토글 / 삭제: 목록에 이벤트 위임
  list.addEventListener("change", (event) => {
    if (!event.target.classList.contains("todo-checkbox")) return;
    const id = Number(event.target.closest(".todo-item").dataset.id);
    const todo = todos.find((t) => t.id === id);
    if (todo) todo.completed = event.target.checked;
    update();
  });

  list.addEventListener("click", (event) => {
    if (!event.target.classList.contains("delete-button")) return;
    const id = Number(event.target.closest(".todo-item").dataset.id);
    todos = todos.filter((t) => t.id !== id);
    update();
  });

  // 필터 선택
  filters.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-button");
    if (!button) return;
    currentFilter = button.dataset.filter;
    render();
  });

  // 완료된 항목 일괄 삭제
  clearButton.addEventListener("click", () => {
    todos = todos.filter((t) => !t.completed);
    update();
  });

  render();
}

// 현재 필터에 맞는 항목만 반환
function getVisibleTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.completed);
  if (currentFilter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

// 배열 내용을 화면에 그림
function render() {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  getVisibleTodos().forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");
    li.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text; // textContent로 넣어 HTML 삽입 방지

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.setAttribute("aria-label", "삭제");
    deleteButton.textContent = "✕";

    li.append(checkbox, span, deleteButton);
    list.appendChild(li);
  });

  // 선택된 필터 강조
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
  });

  renderStats();
}

// 할 일 개수 표시 + 일괄 삭제 버튼 상태
function renderStats() {
  const total = todos.length;
  const done = todos.filter((t) => t.completed).length;
  document.getElementById("todo-stats").innerHTML =
    `전체 <strong>${total}</strong>개 · 완료 <strong>${done}</strong>개`;
  document.getElementById("clear-completed").disabled = done === 0;
}

initApp();
