import './App.css';
import WireGuardClientConfig from './pages/WireGuardClientConfig';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <WireGuardClientConfig />
    </ThemeProvider>
  );
}

export default App
