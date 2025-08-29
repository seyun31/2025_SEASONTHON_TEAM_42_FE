import React from 'react';
import { cn } from '../../lib/utils/cn';

export type TextVariant =
  | 'header-large'
  | 'header-medium'
  | 'header-small'
  | 'title-xlarge'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'title-xsmall'
  | 'body-large-medium'
  | 'body-large-regular'
  | 'body-medium-medium'
  | 'body-medium-regular'
  | 'body-small-medium'
  | 'body-small-regular'
  | 'caption-large'
  | 'caption-small';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<TextVariant, string> = {
  'header-large': 'text-header-large',
  'header-medium': 'text-header-medium',
  'header-small': 'text-header-small',
  'title-xlarge': 'text-title-xlarge',
  'title-large': 'text-title-large',
  'title-medium': 'text-title-medium',
  'title-small': 'text-title-small',
  'title-xsmall': 'text-title-xsmall',
  'body-large-medium': 'text-body-large-medium',
  'body-large-regular': 'text-body-large-regular',
  'body-medium-medium': 'text-body-medium-medium',
  'body-medium-regular': 'text-body-medium-regular',
  'body-small-medium': 'text-body-small-medium',
  'body-small-regular': 'text-body-small-regular',
  'caption-large': 'text-caption-large',
  'caption-small': 'text-caption-small',
};

const defaultElementMap: Partial<Record<TextVariant, string>> = {
  'header-large': 'h1',
  'header-medium': 'h2',
  'header-small': 'h3',
  'title-xlarge': 'h2',
  'title-large': 'h3',
  'title-medium': 'h4',
  'title-small': 'h5',
  'title-xsmall': 'h6',
  'body-large-medium': 'p',
  'body-large-regular': 'p',
  'body-medium-medium': 'p',
  'body-medium-regular': 'p',
  'body-small-medium': 'p',
  'body-small-regular': 'p',
  'caption-large': 'span',
  'caption-small': 'span',
};

export const Text: React.FC<TextProps> = ({
  variant = 'body-medium-regular',
  as,
  children,
  className,
  ...props
}) => {
  const Component =
    as || (defaultElementMap[variant] as React.ElementType) || 'p';
  const variantClassName = variantMap[variant];

  return (
    <Component className={cn(variantClassName, className)} {...props}>
      {children}
    </Component>
  );
};

export default Text;
