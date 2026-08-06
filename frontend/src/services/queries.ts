import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import type { 
  Restaurant, Category, Dish, ApiResponse, 
  User, TasteProfile, QuizSubmission, RecommendationResponse, DishRecommendation, RestaurantDetail
} from '@/services/types';

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

export const useCommunityRecommendations = (restaurantId: string | undefined, userId: string | null) => {
  return useQuery({
    queryKey: ['community-recommendations', restaurantId, userId],
    queryFn: async () => {
      if (!restaurantId || !userId) return null;
      const { data } = await api.get<ApiResponse<any>>(`/restaurants/${restaurantId}/community-recommendations?user_id=${userId}`);
      return data.data;
    },
    enabled: !!restaurantId && !!userId,
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

export const useLoginUser = () => {
  return useMutation({
    mutationFn: async (email_or_name: string) => {
      const { data } = await api.post<ApiResponse<User>>('/users/login', { email_or_name });
      return data.data!;
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (submission: QuizSubmission) => {
      const { data } = await api.post<ApiResponse<TasteProfile>>('/taste-profile', submission);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasteProfile', variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ['tasteProfile'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-detail'] });
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

export const useRestaurant = (slug?: string) => {
  return useQuery({
    queryKey: ['restaurant', slug],
    queryFn: async () => {
      if (slug) {
        const { data } = await api.get<ApiResponse<RestaurantDetail>>(`/restaurants/${slug}`);
        return data.data.restaurant;
      }
      const { data } = await api.get<ApiResponse<Restaurant>>('/restaurant');
      return data.data;
    },
  });
};

export const useRestaurantDetail = (slug: string | undefined, userId?: string | null) => {
  return useQuery({
    queryKey: ['restaurant-detail', slug, userId],
    queryFn: async () => {
      if (!slug) return null;
      const params = userId ? { user_id: userId } : undefined;
      const { data } = await api.get<ApiResponse<RestaurantDetail>>(`/restaurants/${slug}`, { params });
      return data.data;
    },
    enabled: !!slug,
  });
};

export const useCategories = (restaurantId?: string | null) => {
  return useQuery({
    queryKey: ['categories', restaurantId],
    queryFn: async () => {
      const params = restaurantId ? { restaurant_id: restaurantId } : undefined;
      const { data } = await api.get<ApiResponse<Category[]>>('/categories', { params });
      return data.data;
    },
  });
};

export const useDishes = (categoryId: string | null = null, restaurantId?: string | null) => {
  return useQuery({
    queryKey: ['dishes', categoryId, restaurantId],
    queryFn: async () => {
      const params: any = {};
      if (categoryId) params.category_id = categoryId;
      if (restaurantId) params.restaurant_id = restaurantId;
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

export const useChatMutation = () => {
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

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      user_id: string;
      event_type: string;
      dimension_deltas: Record<string, number>;
      event_description: string;
    }) => {
      const { data } = await api.post<ApiResponse<any>>('/taste-dna/feedback', payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasteProfile', variables.user_id] });
    },
  });
};
export const useLikeDish = () => {
  return useMutation({
    mutationFn: async (payload: {
      user_id: string;
      dish_id: string;
      liked: boolean;
      would_reorder?: boolean;
    }) => {
      const { data } = await api.post<ApiResponse<any>>('/community/like', payload);
      return data.data;
    },
  });
};
