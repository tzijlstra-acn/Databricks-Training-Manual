import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white",
        secondary: "border-transparent bg-gray-100 text-gray-900",
        destructive: "border-transparent bg-red-500 text-white",
        outline: "text-gray-700 border-gray-200",
        bronze: "border-bronze-border bg-bronze-bg text-bronze-text",
        silver: "border-silver-border bg-silver-bg text-silver-text",
        gold: "border-gold-border bg-gold-bg text-gold-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
