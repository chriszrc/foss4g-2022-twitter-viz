import React, { memo, useEffect, useState } from "react";
import {
  AnimatePropTypeInterface,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryStack,
  VictoryTheme,
} from "victory";

import logo from "./logo.svg";
import "./App.css";
import { CatPoint } from "./components/cat-point/CatPoint";

const ScatterPlot = memo((props: any) => {
  console.log(props);
  return (
    <VictoryScatter
      bubbleProperty="amount"
      data={props.chartData}
      dataComponent={<CatPoint />}
      maxBubbleSize={25}
      minBubbleSize={5}
      size={7}
      style={{ data: { fill: "#c43a31" } }}
    />
  );
});

function App() {
  const [chartData, setChartData] = useState([
    { x: 0, y: 0, amount: 1 },
    { x: 0, y: 0, amount: 1 },
    { x: 0, y: 0, amount: 1 },
    { x: 0, y: 0, amount: 1 },
    { x: 0, y: 0, amount: 1 },
  ]);
  // const [lineData, setLineData] = useState<{ x: number; y: number }>();
  const [lines, setLines] = useState<JSX.Element[]>();
  const [animationOptions, setAnimationOptions] = useState<
    boolean | AnimatePropTypeInterface | undefined
  >({
    duration: 1000,
    easing: "sinInOut",
    onLoad: { duration: 1 },
  });

  useEffect(() => {
    // fetch("https://api.github.com/users/victoryjs/followers")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setChartData(data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    setTimeout(() => {
      setChartData([
        { x: 1, y: 2, amount: 30 },
        { x: 2, y: 3, amount: 40 },
        { x: 3, y: 5, amount: 25 },
        { x: 4, y: 4, amount: 10 },
        { x: 5, y: 7, amount: 45 },
      ]);
    }, 0);

    setTimeout(() => {
      setAnimationOptions(false);
      setLines(
        // <VictoryStack>
        [
          <VictoryLine
            key="0"
            name="line-1"
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 1, y: 2 },
              { x: 2, y: 3 },
            ]}
          />,
          <VictoryLine
            key="1"
            name="line-2"
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 3, y: 5 },
              { x: 5, y: 7 },
            ]}
          />,
        ]
        // </VictoryStack>
      );
    }, 5000);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>#FOSS4G2022 Visualized</p>
      </header>
      <div className="App-body">
        <div className="chart-wrapper">
          <VictoryChart
            animate={animationOptions}
            domain={{ x: [0, 10], y: [0, 10] }}
            domainPadding={20}
            theme={VictoryTheme.material}
          >
            <VictoryAxis />
            <VictoryAxis dependentAxis />
            {lines}
            {/* <ScatterPlot chartData={chartData} /> */}
            <VictoryScatter
              bubbleProperty="amount"
              data={chartData}
              dataComponent={<CatPoint />}
              maxBubbleSize={25}
              minBubbleSize={5}
              size={7}
              style={{ data: { fill: "#c43a31" } }}
            />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
}

export default App;
