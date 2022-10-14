import * as React from "react";

import {
  createBoard,
  openSquare,
  getContent,
  markSquare,
} from "../../utils/board";

type Props = {
  size: number;
  mines: number;
};

export default function Board({ size, mines }: Props) {
  const [board, setBoard] = React.useState(createBoard(size, mines));

  const mineCount = board.flatMap((col) => col.filter((s) => s.mine)).length;

  return (
    <div>
      <h1>{`Mine count: ${mineCount}`}</h1>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((square, columnIndex) => {
            const { text, color, background } = getContent(square);

            return (
              <div
                key={columnIndex}
                style={{
                  width: "50px",
                  height: "50px",
                  border: "1px solid black",
                  margin: "3px",
                  textAlign: "center",
                  lineHeight: "50px",
                  fontSize: "40px",
                  cursor: "default",
                  color: color,
                  backgroundColor: background,
                }}
                onClick={(event) => {
                  if (event.ctrlKey) {
                    return setBoard(markSquare(board, square));
                  }

                  return setBoard(openSquare(board, square));
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
