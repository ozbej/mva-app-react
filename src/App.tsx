import React from 'react';
import ParallelCoordinatesKanva from './components/ParallelCoordinatesKanva';
import ParallelCoordinatesCanvas2d from './components/ParallelCoordinatesCanvas2d';
import ParallelCoordinatesBabylon from './components/ParallelCoordinatesBabylon';

let data: any[] = [];

for (let i: number = 0; i < 1000; i++) {
  data.push(Array.from({length: 10}, () => Math.floor(Math.random() * 300)));
}

function App() {
  return (
    <div className="App">
      <h1>MVA App</h1>
      <ParallelCoordinatesKanva data={data} />
      <ParallelCoordinatesCanvas2d data={data} />
      <ParallelCoordinatesBabylon data={data} />
    </div>
  );
}

export default App;
