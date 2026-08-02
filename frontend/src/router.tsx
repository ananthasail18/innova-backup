import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/layouts/Layout';
import { LandingPage } from '@/pages/LandingPage';
import { QuizPage } from '@/pages/QuizPage';
import { RestaurantPage } from '@/pages/RestaurantPage';
import { DishDetailPage } from '@/pages/DishDetailPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { CartPage } from '@/pages/CartPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'welcome', element: <LandingPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'restaurant', element: <RestaurantPage /> },
      { path: 'dish/:id', element: <DishDetailPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'cart', element: <CartPage /> },
    ],
  },
]);
