const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const convertBtn = document.getElementById("convert");
const swapBtn = document.getElementById("swap-btn");
const resultEl = document.getElementById("result");

// 숫자와 소수점 외 문자 입력 차단 (e, +, - 등)
amountInput.addEventListener("keydown", (e) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
});

function showResult(text, isError = false) {
  resultEl.textContent = text;
  resultEl.classList.toggle("error", isError);
}

async function convert() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount < 0) {
    showResult("올바른 금액을 입력하세요.", true);
    return;
  }

  convertBtn.disabled = true;
  showResult("변환 중...");

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    const converted = amount * data.rates[to];
    const formatted = converted.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
    showResult(`${amount.toLocaleString("ko-KR")} ${from} = ${formatted} ${to}`);
  } catch {
    showResult("환율 정보를 가져오지 못했습니다.", true);
  } finally {
    convertBtn.disabled = false;
  }
}

convertBtn.addEventListener("click", convert);

// From ↔ To 통화 교환, 금액이 입력되어 있으면 자동 변환
swapBtn.addEventListener("click", () => {
  [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
  if (amountInput.value.trim() !== "") {
    convert();
  }
});
