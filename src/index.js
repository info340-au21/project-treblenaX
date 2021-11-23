import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

// Grab Debug Data
import SONG_DATA from './json/test_data.json';

// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App testSongData={ SONG_DATA } />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
