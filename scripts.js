let fields = [null, null, null, null, null, null, null, null, null];

let currentPlayer = "X";
let gameOver = false;

function render() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let i = 0; i < fields.length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("id", `cell-${i}`);
    cell.setAttribute("onclick", `handleClick(${i})`);

    board.appendChild(cell);
  }
  updateCurrentPlayer();

}

function renderSymbol(symbol) {
  const unique = Math.random(); // kleiner Trick
  if (!symbol) return '';
  if (symbol === "X") {
    return `
    <svg viewBox="0 0 100 100" class="symbol x">
      <line x1="20" y1="20" x2="80" y2="80"
        stroke="white" stroke-width="10" stroke-linecap="round"
        stroke-dasharray="84.85" stroke-dashoffset="84.85"
        style="
          animation: drawLine 0.3s ease-out forwards,
                     pulse 1.2s ease-out 0.5s infinite;
          filter: drop-shadow(0 0 4px white);
          transform-origin: center;
        " />
      <line x1="80" y1="20" x2="20" y2="80"
        stroke="white" stroke-width="10" stroke-linecap="round"
        stroke-dasharray="84.85" stroke-dashoffset="84.85"
        style="
          animation: drawLine 0.3s ease-out 0.2s forwards,
                     pulse 1.2s ease-out 0.7s infinite;
          filter: drop-shadow(0 0 4px white);
          transform-origin: center;
        " />
    </svg>`;
  } else if (symbol === "O") {
    return `
    <svg viewBox="0 0 100 100" class="symbol o">
      <circle cx="50" cy="50" r="30"
        stroke="white" stroke-width="10" fill="none"
        stroke-dasharray="188.4" stroke-dashoffset="188.4"
        style="
          animation: drawCircle 1s ease-out forwards,
                     pulse 1.2s ease-out 1s infinite;
          filter: drop-shadow(0 0 4px white);
          transform-origin: center;
        " />
    </svg>`;
  }
  return '';

}

function handleClick(i) {
  if (!fields[i] && !gameOver) {
    fields[i] = currentPlayer;

    const cell = document.getElementById(`cell-${i}`);
    cell.innerHTML = renderSymbol(currentPlayer); // Nur dieses Feld!

    checkWinner();

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateCurrentPlayer();

  }
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Reihen
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Spalten
    [0, 4, 8],
    [2, 4, 6], // Diagonalen
  ];
  updateCurrentPlayer();

  for (const [a, b, c] of winPatterns) {
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      gameOver = true;
      drawWinningLine(a, c);

      const winnerText = document.getElementById("winner-text");
      winnerText.textContent = `🎉 Spieler ${fields[a]} hat gewonnen!`;

      return;
    }
  }

  if (!fields.includes(null)) {
    gameOver = true;
    const winnerText = document.getElementById("winner-text");
    winnerText.textContent = "😐 Unentschieden!";
  }
}

function restartGame() {
  fields = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  document.getElementById("winner-text").textContent = "";

  const oldLine = document.querySelector(".winning-line");
  if (oldLine) oldLine.remove();

  render();
  updateCurrentPlayer();
}

function drawWinningLine(startIndex, endIndex) {
  const board = document.getElementById("board");
  const boardRect = board.getBoundingClientRect();
  const cells = board.children;

  const startCell = cells[startIndex].getBoundingClientRect();
  const endCell = cells[endIndex].getBoundingClientRect();

  let x1 = startCell.left + startCell.width / 2;
  let y1 = startCell.top + startCell.height / 2;
  let x2 = endCell.left + endCell.width / 2;
  let y2 = endCell.top + endCell.height / 2;

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const extra = 30; // 👈 Verlängerung an beiden Seiten

  // Berechne neue Start- und Endpunkte mit Verlängerung
  x1 = x1 - Math.cos(angle) * extra;
  y1 = y1 - Math.sin(angle) * extra;
  x2 = x2 + Math.cos(angle) * extra;
  y2 = y2 + Math.sin(angle) * extra;

  const length = Math.hypot(x2 - x1, y2 - y1);

  const line = document.createElement("div");
  line.classList.add("winning-line");
  line.style.setProperty("--line-length", length + "px");
  line.style.top = y1 - boardRect.top + "px";
  line.style.left = x1 - boardRect.left + "px";
  line.style.transform = `rotate(${(angle * 180) / Math.PI}deg)`;

  board.parentElement.appendChild(line);
}

render();

function updateCurrentPlayer() {
  const cpText = document.getElementById("current-player");
  if (!gameOver) {
    cpText.textContent = `✏️ Spieler ${currentPlayer} ist am Zug`;
  } else {
    cpText.textContent = "";
  }
}
