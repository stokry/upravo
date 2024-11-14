import { BrowserRouter } from 'react-router-dom';
import NewsPortal from './components/NewsPortal';

function App() {
  return (
    <BrowserRouter>
      <div className="font-sans">
        <NewsPortal />
      </div>
    </BrowserRouter>
  );
}

export default App;