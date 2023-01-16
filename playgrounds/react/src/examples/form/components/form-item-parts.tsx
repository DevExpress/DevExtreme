import { PropsWithChildren } from 'react';

export function FormItemHint({ children }: { children: string }) {
  return <span>{children}</span>;
}

export function FormItemLabel({ children }: PropsWithChildren) {
  return <span>{children}</span>;
}
