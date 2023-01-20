import React, { useState } from 'react';
import ParallelCoordinatesKanva from './components/ParallelCoordinatesKanva';
import ParallelCoordinatesCanvas2d from './components/ParallelCoordinatesCanvas2d';
import ParallelCoordinatesBabylon from './components/ParallelCoordinatesBabylon';
import FileUploader from './components/FileUploader';
import TableView from './components/TableView';

let randomData: any[] = [];

for (let i: number = 0; i < 1000; i++) {
  randomData.push(Array.from({length: 10}, () => Math.floor(Math.random() * 200)));
}

function App() {
  const [header, setHeader] = useState([]) as any[];
  const [rows, setRows] = useState([]) as any[];

  return (
    <div className="App">
      <h1>MVA App</h1>
      <FileUploader setHeader={setHeader} setRows={setRows} />
      <TableView header={header} rows={rows}/>
      <ParallelCoordinatesKanva data={randomData} />
      <ParallelCoordinatesCanvas2d data={randomData} />
      <ParallelCoordinatesBabylon data={randomData} />
    </div>
  );
}

export default App;
