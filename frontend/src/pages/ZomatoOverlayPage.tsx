import React, { useState } from 'react';
import { ZomatoDishBadge } from '@/components/ZomatoDishBadge';
import { Sparkles, ArrowLeft, Star, Clock, MapPin, Search, ShoppingCart, CheckCircle, Flame, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import type { Dish } from '@/services/types';

interface SimulatedZomatoDish {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  matchScore: number;
  reason: string;
  isVeg: boolean;
  image: string;
  bestseller?: boolean;
}

const SAMPLE_ZOMATO_DISHES: SimulatedZomatoDish[] = [
  {
    id: 'zomato-1',
    name: 'Spicy Garlic Butter Noodles',
    price: 345,
    description: 'Wok-tossed noodles in chili garlic butter oil with fresh scallions and roasted crunchy sesame.',
    category: 'Indo-Chinese',
    matchScore: 96,
    reason: 'High Spice (8.5/10) & Crunchy Texture matches your Taste DNA perfectly.',
    isVeg: true,
    image: '/images/dishes/spicy_noodles.jpg',
    bestseller: true,
  },
  {
    id: 'zomato-2',
    name: 'Cheesy Gourmet Burger & Fries',
    price: 420,
    description: 'Double melted cheddar patty topped with caramelized onions and crisp house pickles.',
    category: 'Burgers',
    matchScore: 91,
    reason: 'Matches your Creaminess (7/10) & Masala preference.',
    isVeg: false,
    image: '/images/dishes/burger.jpg',
    bestseller: true,
  },
  {
    id: 'zomato-3',
    name: 'Crispy Paneer Pepper Fry',
    price: 310,
    description: 'Golden paneer cubes tossed with crushed black pepper, curry leaves, and green chilies.',
    category: 'Starters',
    matchScore: 88,
    reason: 'High Masala Intensity & Crispiness level matched.',
    isVeg: true,
    image: '/images/dishes/paneer_fry.jpg',
  },
  {
    id: 'zomato-4',
    name: 'Classic Butter Chicken & Naan',
    price: 450,
    description: 'Tandoori chicken simmered in rich tomato cream gravies served with garlic butter naan.',
    category: 'Main Course',
    matchScore: 84,
    reason: 'Rich Creaminess & Tangy tomato notes.',
    isVeg: false,
    image: '/images/dishes/butter_chicken.jpg',
    bestseller: true,
  },
  {
    id: 'zomato-5',
    name: 'Sizzling Chocolate Brownie Sundae',
    price: 260,
    description: 'Warm fudge brownie topped with vanilla bean ice cream and hot chocolate fudge sauce.',
    category: 'Desserts',
    matchScore: 68,
    reason: 'Lower spice score but high sweet indulgence.',
    isVeg: true,
    image: '/images/dishes/brownie.jpg',
  },
];

export const ZomatoOverlayPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Indo-Chinese', 'Burgers', 'Starters', 'Main Course', 'Desserts'];

  const filteredDishes = SAMPLE_ZOMATO_DISHES.filter((dish) => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (zDish: SimulatedZomatoDish) => {
    const compliantDish: Dish = {
      id: zDish.id,
      restaurant_id: 'r1',
      category_id: 'c1',
      name: zDish.name,
      description: zDish.description,
      price: zDish.price,
      image_url: zDish.image,
      is_vegetarian: zDish.isVeg,
      is_available: true,
      display_order: 1,
      spice_level: 5,
      sweetness_level: 5,
      creaminess_level: 5,
      tanginess_level: 5,
      masala_intensity_level: 5,
      crunchiness_level: 5,
      oiliness_level: 5,
      saltiness_level: 5,
      ingredients: [],
      allergens: [],
      dietary_tags: [],
      recommended_pairings: [],
      preparation_style: null,
      chef_notes: null,
      serving_style: null,
      recommended_temperature: null,
      popularity_score: 95,
    };

    addItem(compliantDish, 1);
    setAddedItemIds((prev) => ({ ...prev, [zDish.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [zDish.id]: false }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-28">
      
      {/* Top Zomato + TasteAI Header Banner */}
      <header className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800/80 px-3 py-2.5 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold">Back</span>
          </button>

          {/* TasteAI Active Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-3 py-1 rounded-full text-white text-[11px] font-extrabold shadow-md shadow-orange-950/50 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>TasteAI Active • Zomato Gold</span>
          </div>

          {/* Cart Icon Shortcut */}
          <button 
            onClick={() => navigate('/cart')} 
            className="relative p-1.5 text-neutral-300 hover:text-white"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-md">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Simulated Zomato Partner Restaurant Hero Banner */}
      <section className="bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border-b border-neutral-800/80 py-5 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                ZOMATO GOLD PARTNER
              </span>
              <span className="text-xs text-neutral-400 font-medium">• Koramangala 5th Block</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Truffles</span>
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            </h1>
            <p className="text-neutral-400 text-xs mt-1">American Burgers, Indo-Chinese, Fast Food, Sundaes</p>
            
            <div className="flex items-center gap-3 text-xs text-neutral-400 mt-3">
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/90 border border-emerald-800/60 px-2 py-0.5 rounded-lg shadow-sm">
                <Star className="w-3.5 h-3.5 fill-emerald-400" /> 4.6 (14.8k+)
              </span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-neutral-500" /> 25 mins</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-500" /> 1.8 km</span>
            </div>
          </div>

          {/* Taste DNA Active Match Card */}
          <div className="bg-neutral-900/90 border border-orange-500/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg shadow-orange-950/20 backdrop-blur-md">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">Matching Diner DNA</div>
              <div className="text-sm font-black text-white">Ananth's Taste Profile</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">High Spice • High Crunch • Creamy Gravy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs & Search Bar */}
      <section className="max-w-4xl mx-auto px-4 py-3 space-y-3">
        <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-2 shadow-inner">
          <Search className="w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search Zomato menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-neutral-200 placeholder-neutral-500 outline-none w-full"
          />
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-950 scale-105'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Zomato Menu List with Taste DNA Badges */}
      <main className="max-w-4xl mx-auto px-4 space-y-3">
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span>Recommended Menu Items</span>
            <span className="text-xs text-neutral-500">({filteredDishes.length})</span>
          </h2>
          <span className="text-[11px] text-orange-400 font-bold">Sorted by Taste DNA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDishes.map((dish) => (
            <div 
              key={dish.id} 
              className="bg-neutral-900/80 border border-neutral-800/90 hover:border-orange-500/40 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5 relative overflow-hidden transition-all shadow-md backdrop-blur-sm"
            >
              {/* Veg / Non-Veg Indicator & Bestseller Tag */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 rounded-sm ${dish.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </span>
                    <h3 className="font-extrabold text-sm text-neutral-100">{dish.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-orange-400">₹{dish.price}</span>
                    {dish.bestseller && (
                      <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded uppercase">
                        ★ BESTSELLER
                      </span>
                    )}
                  </div>
                </div>

                {/* Taste DNA Match Pill Badge */}
                <ZomatoDishBadge matchPercentage={dish.matchScore} size="sm" />
              </div>

              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{dish.description}</p>

              {/* Taste Rationale Note */}
              <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-2 text-[10px] text-neutral-300 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>{dish.reason}</span>
              </div>

              {/* Add to Cart Action Button */}
              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => handleAddToCart(dish)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                    addedItemIds[dish.id]
                      ? 'bg-emerald-600 text-white shadow-emerald-950'
                      : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-950 active:scale-95'
                  }`}
                >
                  {addedItemIds[dish.id] ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Added!
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> ADD
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
