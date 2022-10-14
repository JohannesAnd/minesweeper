type Square = {
  mine: boolean;
  number: number;
  column: number;
  row: number;
  marked: boolean;
  open: boolean;
};

type Board = Square[][];

export function createBoard(size: number, mines: number): Board {
  return Array.from({ length: size })
    .map((_, row) =>
      Array.from({ length: size }).map((_, column) => ({
        mine: Math.random() < mines / size ** 2,
        number: 0,
        column,
        row,
        open: false,
        marked: false,
      }))
    )
    .map((row, rowIndex, board) =>
      row.map((square, columnIndex) => ({
        ...square,
        number: board
          .slice(Math.max(rowIndex - 1, 0), rowIndex + 2)
          .flatMap((column) =>
            column.slice(Math.max(columnIndex - 1, 0), columnIndex + 2)
          )
          .filter((square) => square.mine).length,
      }))
    );
}

export function openSquare(board: Board, { row, column }: Square): Board {
  const newBoard = board.map((boardRow) =>
    boardRow.map((square) => {
      const isCurrent = square.column === column && square.row === row;

      if (isCurrent) {
        return {
          ...square,
          marked: false,
          open: true,
        };
      }

      return square;
    })
  );

  if (board[row][column].mine) {
    console.log("You lost!");
  }

  if (board[row][column].number !== 0) {
    return newBoard;
  }

  return board
    .slice(Math.max(row - 1, 0), row + 2)
    .flatMap((c) => c.slice(Math.max(column - 1, 0), column + 2))
    .filter((n) => !n.open && !n.mine)
    .reduce(
      (currentBoard, square) => openSquare(currentBoard, square),
      newBoard
    );
}

export function markSquare(board: Board, { row, column }: Square): Board {
  return board.map((boardRow) =>
    boardRow.map((square) => ({
      ...square,
      marked:
        square.row === row && square.column === column
          ? !square.marked && !square.open
          : square.marked,
    }))
  );
}

const colors = new Map<number, string>([
  [1, "blue"],
  [2, "green"],
  [3, "red"],
  [4, "darkblue"],
  [5, "maroon"],
  [6, "turquoise"],
  [7, "black"],
  [8, "gray"],
]);

export function getContent(square: Square): {
  text: string;
  color: string;
  background: string;
} {
  if (square.marked) return { text: "F", color: "green", background: "white" };

  if (!square.open) return { text: "", color: "inherit", background: "white" };

  if (square.mine) return { text: "M", color: "red", background: "white" };

  if (square.number === 0)
    return { text: "", color: "inherit", background: "#DDD" };

  return {
    text: square.number.toString(),
    color: colors.get(square.number) ?? "inherit",
    background: "#DDD",
  };
}
