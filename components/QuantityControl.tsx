interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  size = "md",
  className = "",
}: QuantityControlProps) {
  const sizeClasses = {
    sm: {
      button: "w-6 h-6 text-sm",
      text: "text-sm w-5",
    },
    md: {
      button: "w-8 h-8 text-base",
      text: "text-base w-6",
    },
    lg: {
      button: "w-10 h-10 text-lg",
      text: "text-lg w-8",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onDecrease}
        className={`${classes.button} rounded-full bg-[#f8f3ec] flex items-center justify-center text-[#333333] font-semibold hover:bg-[#efe5d5] active:bg-[#e6dcc5] transition-colors`}
        aria-label="減少數量"
      >
        −
      </button>
      <span
        className={`${classes.text} font-medium text-[#333333] text-center`}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className={`${classes.button} rounded-full bg-[#f8f3ec] flex items-center justify-center text-[#333333] font-semibold hover:bg-[#efe5d5] active:bg-[#e6dcc5] transition-colors`}
        aria-label="增加數量"
      >
        +
      </button>
    </div>
  );
}
