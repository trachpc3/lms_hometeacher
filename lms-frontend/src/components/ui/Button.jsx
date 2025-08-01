import clsx from "clsx";

const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  outline: "border border-gray-400 text-gray-800 bg-white hover:bg-gray-100 focus:ring-gray-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-2.5 text-lg",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = "left", // "left" or "right"
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-60 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}

      {!loading && icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}
