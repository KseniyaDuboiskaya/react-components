import React from 'react';
import { Button, ButtonProps } from '@kseniya333/button';
import '@kseniya333/button/style.css';
import './Card.css';

export interface CardAction {
  label: string;
  onClick: () => void;
  variant?: ButtonProps['variant'];
  disabled?: boolean;
}

export interface CardProps {
  /**
   * Optional header content
   */
  header?: React.ReactNode;
  /**
   * Main content of the card
   */
  content: React.ReactNode;
  /**
   * Optional footer content
   */
  footer?: React.ReactNode;
  /**
   * Optional action buttons for the card
   */
  actions?: CardAction[];
  /**
   * Additional CSS class names
   */
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  header,
  content,
  footer,
  actions,
  className = '',
}) => {
  const baseClass = 'ai-card';
  const classes = `${baseClass} ${className}`.trim();

  return (
    <div className={classes}>
      {header && (
        <div className={`${baseClass}__header`}>
          {header}
        </div>
      )}
      <div className={`${baseClass}__content`}>
        {content}
      </div>
      {(footer || actions) && (
        <div className={`${baseClass}__footer`}>
          {footer && <div className={`${baseClass}__footer-content`}>{footer}</div>}
          {actions && actions.length > 0 && (
            <div className={`${baseClass}__actions`}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'primary'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
