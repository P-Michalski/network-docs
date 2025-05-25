import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store';
import { GlobalStyles } from './styles/globalStyles';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyles />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
