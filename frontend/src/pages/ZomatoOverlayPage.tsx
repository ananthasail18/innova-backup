import React, { useState } from 'react';
import { ZomatoDishBadge } from '@/components/ZomatoDishBadge';
import { Sparkles, ArrowLeft, Star, Clock, MapPin, Search, ShoppingCart, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-24">
      {/* Top Zomato + TasteAI Header Banner */}
      <header className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* TasteAI Active Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 px-3 py-1 rounded-full text-white text-xs font-bold shadow-md shadow-orange-950/50 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>TasteAI Active over Zomato</span>
          </div>

          {/* Cart Icon Shortcut */}
          <button 
            onClick={() => navigate('/cart')} 
            className="relative p-2 text-neutral-300 hover:text-white"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Simulated Zomato Restaurant Hero Section */}
      <section className="bg-neutral-900 border-b border-neutral-800 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
              <span>Zomato Partner Restaurant</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Truffles — Koramangala</h1>
            <p className="text-neutral-400 text-sm mt-1">Burgers, Indo-Chinese, Fast Food, Desserts</p>
            <div className="flex items-center gap-4 text-xs text-neutral-400 mt-3">
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-emerald-400" /> 4.6 (12.4k+ ratings)
              </span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 25-30 mins</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> 1.8 km</span>
            </div>
          </div>

          {/* Taste DNA Quick Banner */}
          <div className="bg-neutral-950/80 border border-orange-500/30 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-neutral-400">Target Diner Profile</div>
              <div className="text-sm font-bold text-orange-400">Ananth's Taste DNA (8D)</div>
              <div className="text-[11px] text-neutral-400">Spice: High | Crunch: High | Salt: Med</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs & Search Bar */}
      <section className="max-w-4xl mx-auto px-4 py-4 space-y-3">
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search Zomato menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-neutral-200 placeholder-neutral-500 outline-none w-full"
          />
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-950'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Simulated Zomato Menu List with TasteAI Overlays */}
      <main className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Recommended Menu Items</span>
            <span className="text-xs font-normal text-neutral-500">({filteredDishes.length} items)</span>
          </h2>
          <span className="text-xs text-orange-400 font-medium">Sorted by Taste DNA Match</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDishes.map((dish) => (
            <div 
              key={dish.id} 
              className="bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden transition-all shadow-lg"
            >
              {/* Veg / Non-Veg Indicator */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 ${dish.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </span>
                    <h3 className="font-bold text-base text-neutral-100">{dish.name}</h3>
                  </div>
                  <div className="text-sm font-extrabold text-orange-400">₹{dish.price}</div>
                </div>

                {/* Taste DNA Match Pill Badge */}
                <ZomatoDishBadge matchPercentage={dish.matchScore} size="sm" />
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2">{dish.description}</p>

              {/* Taste Recommendation Rationale Note */}
              <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-lg p-2 text-[11px] text-neutral-300 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>{dish.reason}</span>
              </div>

              {/* Add to Cart Action Button */}
              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => handleAddToCart(dish)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    addedItemIds[dish.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md'
                  }`}
                >
                  {addedItemIds[dish.id] ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Added!
                    </>
                  ) : (
                    <>
                      ADD +
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
