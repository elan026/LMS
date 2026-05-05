import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AppRouter from './AppRouter';

function App() {
  const { user, init, verify } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
    verify().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D9E75]"></div>
          <p className="mt-4 text-[#1D9E75] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
