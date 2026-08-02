import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { Providers } from '@/hooks/providers';
import '@/styles/App.css';

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
