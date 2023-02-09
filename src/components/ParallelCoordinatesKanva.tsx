import React, { useEffect, useState } from 'react';
import { Stage, Layer, Group, Line, Text } from 'react-konva';

const ParallelCoordinatesKanva = (props: any) => {
  const x = 50;
  const y = 50;
  const width: number = 1500;
  const height: number = 600;

  const [numAxis, setNumAxis] = useState(0); // Number of axis
  const [axisSpacing, setAxisSpacing] = useState(0); // Axis spacing based on width and numAxis
  const [axis, setAxis] = useState([]) as any[]; // Axis lines coordinates
  const [axisTitles, setAxisTitles] = useState([]) as any[]; // Axis titles and their coordinates
  const [axisScales, setAxisScales] = useState([]) as any[]; // Axis scales

  useEffect(() => {
    const numAxisTemp = props.data[0].length;
    const axisSpacingTemp = width / (numAxisTemp + 1);
    const lineSpacingTemp = height / (props.data.length + 1);

    setNumAxis(numAxisTemp);
    setAxisSpacing(axisSpacingTemp);

    setAxisScales(getMinMaxByColumn(props.data));

    let axisTemp: any[] = [];
    let axisTitlesTemp: any[] = [];

    for (let i: number = 0; i < numAxisTemp; i++) {
      axisTemp.push({ 
        points: [x + i * axisSpacingTemp, y, x + i * axisSpacingTemp, y + height],
        stroke: "black",
        strokeWidth: 1,
      })

      axisTitlesTemp.push({
        x: x + i * axisSpacingTemp,
        y: 10,
        text: `Dimension ${i + 1}`,
        fontSize: 16,
        align: 'center',
        rotation: 45
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
      lineNew.push(x + i * axisSpacing, y + height * getPercentage(line[i], axisScales[i].min, axisScales[i].max));
      //lineNew.push(line[i]);
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

  return <>
    <p>KanvaJS:</p>
    <Stage width={width} height={height}>
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
              align={axisTitle.align}
              rotation={axisTitle.rotation}
            />
          })}
        </Group>
        <Group>
          {props.data.map((line: number[], i: number) => {
            return <Line
              key={i}
              points={getLine(line)}
              stroke={'blue'}
              strokeWidth={1}
            />
          })}
        </Group>
      </Layer>
    </Stage>
  </>
};

export default ParallelCoordinatesKanva;