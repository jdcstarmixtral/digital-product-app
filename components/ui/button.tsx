import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-xl border border-transparent bg-black px-4 py-2 text-white shadow-md transition hover:bg-gray-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  )
)
Button.displayName = "Button"
