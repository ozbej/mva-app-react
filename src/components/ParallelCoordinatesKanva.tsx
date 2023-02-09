import { KonvaEventObject } from 'konva/lib/Node';
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Group, Line, Text } from 'react-konva';

const ParallelCoordinatesKanva = (props: any) => {
  const x = 70;
  const y = 50;
  const width: number = 1900;
  const height: number = 600;

  const [numAxis, setNumAxis] = useState(0); // Number of axis
  const [axisSpacing, setAxisSpacing] = useState(0); // Axis spacing based on width and numAxis
  const [axis, setAxis] = useState([]) as any[]; // Axis lines coordinates
  const [axisTitles, setAxisTitles] = useState([]) as any[]; // Axis titles and their coordinates
  const [axisScales, setAxisScales] = useState([]) as any[]; // Axis scales
  const [lines, setLines] = useState([]) as any[]; // Data lines

  useEffect(() => {
    console.log("COMPONENT LOADED");
    // Set the number of axes
    const numAxisTemp = props.data[0].length;
    setNumAxis(numAxisTemp);

    // Set the spacing between axes
    const axisSpacingTemp = width / (numAxisTemp + 1);
    setAxisSpacing(axisSpacingTemp);

    // Set the lines data points
    let linesTemp: any[] = [];
    props.data.forEach((line: number[], i: number) => {
      linesTemp.push({
        key: i,
        points: getLine(line),
        color: "blue",
        width: 1,
      })
    })
    setLines(linesTemp);

    // Set the scales of all axes
    setAxisScales(getMinMaxByColumn(props.data));

    // Set all axes and their titles
    let axisTemp: any[] = [];
    let axisTitlesTemp: any[] = [];
    for (let i: number = 0; i < numAxisTemp; i++) {
      axisTemp.push({ 
        points: [x + i * axisSpacingTemp, y, x + i * axisSpacingTemp, y + height],
        stroke: "black",
        strokeWidth: 1,
      })
      axisTitlesTemp.push({
        x: x + i * axisSpacingTemp - 30,
        y: 10,
        text: props && props.dataHeaders ? props.dataHeaders[i] : `Dim-${i+1}`,
        fontSize: 16,
      })
    }
    setAxis(axisTemp);
    setAxisTitles(axisTitlesTemp);
  }, [])

  function getPercentage(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  function getLine(line: number[]): number[] {
    let lineNew: number[] = [];
    for (let i: number = 0; i < numAxis; i++) {
      lineNew.push(x + i * axisSpacing, y + height * (1 - getPercentage(line[i], axisScales[i].min, axisScales[i].max)));
    }
    return lineNew;
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

    console.log(result);
    return result;
  }

  function handleMouseOver(e: KonvaEventObject<MouseEvent>) {
    const updatedLines = [...lines];
    console.log(e.target.index);
    updatedLines[e.target.index].color = 'red';
    updatedLines[e.target.index].width = 5;
    setLines(updatedLines);
  }

  function handleMouseLeave(e: KonvaEventObject<MouseEvent>) {
    const updatedLines = [...lines];
    updatedLines[e.target.index].color = 'blue';
    updatedLines[e.target.index].width = 1;
    setLines(updatedLines);
  }

  return <>
    <p>KanvaJS:</p>
    <Stage width={width} height={height+50}>
      <Layer>
        <Group>
          {axis.map((line: any, index: number) => {
            return <Line 
              key={`axis-${index}`}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
            />
          })}
          {axisTitles.map((axisTitle: any, index: number) => {
            return <Text 
            key={`axis-title-${index}`}
              x={axisTitle.x}
              y={axisTitle.y}
              text={axisTitle.text}
              fontSize={axisTitle.fontSize}
            />
          })}
        </Group>
        <Group>
          {lines.map((line: any, i: number) => {
            return <Line
              key={line.key}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width}
              onMouseOver={handleMouseOver}
              onMouseLeave={handleMouseLeave}
            />
          })}
        </Group>
      </Layer>
    </Stage>
  </>
};

export default ParallelCoordinatesKanva;