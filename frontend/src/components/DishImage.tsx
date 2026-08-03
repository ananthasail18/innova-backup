import { useState } from 'react';

interface DishImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function DishImage({ src, alt, className = "w-full h-full object-cover" }: DishImageProps) {
  const [error, setError] = useState(!src);

  if (error || !src) {
    const colors = [
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
      'from-emerald-500 to-teal-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-violet-600',
      'from-red-500 to-amber-600',
    ];
    // Hash function to choose a gradient deterministically based on the name
    const hash = alt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];

    return (
      <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center text-white p-4 text-center select-none font-bold shrink-0`}>
        <span className="text-sm md:text-base font-extrabold tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src || undefined}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
