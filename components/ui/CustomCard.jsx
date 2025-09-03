// Custom Card Component - Pinterest Style
export default function Card({ 
  children, 
  className = "", 
  onClick,
  hover = true 
}) {
  const baseClasses = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300";
  const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer" : "";
  const classes = `${baseClasses} ${hoverClasses} ${className}`;
  
  return (
    <div 
      className={classes}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`p-6 pb-0 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-6 pt-4 ${className}`}>
      {children}
    </div>
  );
} 