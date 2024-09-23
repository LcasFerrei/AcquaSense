import ReactDOM from 'react-dom';
import App from './App';
import React from 'react';

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// ReactDOM.render(
//   <App />,  // Remover React.StrictMode temporariamente
//   document.getElementById('root')
// );