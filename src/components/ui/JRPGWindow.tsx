import React from "react";

interface JRPGWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
}

export const JRPGWindow = ({ children, title, className = "", ...props }: JRPGWindowProps) => {
  return (
    <div className={`jrpg-window ${className}`} {...props}>
      {title && (
        <div className="absolute -top-4 left-4 bg-slate-900 border-2 border-white px-3 py-1 rounded text-sm shadow-md">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};
