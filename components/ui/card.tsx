import React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ children, className = "", ...props }: DivProps) {
  return <div className={`rounded-lg border p-4 shadow ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ children, className = "", ...props }: DivProps) {
  return <div className={`border-b pb-2 mb-2 font-bold ${className}`} {...props}>{children}</div>;
}

export function CardContent({ children, className = "", ...props }: DivProps) {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = "", ...props }: DivProps) {
  return <h3 className={`text-xl font-bold ${className}`} {...props}>{children}</h3>;
}
