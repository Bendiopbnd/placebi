import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
}

export default function Container({
  className,
  maxWidth = '7xl',
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        {
          'max-w-screen-sm': maxWidth === 'sm',
          'max-w-screen-md': maxWidth === 'md',
          'max-w-screen-lg': maxWidth === 'lg',
          'max-w-screen-xl': maxWidth === 'xl',
          'max-w-screen-2xl': maxWidth === '2xl',
          'max-w-7xl': maxWidth === '7xl',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

