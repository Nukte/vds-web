import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ghost';
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Composable Card primitive.
 *
 * Usage:
 *   <Card>
 *     <Card.Header>Title</Card.Header>
 *     <Card.Body>Content</Card.Body>
 *     <Card.Footer>Actions</Card.Footer>
 *   </Card>
 */
function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-lg border',
        variant === 'default'
          ? 'bg-card text-card-foreground border-border shadow-sm'
          : 'bg-transparent border-transparent',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({
  className = '',
  children,
  ...props
}: CardSectionProps) {
  return (
    <div
      className={`px-6 py-5 border-b border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardBody({ className = '', children, ...props }: CardSectionProps) {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({
  className = '',
  children,
  ...props
}: CardSectionProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
