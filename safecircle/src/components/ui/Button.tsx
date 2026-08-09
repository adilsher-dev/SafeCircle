import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "outline"
  | "safe";

type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
  > {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "relative overflow-hidden bg-gradient-to-r from-primary via-safe to-ai text-slate-950 font-semibold shadow-lg shadow-primary/25 border border-primary/20 hover:shadow-primary/40 hover:brightness-110",

  secondary:
    "glass border border-primary/15 text-text hover:border-primary/30 hover:bg-primary/5",

  danger:
    "bg-gradient-to-r from-danger to-red-500 text-white font-semibold shadow-lg shadow-danger/30 border border-danger/20 hover:shadow-danger/50 hover:brightness-110",

  safe:
    "bg-gradient-to-r from-safe to-primary text-slate-950 font-semibold shadow-lg shadow-safe/25 border border-safe/20 hover:shadow-safe/50 hover:brightness-110",

  ghost:
    "text-muted hover:text-text hover:bg-white/5",

  outline:
    "border border-primary/20 text-text bg-transparent hover:border-primary/40 hover:bg-primary/5",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-xs gap-1.5 rounded-xl",

  md: "h-11 px-5 text-sm gap-2 rounded-2xl",

  lg: "h-13 px-7 text-base gap-2 rounded-2xl",

  icon: "h-11 w-11 rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={
          disabled || loading
            ? {}
            : {
                y: -2,
                scale: 1.02,
              }
        }
        whileTap={
          disabled || loading
            ? {}
            : {
                scale: 0.97,
              }
        }
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
        }}
        disabled={disabled || loading}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...(props as HTMLMotionProps<"button">)}
      >
        {/* Premium Shine Effect */}

        {(variant === "primary" ||
          variant === "safe" ||
          variant === "danger") && (
          <span
            className="
              absolute
              inset-0
              -translate-x-full
              skew-x-12
              bg-gradient-to-r
              from-transparent
              via-white/20
              to-transparent
              transition-transform
              duration-700
              group-hover:translate-x-full
            "
          />
        )}

        {loading ? (
          <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
        ) : (
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";