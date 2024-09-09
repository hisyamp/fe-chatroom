// src/App.js
import React from 'react';
import ChatWindow from './components/ChatWindow';
import GlobalStyles from './styles/GlobalStyles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatroomCode from './components/ChatroomCode';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatroomCode />} />
        <Route path="/chatroom/:code" element={<ChatWindow />} />
      </Routes>
    </Router>
  );
};

export default App;
