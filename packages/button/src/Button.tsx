import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary';
  /**
   * Button disabled state
   */
  disabled?: boolean;
  /**
   * Button contents
   */
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const baseClass = 'ai-button';
  const variantClass = `${baseClass}--${variant}`;
  const disabledClass = disabled ? `${baseClass}--disabled` : '';
  const classes = `${baseClass} ${variantClass} ${disabledClass} ${className}`.trim();

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
