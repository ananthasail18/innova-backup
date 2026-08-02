import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import type { 
  Restaurant, 
  Category, 
  Dish, 
  User, 
  TasteProfile, 
  QuizSubmission, 
  RecommendationResponse,
  DishRecommendation,
  ApiResponse,
  ChatMessage,
  ChatResponse
} from '@/services/types';

// Restaurant
export const useRestaurant = () => {
  return useQuery({
    queryKey: ['restaurant'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Restaurant>>('/restaurant');
      return data.data;
    },
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories');
      return data.data;
    },
  });
};

// Dishes
export const useDishes = (categoryId?: string | null) => {
  return useQuery({
    queryKey: ['dishes', categoryId],
    queryFn: async () => {
      const url = categoryId ? `/dishes?category_id=${categoryId}` : '/dishes';
      const { data } = await api.get<ApiResponse<Dish[]>>(url);
      return data.data;
    },
  });
};

export const useDish = (dishId: string | null) => {
  return useQuery({
    queryKey: ['dish', dishId],
    queryFn: async () => {
      if (!dishId) return null;
      const { data } = await api.get<ApiResponse<Dish>>(`/dish/${dishId}`);
      return data.data;
    },
    enabled: !!dishId,
  });
};

// Users
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

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: { name?: string; email?: string }) => {
      const { data } = await api.post<ApiResponse<User>>('/users', userData);
      return data.data!;
    },
  });
};

// Taste Profile
export const useTasteProfile = (userId: string | null) => {
  return useQuery({
    queryKey: ['taste-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await api.get<ApiResponse<TasteProfile>>(`/taste-profile/${userId}`);
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

// Recommendations
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

export const useDishRecommendation = (userId: string | null, dishId: string | null) => {
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

// Chat
export const useChatMutation = () => {
  return useMutation({
    mutationFn: async (chatPayload: {
      user_id: string;
      restaurant_id: string;
      message: string;
      conversation_history: ChatMessage[];
      page_context: string;
      selected_dish_id?: string;
    }) => {
      const { data } = await api.post<ApiResponse<ChatResponse>>('/chat', chatPayload);
      return data.data!;
    },
  });
};
