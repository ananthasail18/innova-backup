import { useQuery, useMutation } from '@tanstack/react-query';
import api from './api';
import type { 
  Restaurant, Category, Dish, ApiResponse, 
  User, TasteProfile, QuizSubmission, RecommendationResponse, DishRecommendation 
} from '@/shared/types';

export const useRecommendations = (userId: string | null) => {
  return useQuery({
    queryKey: ['recommendations', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await api.get<ApiResponse<RecommendationResponse>>(`/recommendations/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
};

export const useDishRecommendation = (userId: string | null, dishId: string | undefined) => {
  return useQuery({
    queryKey: ['recommendation', userId, dishId],
    queryFn: async () => {
      if (!userId || !dishId) return null;
      const { data } = await api.get<ApiResponse<DishRecommendation>>(`/recommendations/${userId}/dish/${dishId}`);
      return data.data;
    },
    enabled: !!userId && !!dishId,
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: { name: string; email?: string }) => {
      const { data } = await api.post<ApiResponse<User>>('/users', userData);
      return data.data;
    },
  });
};

export const useUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await api.get<ApiResponse<User>>(`/users/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
};

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: async (submission: QuizSubmission) => {
      const { data } = await api.post<ApiResponse<TasteProfile>>('/taste-profile', submission);
      return data.data;
    },
  });
};

export const useTasteProfile = (userId: string | null) => {
  return useQuery({
    queryKey: ['tasteProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await api.get<ApiResponse<TasteProfile>>(`/taste-profile/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
};

export const useRestaurant = () => {
  return useQuery({
    queryKey: ['restaurant'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Restaurant>>('/restaurant');
      return data.data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories');
      return data.data;
    },
  });
};

export const useDishes = (categoryId: string | null = null) => {
  return useQuery({
    queryKey: ['dishes', categoryId],
    queryFn: async () => {
      const params = categoryId ? { category_id: categoryId } : undefined;
      const { data } = await api.get<ApiResponse<Dish[]>>('/dishes', { params });
      return data.data;
    },
  });
};

export const useDish = (id: string) => {
  return useQuery({
    queryKey: ['dish', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Dish>>(`/dish/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useChat = () => {
  return useMutation({
    mutationFn: async (payload: {
      message: string;
      user_id: string;
      restaurant_id: string;
      page_context: string;
      selected_dish_id?: string;
      conversation_history: any[];
    }) => {
      const { data } = await api.post<ApiResponse<any>>('/chat', payload);
      return data.data;
    },
  });
};
