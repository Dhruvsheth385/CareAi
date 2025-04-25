import React, { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  variant = 'default',
  padding = 'md',
  className = '',
  ...rest
}) => {
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg'
  };
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8'
  };
  
  return (
    <div
      className={`
        rounded-xl 
        ${variantStyles[variant]} 
        ${className}
      `}
      {...rest}
    >
      {title && (
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-xl font-medium text-gray-800">{title}</h3>
        </div>
      )}
      
      <div className={paddingStyles[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;