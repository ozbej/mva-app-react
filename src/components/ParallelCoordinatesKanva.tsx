import { KonvaEventObject } from 'konva/lib/Node';
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Group, Line, Text, RegularPolygon } from 'react-konva';

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
    // Set the number of axes
    const numAxisTemp = props.data[0].length;
    setNumAxis(numAxisTemp);

    // Set the spacing between axes
    const axisSpacingTemp = width / (numAxisTemp + 1);
    setAxisSpacing(axisSpacingTemp);

    // Set the scales of all axes
    const axisScalesTemp: any[] = getMinMaxByColumn(props.data);
    setAxisScales(axisScalesTemp);

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

    // Set the lines data points
    let linesTemp: any[] = [];
    props.data.forEach((line: number[], i: number) => {
      linesTemp.push({
        key: i,
        points: getLine(line, numAxisTemp, axisSpacingTemp, axisScalesTemp),
        color: "blue",
        width: 2,
        opacity: 0.3,
      })
    })
    setLines(linesTemp);
  }, [])

  function getPercentage(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  function getLine(line: number[], numAxis: number, axisSpacing: number, axisScales: any[]): number[] {
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
    const index: number = e.target.index;
    const updatedLines = [...lines];
    updatedLines[index].color = 'red';
    updatedLines[index].width = 5;
    updatedLines[index].opacity = 1;
    setLines(updatedLines);
  }

  function handleMouseLeave(e: KonvaEventObject<MouseEvent>) {
    const index: number = e.target.index;
    const updatedLines = [...lines];
    updatedLines[index].color = 'blue';
    updatedLines[index].width = 2;
    updatedLines[index].opacity = 0.3;
    setLines(updatedLines);
  }

  return <>
    <p>KanvaJS:</p>
    <Stage width={width} height={height+100}>
      <Layer>
        <Group>
          <RegularPolygon
            x={x}
            y={y-10}
            key={"filter-upper"}
            sides={3}
            radius={10}
            fill={"black"}
            opacity={1}
            rotation={180}
            draggable
            dragBoundFunc={(pos) => {
              let yTemp = pos.y;
              if (yTemp < y - 10) yTemp = y - 10;
              else if (yTemp > height + y - 10) yTemp = height + y - 10;
              return {
                x: x,
                y: yTemp
              }
            }}
          />
          <RegularPolygon
            x={x}
            y={y+height+10}
            key={"filter-lower"}
            sides={3}
            radius={10}
            fill={"black"}
            opacity={1}
            draggable
            dragBoundFunc={(pos) => {
              let yTemp = pos.y;
              if (yTemp < y + 10) yTemp = y + 10;
              else if (yTemp > height + y + 10) yTemp = height + y + 10;
              return {
                x: x,
                y: yTemp
              }
            }}
          />
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
              opacity={line.opacity}
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