import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Sorting from './pages/Sorting';
import Graph from './pages/Graph';
import './App.css'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sorting" element={<Sorting />} />
      <Route path="/graph" element={<Graph />} />
    </Routes>
  );
}

export default App;