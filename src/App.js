import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin';
import LaboratoryConsumables from './pages/LaboratoryConsumables';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<LaboratoryConsumables />} />
      </Routes>
    </Router>
  );
}

export default App;
