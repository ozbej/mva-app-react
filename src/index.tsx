import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/home/HomePage";
import ParallelCoordinatesKanvaPage from "./pages/parallel-coordinates/kanva/ParalellCoordinatesKanvaPage";
import ParalellCoordinatesCanvas2dPage from "./pages/parallel-coordinates/canvas2d/ParalellCoordinatesCanvas2dPage";
import ParalellCoordinatesBabylonPage from "./pages/parallel-coordinates/babylon/ParalellCoordinatesBabylonPage";

let randomData: any[] = [];

for (let i: number = 0; i < 100; i++) {
  randomData.push(Array.from({length: 20}, () => Math.floor(Math.random() * 200)));
}

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="parallel-coordinates-kanva" element={<ParallelCoordinatesKanvaPage data={randomData} />} />
          <Route path="parallel-coordinates-canvas2d" element={<ParalellCoordinatesCanvas2dPage data={randomData} />} />
          <Route path="parallel-coordinates-babylon" element={<ParalellCoordinatesBabylonPage data={randomData} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const container: HTMLElement | null = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);