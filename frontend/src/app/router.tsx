import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout, NotFound, ErrorBoundaryComponent } from './layout';

import { LandingPage } from '@/features/landing/pages/LandingPage';
import { QuizPage } from '@/features/onboarding/pages/QuizPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { RestaurantPage } from '@/features/restaurant/pages/RestaurantPage';
import { DishDetailPage } from '@/features/restaurant/pages/DishDetailPage';
import { CartPage } from '@/features/cart/pages/CartPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundaryComponent />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'restaurant/:id', element: <RestaurantPage /> },
      { path: 'dish/:id', element: <DishDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
