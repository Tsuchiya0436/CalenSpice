import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Calendar from './components/Calendar';
import DiaryDetail from './components/DiaryDetail';

function App() {
  return (
    <Router>
    <Routes>
        <Route path="/" element={<Calendar />} />  {/* カレンダーのルート */}
        <Route path="/diary/:date" element={<DiaryDetail />} />  {/* 日記詳細ページのルート */}
    </Routes>
</Router>
  );
}

export default App;
