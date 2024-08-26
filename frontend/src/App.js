import { Route, Routes } from 'react-router-dom';
import './App.css';
import Upload from './components/Upload';
import Status from './components/Status';
import VideoList from './components/VideoList';

function App() {
  return (
      <div className=' w-screen h-screen bg-gray-950 text-white flex'>
        <Routes>
          <Route path='/' element={<Upload/>} />
          <Route path='/status' element={<Status/>} />
          <Route path='/videos' element={<VideoList/>} />
        </Routes>
      </div>
  );
}

export default App;
