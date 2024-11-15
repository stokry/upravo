import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import NewsPortal from './pages/NewsPortal';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="font-sans">
          <NewsPortal />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;