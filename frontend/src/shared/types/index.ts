export interface User {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface TasteProfile {
  id: string;
  user_id: string;
  spice_preference: number;
  sweetness_preference: number;
  creaminess_preference: number;
  tanginess_preference: number;
  smokiness_preference: number;
  crunch_preference: number;
  adventure_level: number;
  portion_preference: number;
  confidence_score: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizAnswer {
  question_id: string;
  selected_option_id: string;
}

export interface QuizSubmission {
  user_id: string;
  answers: QuizAnswer[];
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  theme_color?: string;
  created_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
}

export interface Dish {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_vegetarian: boolean;
  is_available: boolean;
  display_order: number;
  
  // Vectors
  spice_level: number;
  sweetness_level: number;
  creaminess_level: number;
  tanginess_level: number;
  smokiness_level: number;
  crunchiness_level: number;
  adventure_level: number;
  portion_size: number;
  
  // JSON arrays
  ingredients: string[];
  allergens: string[];
  dietary_tags: string[];
  recommended_pairings: string[];
  
  // Text & Optional
  preparation_style: string | null;
  chef_notes: string | null;
  serving_style: string | null;
  recommended_temperature: string | null;
  popularity_score: number;
}

export interface RecommendationReason {
  type: string;
  text: string;
}

export interface DishRecommendation {
  dish: Dish;
  score: number;
  confidence: number;
  reasons: RecommendationReason[];
}

export interface RecommendationResponse {
  user_id: string;
  recommendations: DishRecommendation[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string | null;
  tool_calls: {
    id: string;
    name: string;
    arguments: any;
  }[];
  updated_ui_actions: {
    action: string;
    payload: any;
  }[];
}
