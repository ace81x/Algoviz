import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Sorting from './pages/Sorting';
import './App.css'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sorting" element={<Sorting />} />
    </Routes>
  );
}

export default App;