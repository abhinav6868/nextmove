import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-ink-text hover:opacity-90 active:scale-[0.98]",
        secondary:
          "bg-surface text-text border border-hairline hover:bg-surface-2 active:scale-[0.98]",
        ghost:
          "text-text-muted hover:text-text hover:underline active:opacity-80",
        outline:
          "border border-hairline bg-transparent hover:bg-surface-2 text-text",
      },
      size: {
        default: "h-9 px-4 text-[14px]",
        sm: "h-7 px-3 text-[12px]",
        lg: "h-10 px-5 text-[15px]",
        icon: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
