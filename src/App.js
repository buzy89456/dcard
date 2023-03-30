import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components';
import TaskList from './components/Task';
import TaskDetail from './components/TaskDetail';
import './App.scss';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/task" element={<TaskList />} />
          <Route path="/task/:owner/:repo/:issue" element={<TaskDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
