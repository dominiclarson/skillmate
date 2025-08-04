

'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';


export const Tabs = TabsPrimitive.Root;


export const TabsList = ({
  className,
  ...props
}: TabsPrimitive.TabsListProps & { className?: string }) => (
  <TabsPrimitive.List
    className={cn(
      'inline-flex items-center justify-center rounded-md bg-muted p-1',
      className
    )}
    {...props}
  />
);


export const TabsTrigger = ({
  className,
  ...props
}: TabsPrimitive.TabsTriggerProps & { className?: string }) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex min-w-[80px] items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium',
      'ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-background data-[state=active]:text-foreground',
      'data-[state=inactive]:text-muted-foreground',
      className
    )}
    {...props}
  />
);


export const TabsContent = ({
  className,
  ...props
}: TabsPrimitive.TabsContentProps & { className?: string }) => (
  <TabsPrimitive.Content
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
);
