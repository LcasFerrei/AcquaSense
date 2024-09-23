import ReactDOM from 'react-dom';
import App from './App';
import React from 'react';


// const rooot = ReactDOM.createRoot(document.getElementById('root'));
// rooot.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

ReactDOM.render(
  <App />,  // Remover React.StrictMode temporariamente
  document.getElementById('root')
);