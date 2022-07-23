import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DAppProvider } from '@usedapp/core'
import { 
  BrowserRouter, 
  Routes, 
  Route 
} from 'react-router-dom';
import ModalData from "./Components/Modal";
import SignIn from "./Components/SignIn";
import io from 'socket.io-client';

const socket = io.connect(`http://${window.location.hostname}:8000`, 
  { 
    transports: ['websocket', 'polling', 'flashsocket'] 
  });

ReactDOM.render(
  <DAppProvider config={{}}>
    <BrowserRouter>
      <Routes>
        <Route path="/modal" element={<ModalData />} />
        <Route path="/" element={<SignIn socket={socket} />} />
      </Routes>
      <App socket={socket}/>
    </BrowserRouter>
  </DAppProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
