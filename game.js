const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let cells = Array(9).fill("");
let turn = "X";
let over = false;

function render() {
  boardEl.replaceChildren(
    ...cells.map((mark, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.dataset.index = String(index);
      button.setAttribute("aria-label", mark ? `${mark}, cell ${index + 1}` : `Empty cell ${index + 1}`);
      button.textContent = mark;
      if (mark) button.classList.add(mark.toLowerCase());
      button.disabled = over || Boolean(mark);
      return button;
    })
  );
}

function winningLine(board) {
  return LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]) ?? null;
}

function finish(message, line) {
  over = true;
  statusEl.textContent = message;
  if (!line) return;
  for (const index of line) {
    boardEl.children[index].classList.add("win");
  }
  for (const cell of boardEl.children) cell.disabled = true;
}

function play(index) {
  if (over || cells[index]) return;

  cells[index] = turn;
  render();

  const line = winningLine(cells);
  if (line) {
    finish(`${turn} wins`, line);
    return;
  }

  if (cells.every(Boolean)) {
    finish("Draw");
    return;
  }

  turn = turn === "X" ? "O" : "X";
  statusEl.textContent = `${turn}'s turn`;
}

function restart() {
  cells = Array(9).fill("");
  turn = "X";
  over = false;
  statusEl.textContent = "X goes first";
  render();
}

boardEl.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  play(Number(cell.dataset.index));
});

restartBtn.addEventListener("click", restart);
render();
