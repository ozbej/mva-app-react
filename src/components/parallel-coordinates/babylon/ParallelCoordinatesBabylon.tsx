// @refresh disable
import React, { useRef, useEffect, useState } from 'react';
import { Engine, Scene, Vector3, FreeCamera, Color4 } from '@babylonjs/core';
import { MultiLine, AdvancedDynamicTexture } from '@babylonjs/gui';

function createLine(dataItem: number[]) {
  let line: MultiLine = new MultiLine();
  line.color = "black";
  line.lineWidth = 1;
  for (let i = 0; i < dataItem.length; i++) {
    line.add({x: i*100, y: dataItem[i]});
  }
  return line;
}

function calculateLine(line: number[], numAxis: number, axisSpacing: number, axisScales: any[], xOffset: number, yOffset: number, height: number): number[] {
  let lineNew: number[] = [];
  for (let i: number = 0; i < numAxis; i++) {
    lineNew.push(xOffset + i * axisSpacing, yOffset + height * (1 - getPercentage(line[i], axisScales[i].min, axisScales[i].max)));
  }
  return lineNew;
}

function getPercentage(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

function drawLine(points: number[], color: string, lineWidth: number) {
  let line: MultiLine = new MultiLine();
  line.color = color;
  line.lineWidth = lineWidth;
  for (let i = 0; i < points.length; i+=2) {
    line.add({x: points[i], y: points[i+1]});
  }
  return line;
}

function drawAllLines(lines: any[]) {
  lines.forEach(lineCurr => {
    let line: MultiLine = drawLine(lineCurr.points, "blue", 1);
    AdvancedDynamicTexture.CreateFullscreenUI("UI").addControl(line);
  })
}

function drawAllAxes(axes: any[]) {
  axes.forEach(axis => {
    let line: MultiLine = drawLine(axis.points, "black", 1);
    AdvancedDynamicTexture.CreateFullscreenUI("UI").addControl(line);
  })
}

function getMinMaxByColumn(arr: any[]): any[] {
  const numCols = arr[0].length;
  const result = [];
  
  for (let col = 0; col < numCols; col++) {
    const column = arr.map(row => row[col]);
    const filtered = column.filter(val => !Number.isNaN(val));
    result.push({
      min: Math.min(...filtered),
      max: Math.max(...filtered)
    });
  }
  return result;
}

function ParallelCoordinatesBabylon(props: any) {
  const ref: any = useRef(null);
  const xOffset = 70;
  const yOffset = 0;
  const width = window.innerWidth;
  const height = 600;

  useEffect(() => {
    // Create Babylon engine, scene, and camera
    const engine = new Engine(ref.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(1, 1, 1, 1);
    const camera = new FreeCamera("camera1", new Vector3(0, 0, -10));

    const numAxes = props.data[0].length; // Set the number of axes
    const axesSpacing = width / (numAxes + 1); // Set the spacing between axes
    const axesScales: any[] = getMinMaxByColumn(props.data); // Set the scales of all axes

    // Set and draw all axes
    let axes: any[] = [];
    for (let i: number = 0; i < numAxes; i++) {
      axes.push({ 
        points: [xOffset + i * axesSpacing, yOffset, xOffset + i * axesSpacing, yOffset + height],
        text: props && props.dataHeaders ? props.dataHeaders[i] : `Dim-${i+1}`,
        limitUpper: yOffset,
        limitLower: yOffset + height,
      })
    }
    drawAllAxes(axes);

    // Set and draw all data lines
    let lines: any[] = [];
    props.data.forEach((line: number[], i: number) => {
      lines.push({
        key: i,
        points: calculateLine(line, numAxes, axesSpacing, axesScales, xOffset, yOffset, height),
        color: "blue",
        width: 2,
        opacity: 0.3,
      })
    })
    drawAllLines(lines)

    engine.runRenderLoop(() => {
      scene.render();
    });

    return function cleanup() {
      scene.dispose();
      engine.dispose();
    }
  }, [props])

  return (
    <div>
      <canvas ref={ref} width={width} height={height} />
    </div>
  );
};

export default ParallelCoordinatesBabylon;