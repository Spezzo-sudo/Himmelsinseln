import React from 'react';
import { twMerge } from 'tailwind-merge';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Panel: React.FC<PanelProps> = ({ children, className, title }) => {
  return (
    <div
      className={twMerge(
        "bg-gray-900 bg-opacity-90 border-2 border-brass-primary shadow-panel p-4 rounded-sm text-steam-white",
        "relative",
        className
      )}
    >
      {/* Decorative bolts/rivets */}
      <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-brass-primary shadow-metallic"></div>
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brass-primary shadow-metallic"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-brass-primary shadow-metallic"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-brass-primary shadow-metallic"></div>

      {title && (
        <h2 className="font-display text-brass-primary text-xl mb-4 border-b border-oxidized-copper pb-2 tracking-wider uppercase text-shadow-glow">
          {title}
        </h2>
      )}
      <div className="font-mono text-sm">
        {children}
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyles = "px-4 py-2 font-display uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-brass-primary text-void-slate hover:bg-[#c47f52] shadow-metallic border-2 border-[#8b4513]",
    danger: "bg-red-900 text-red-100 border-2 border-red-700 hover:bg-red-800 shadow-metallic",
    ghost: "bg-transparent text-brass-primary hover:text-steam-white border border-transparent hover:border-brass-primary"
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
