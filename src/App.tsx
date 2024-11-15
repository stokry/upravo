// App.tsx
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewsPortal from './pages/NewsPortal';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="font-sans">
          <Routes>
            <Route path="/" element={<NewsPortal />} />
            <Route path="/:category" element={<NewsPortal />} />
            <Route path="/:category/:article" element={<NewsPortal />} />
            {/* Catch all route for 404s */}
            <Route path="*" element={<NewsPortal />} />
          </Routes>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;