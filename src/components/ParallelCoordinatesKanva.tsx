import React from 'react';
import { Stage, Layer, Group, Line } from 'react-konva';

const ParallelCoordinatesKanva = (props: any) => {

  function getLine(line: number[]): number[] {
    let lineNew: number[] = [];
    for (let i: number = 0; i < line.length; i++) {
      lineNew.push(i*100);
      lineNew.push(line[i]);
    }
    return lineNew;
  }

  return <>
    <p>KanvaJS:</p>
    <Stage width={1000} height={200}>
      <Layer>
        <Group>
          {props.data.map((dataItem: number[], i: number) => {
            return <Line
              key={i}
              points={getLine(dataItem)}
              stroke={'black'}
              strokeWidth={1}
            />
          })}
        </Group>
      </Layer>
    </Stage>
  </>
};

export default ParallelCoordinatesKanva;