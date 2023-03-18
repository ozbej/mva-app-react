import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/home/Home";
import ParallelCoordinatesKanvaPage from "./pages/parallel-coordinates/kanva/ParalellCoordinatesKanvaPage";
import ParalellCoordinatesBabylonPage from "./pages/parallel-coordinates/babylon/ParalellCoordinatesBabylonPage";
import ParallelCoordinatesPixiPage from './pages/parallel-coordinates/pixijs/ParallelCoordinatesPixiPage';
import { DataInterface } from './interfaces/data.interface';

export default function App() {

  const [data, setData] = useState<DataInterface>({data: [], headerRow: []});

  const handleDataChange = (newData: DataInterface) => {
    setData(newData);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home onDataChange={handleDataChange} />} />
          <Route path="parallel-coordinates-kanva" element={<ParallelCoordinatesKanvaPage data={data} />} />
          <Route path="parallel-coordinates-babylon" element={<ParalellCoordinatesBabylonPage data={data.data} />} />
          <Route path="parallel-coordinates-pixijs" element={<ParallelCoordinatesPixiPage data={data} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const container: HTMLElement | null = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);