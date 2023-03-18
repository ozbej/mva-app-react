import { KonvaEventObject } from 'konva/lib/Node';
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Group, Line, Text, RegularPolygon } from 'react-konva';
import { useNavigate } from 'react-router-dom';
import { DataInterface } from '../../../interfaces/data.interface';

type ParallelCoordinatesProps = {
  data: DataInterface;
} 

const ParallelCoordinatesKanva = (props: ParallelCoordinatesProps) => {
  const x = 70;
  const y = 50;
  const width: number = window.innerWidth - 50;
  const height: number = 600;

  const navigate = useNavigate();

  const [axis, setAxis] = useState([]) as any[]; // Axis lines
  const [axisScales, setAxisScales] = useState([]) as any[]; // Axis scales
  const [linesAll, setLinesAll] = useState([]) as any[]; // Data lines
  const [linesFiltered, setLinesFiltered] = useState([]) as any[]; // Data lines

  useEffect(() => {
    if (props && props.data && props.data.data) {
      // Set the number of axes
      const numAxis = props.data.data[0].length;

      // Set the spacing between axes
      const axisSpacing = width / (numAxis + 1);

      // Set the scales of all axes
      const axisScalesTemp: any[] = getMinMaxByColumn(props.data.data);
      setAxisScales(axisScalesTemp);

      // Set all axes and their titles
      let axisTemp: any[] = [];
      let axisLimitsTemp: any[] = [];
      for (let i: number = 0; i < numAxis; i++) {
        axisTemp.push({ 
          points: [x + i * axisSpacing, y, x + i * axisSpacing, y + height],
          text: props.data.headerRow[i].title,
          limitUpper: y,
          limitLower: y + height,
        })
      }
      setAxis(axisTemp);

      // Set the lines data points
      let linesTemp: any[] = [];
      props.data.data.forEach((line: number[], i: number) => {
        linesTemp.push({
          key: i,
          points: getLine(line, numAxis, axisSpacing, axisScalesTemp),
          color: "blue",
          width: 2,
          opacity: 0.3,
        })
      })
      setLinesAll(linesTemp);
      setLinesFiltered(linesTemp);
    }
    else navigate("/");
  }, [props])

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
    return result;
  }

  function handleMouseOver(e: KonvaEventObject<MouseEvent>) {
    const index: number = e.target.index;
    const updatedLines = [...linesFiltered];
    updatedLines[index].color = 'red';
    updatedLines[index].width = 5;
    updatedLines[index].opacity = 1;
    setLinesFiltered(updatedLines);
  }

  function handleMouseLeave(e: KonvaEventObject<MouseEvent>) {
    const index: number = e.target.index;
    const updatedLines = [...linesFiltered];
    updatedLines[index].color = 'blue';
    updatedLines[index].width = 2;
    updatedLines[index].opacity = 0.3;
    setLinesFiltered(updatedLines);
  }

  function filterLines(axisIndex: number) {
    const filteredLines = [...linesAll].filter(line => {
      let valid: boolean = true;
      for (let i = 0; i < axis.length; i++) {
        if (line.points[i*2+1] > axis[i].limitLower
          || line.points[i*2+1] < axis[i].limitUpper)
          valid = false;
        }
        return valid;
      }
      );
    setLinesFiltered(filteredLines);
  }

  return <>
    <p>KanvaJS:</p>
    <Stage width={width} height={height+100}>
      <Layer>
        <Group>
          {linesAll.map((line: any, i: number) => {
            return <Line
              key={line.key}
              points={line.points}
              stroke={"#DCDCDC"}
              strokeWidth={1}
              opacity={1}
            />
          })}
        </Group>
      </Layer>
      <Layer>
        <Group>
          {linesFiltered.map((line: any, i: number) => {
            return <Line
              key={line.key}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width}
              opacity={line.opacity}
              //onMouseOver={handleMouseOver}
              //onMouseLeave={handleMouseLeave}
            />
          })}
        </Group>
      </Layer>
      <Layer>
        <Group>
          {axis.map((line: any, index: number) => {
            return <Group>
              <Line
                key={`axis-${index}`}
                points={line.points}
                stroke={"black"}
                strokeWidth={1}
              />
              <Text 
                key={`axis-title-${index}`}
                x={line.points[0] - 30}
                y={10}
                text={line.text}
                fontSize={16}
              />
              <RegularPolygon
                x={line.points[0]}
                y={y}
                key={"filter-upper"}
                sides={3}
                radius={10}
                fill={"black"}
                opacity={1}
                offsetY={-10}
                rotation={180}
                draggable
                dragBoundFunc={(pos) => {
                  let yTemp = pos.y;
                  if (yTemp < y) yTemp = y;
                  else if (yTemp > axis[index].limitLower) yTemp = axis[index].limitLower;

                  const updatedAxis = [...axis];
                  updatedAxis[index].limitUpper = yTemp;
                  setAxis(updatedAxis);

                  filterLines(index);

                  return {
                    x: line.points[0],
                    y: yTemp
                  }
                }}
              />
              <RegularPolygon
                x={line.points[0]}
                y={y+height}
                key={"filter-lower"}
                sides={3}
                radius={10}
                fill={"black"}
                opacity={1}
                offsetY={-10}
                draggable
                dragBoundFunc={(pos) => {
                  let yTemp = pos.y;
                  if (yTemp < axis[index].limitUpper) yTemp = axis[index].limitUpper;
                  else if (yTemp > height + y) yTemp = height + y;

                  const updatedAxis = [...axis];
                  updatedAxis[index].limitLower = yTemp;
                  setAxis(updatedAxis);

                  filterLines(index);

                  return {
                    x: line.points[0],
                    y: yTemp
                  }
                }}
              />
            </Group>
          })}
        </Group>
      </Layer>
    </Stage>
  </>
};

export default ParallelCoordinatesKanva;