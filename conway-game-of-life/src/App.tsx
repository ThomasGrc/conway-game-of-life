import React, { useCallback, useState, useRef, useEffect } from 'react';
import './App.css';
import produce from 'immer'
import Button from "@material-ui/core/Button"

const numRows = 40;
const numCols = 40;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const App = () => {

  const setup = useEffect(() => {
    document.body.style.backgroundColor = "#040F16"
  }, []);

  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbours += g[newI][newK];
              }
            })

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbours === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 1000);
  }, [])

  return (
    <div style={{
      backgroundColor: "#040F16 ",
      height: "100%",
      justifyContent: "center",
      display: "flex",
    }}>
      <Button
        onClick={() => {
          setRunning(!running);
          runningRef.current = true;
          runSimulation();
        }}
        color="primary"
        variant="contained"
        style={{
          height: "3em",
          width: "6em"
        }}
      >
        {running ? "STOP" : "START"}</Button>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
            key={`${i}-${k}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k] = grid[i][k] ? 0 : 1;
              });
              setGrid(newGrid)
            }}
              style={{
                width: 20, 
                height: 20,
                backgroundColor: grid[i][k] ? '#0094C6' : undefined,
                border: "solid 1px #364156",
              }}
            />
          ))
        )}
      </div>  
    </div>
  );
}

export default App;
