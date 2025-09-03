// Custom Input Component - Pinterest Style
export default function Input({ 
  placeholder = "", 
  value = "", 
  onChange, 
  className = "", 
  disabled = false,
  type = "text",
  id,
  ...props 
}) {
  const baseClasses = "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200";
  const disabledClasses = disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white hover:border-gray-300";
  const classes = `${baseClasses} ${disabledClasses} ${className}`;
  
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={classes}
      {...props}
    />
  );
}

// Custom Textarea Component - Pinterest Style
export function Textarea({ 
  placeholder = "", 
  value = "", 
  onChange, 
  className = "", 
  disabled = false,
  rows = 4,
  id,
  ...props 
}) {
  const baseClasses = "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none";
  const disabledClasses = disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white hover:border-gray-300";
  const classes = `${baseClasses} ${disabledClasses} ${className}`;
  
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className={classes}
      {...props}
    />
  );
} 