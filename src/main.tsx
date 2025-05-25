import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// import { GlobalStyle } from './styles/globalStyles';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <GlobalStyle /> */}
      <App />
    </BrowserRouter>
  </StrictMode>
)
