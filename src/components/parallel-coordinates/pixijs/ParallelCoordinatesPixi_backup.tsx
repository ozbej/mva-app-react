import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Stage, Graphics, Container } from '@pixi/react';
import * as PIXI from 'pixi.js';

type LineProps = {
  points: number[],
  color?: number,
  key: string
};

type FilterTriangleProps = {
  points: number[],
  color?: number,
  key: string,
  type: string
};

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

const Line = ({ points, color = 0xffffff, key }: LineProps) => {
  const graphicsRef = useRef(null);

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.lineStyle(2, color, 1);
      g.moveTo(points[0], points[1]);
      for (let i = 2; i < points.length; i+=2) {
        g.lineTo(points[i], points[i+1]);
      }
    }, [points]);

  return (
    <Graphics ref={graphicsRef} draw={draw} key={key} />
  );
}

const FilterTriangle = ({ points, color = 0x000000, key, type }: FilterTriangleProps) => {
  const graphicsRef = useRef(null);

  const onDown = useCallback(
    (e: PIXI.FederatedPointerEvent) => {
      console.log(e);
    }, []);

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(color);
      g.lineStyle(2, color, 1);
      if (type === "upper") { // Draw upper filter rectangle
        g.moveTo(points[0]-5, points[1]-10);
        g.lineTo(points[0]+5, points[1]-10);
        g.lineTo(points[0], points[1]);
        g.lineTo(points[0]-5, points[1]-10);
      }
      else if (type === "lower") { // Draw lower filter rectangle
        g.moveTo(points[0]-5, points[1]+10);
        g.lineTo(points[0]+5, points[1]+10);
        g.lineTo(points[0], points[1]);
        g.lineTo(points[0]-5, points[1]+10);
        g.endFill();
      }
      else console.log("Error: Invalid FilterTriangle.type value")
    }, [points]);

  return (
    <Graphics ref={graphicsRef} draw={draw} key={key} interactive={true} pointerdown={onDown} />
  );
}

function ParallelCoordinatesPixi(props: any) {
  const width = window.innerWidth;
  const height = 600;
  const xOffset = 50;
  const yOffset = 50;

  const [axes, setAxes] = useState([]) as any[]; // Axis lines
  const [lines, setLines] = useState([]) as any[]; // Data lines

  useEffect(() => {

    const numAxes = props.data[0].length; // Set the number of axes
    const axesSpacing = width / (numAxes + 1); // Set the spacing between axes
    const axesScales: any[] = getMinMaxByColumn(props.data); // Set the scales of all axes

    // Set and draw all axes
    let axes: any[] = [];
    for (let i: number = 0; i < numAxes; i++) {
      axes.push({
        key: i,
        points: [xOffset + i * axesSpacing, yOffset, xOffset + i * axesSpacing, yOffset + height],
        text: props && props.dataHeaders ? props.dataHeaders[i] : `Dim-${i+1}`,
        limitUpper: yOffset,
        limitLower: yOffset + height,
      })
    }
    setAxes(axes);

    // Set the lines data points
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
    setLines(lines);
  }, [props]);

  return (
    <Stage width={width} height={height+yOffset+20} options={{ backgroundColor: 0xffffff }}>
      {// Draw axes
      axes.map((axis: any) => <Line points={axis.points} color={0x000000} key={`axis-${axis.key}`} />)}
      
      {// Draw data lines
      lines.map((line: any) => <Line points={line.points} color={0x0000ff} key={`line-${line.key}`} />)}

      {// Draw filtering buttons
      axes.map((axis: any) => <>
        <FilterTriangle 
          points={axis.points.slice(0,2)} 
          key={`filter-upper-${axis.key}`}
          type="upper" />
        <FilterTriangle
          points={axis.points.slice(2,4)}
          key={`filter-lower-${axis.key}`}
          type="lower" />
      </>)}
    </Stage>
  );
}

export default ParallelCoordinatesPixi;