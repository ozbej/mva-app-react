import React from 'react';
import ParallelCoordinatesKanva from './components/ParallelCoordinatesKanva';
import ParallelCoordinatesCanvas2d from './components/ParallelCoordinatesCanvas2d';

function App() {
  return (
    <div className="App">
      <h1>MVA App</h1>
      <ParallelCoordinatesKanva />
      <ParallelCoordinatesCanvas2d />
    </div>
  );
}

export default App;
