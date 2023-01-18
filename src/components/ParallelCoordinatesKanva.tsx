import React from 'react';
import { Stage, Layer, Group, Line } from 'react-konva';

let data: any[] = [];

for (let i: number = 0; i < 100; i++) {
  data.push(Array.from({length: 10}, () => Math.floor(Math.random() * 40)));
}

class ParallelCoordinatesKanva extends React.Component {

  render() {
    return <>
      <div>Parallel Coordinates View:</div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Group>
            <Line
              points={[5, 70, 140, 23, 250, 60, 300, 20]}
              stroke={'black'}
              strokeWidth={1}
            />
          </Group>
      </Layer>
      </Stage>
    </>;
  }
}

export default ParallelCoordinatesKanva;