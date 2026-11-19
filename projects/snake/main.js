// ===== 설정 =====
const CANVAS_SIZE = 400;
const GRID = 20;                       // 20x20 격자
const CELL = CANVAS_SIZE / GRID;       // 한 칸 = 20px
const POINTS_PER_LEVEL = 50;           // 50점마다 레벨업
const SPEED_STEP = 10;                 // 레벨업마다 10ms 빨라짐
const MIN_SPEED = 30;                  // 이보다 빨라지지 않음(ms)
const HIGH_SCORE_KEY = "snakeHighScore";

// ===== DOM =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const levelEl = document.getElementById("level");
const finalScoreEl = document.getElementById("final-score");
const finalLevelEl = document.getElementById("final-level");
const startScreen = document.getElementById("start-screen");
const pauseScreen = document.getElementById("pause-screen");
const gameoverScreen = document.getElementById("gameover-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const pauseBtn = document.getElementById("pause-btn");
const difficultySelect = document.getElementById("difficulty");

// ===== 상태 =====
let snake = [];
let direction, nextDirection, food, score, level, baseSpeed;
let timer = null;
let playing = false;
let paused = false;
let highScore = loadHighScore();
highScoreEl.textContent = highScore;

function loadHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(value) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
  } catch {
    // 저장소를 사용할 수 없는 환경이면 무시
  }
}

// 현재 레벨의 이동 간격(ms)
function currentSpeed() {
  return Math.max(MIN_SPEED, baseSpeed - (level - 1) * SPEED_STEP);
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(tick, currentSpeed());
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

// ===== 게임 흐름 =====
function startGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  level = 1;
  baseSpeed = Number(difficultySelect.value);
  scoreEl.textContent = score;
  levelEl.textContent = level;
  placeFood();

  playing = true;
  paused = false;
  pauseBtn.textContent = "일시정지";
  pauseBtn.disabled = false;
  difficultySelect.disabled = true;   // 게임 중에는 난이도 변경 불가

  startScreen.classList.add("hidden");
  pauseScreen.classList.add("hidden");
  gameoverScreen.classList.add("hidden");

  startTimer();
  draw();
}

function togglePause() {
  if (!playing) return;
  paused = !paused;
  if (paused) {
    stopTimer();
    pauseBtn.textContent = "재개";
    pauseScreen.classList.remove("hidden");
  } else {
    startTimer();
    pauseBtn.textContent = "일시정지";
    pauseScreen.classList.add("hidden");
  }
}

function tick() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // 벽 충돌
  if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
    return gameOver();
  }

  const willEat = head.x === food.x && head.y === food.y;

  // 자기 몸 충돌 (먹지 않을 땐 꼬리가 빠지므로 꼬리 칸은 제외)
  const body = willEat ? snake : snake.slice(0, -1);
  if (body.some((s) => s.x === head.x && s.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  if (willEat) {
    score += 10;
    scoreEl.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
      saveHighScore(highScore);
    }
    checkLevelUp();
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function checkLevelUp() {
  const newLevel = Math.floor(score / POINTS_PER_LEVEL) + 1;
  if (newLevel > level) {
    level = newLevel;
    levelEl.textContent = level;
    startTimer();                      // 빨라진 속도로 다시 시작
  }
}

function gameOver() {
  stopTimer();
  playing = false;
  paused = false;
  pauseBtn.textContent = "일시정지";
  pauseBtn.disabled = true;
  difficultySelect.disabled = false;
  finalScoreEl.textContent = score;
  finalLevelEl.textContent = level;
  gameoverScreen.classList.remove("hidden");
}

function placeFood() {
  const free = [];
  for (let x = 0; x < GRID; x++) {
    for (let y = 0; y < GRID; y++) {
      if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
    }
  }
  food = free[Math.floor(Math.random() * free.length)];
}

// ===== 그리기 =====
function draw() {
  ctx.fillStyle = "#11111b";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 격자선
  ctx.strokeStyle = "#1e1e2e";
  for (let i = 0; i <= GRID; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, CANVAS_SIZE);
    ctx.moveTo(0, i * CELL);
    ctx.lineTo(CANVAS_SIZE, i * CELL);
    ctx.stroke();
  }

  // 먹이
  if (food) {
    ctx.fillStyle = "#f38ba8";
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 뱀
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#a6e3a1" : "#40a02b";
    ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
  });
}

// ===== 입력 =====
const KEYS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

document.addEventListener("keydown", (e) => {
  const dir = KEYS[e.key];
  if (!dir || !playing) return;
  e.preventDefault(); // 방향키로 페이지가 스크롤되지 않게
  if (paused) return;
  // 바로 반대 방향으로는 꺾을 수 없음
  if (dir.x === -direction.x && dir.y === -direction.y) return;
  nextDirection = dir;
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);

// 첫 화면: 빈 보드 그리기
draw();
