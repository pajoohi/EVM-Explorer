import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EVMDetails from './pages/EVMDetails';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="evm/:id" element={<EVMDetails />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
