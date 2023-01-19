import React from 'react';
import { Stage, Layer, Group, Line } from 'react-konva';

let data: any[] = [];

for (let i: number = 0; i < 1000; i++) {
  data.push(Array.from({length: 10}, () => Math.floor(Math.random() * 500)));
}

class ParallelCoordinatesKanva extends React.Component {

  getLine(line: number[]): number[] {
    let lineNew: number[] = [];
    for (let i: number = 0; i < line.length; i++) {
      lineNew.push(i*100);
      lineNew.push(line[i]);
    }
    return lineNew;
  }

  render() {
    return <>
      <div>KanvaJS:</div>
      <Stage width={1000} height={500}>
        <Layer>
          <Group>
            {data.map((dataItem: number[], i: number) => {
              return <Line
                key={i}
                points={this.getLine(dataItem)}
                stroke={'black'}
                strokeWidth={1}
              />
            })}
          </Group>
        </Layer>
      </Stage>
    </>
  };
}

export default ParallelCoordinatesKanva;