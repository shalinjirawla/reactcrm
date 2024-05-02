import './App.css';
import AuthProvider from './Context/AuthProvider';
import Layouts from './Layout';

function App() {
  return (
    <div>
      <AuthProvider>
        <Layouts />
      </AuthProvider>
    </div>
  );
}

export default App;