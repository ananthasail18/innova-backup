export function getQualitativeLabel(labelKey: string, val: number): string {
  const normKey = labelKey.toLowerCase();
  
  if (normKey.includes("masala")) {
    if (val < 0.35) return "Light Masala";
    if (val < 0.70) return "Medium Masala";
    return "Rich Masala";
  }
  if (normKey.includes("oil")) {
    if (val < 0.35) return "Light";
    if (val < 0.70) return "Moderate";
    return "Rich";
  }
  if (normKey.includes("spice")) {
    if (val < 0.30) return "Mild";
    if (val < 0.65) return "Medium";
    return "High Spice";
  }
  if (normKey.includes("cream")) {
    if (val < 0.35) return "Light";
    if (val < 0.70) return "Creamy";
    return "Very Creamy";
  }
  
  // Standard rubric for Saltiness, Sweetness, Tanginess, Crunchiness
  if (val < 0.30) return "Low";
  if (val < 0.70) return "Medium";
  return "High";
}

export function TasteDimensionCard({ 
  label, 
  value 
}: { 
  label: string; 
  value: number; 
}) {
  const percentage = Math.round(value * 100);
  const displayName = label.replace('_preference', '').replace('_level', '').replace('_intensity', '').replace(/^\w/, c => c.toUpperCase());
  const qualitativeLabel = getQualitativeLabel(label, value);

  return (
    <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm font-medium">
        <span>{displayName}</span>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-primary">{qualitativeLabel}</span>
          <span className="text-muted-foreground">({percentage}%)</span>
        </div>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
