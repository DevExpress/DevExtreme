import { MutableRefObject, useMemo } from 'react';

// NOTE: Workaround for the useImperativeHandler hook.
export function useCustomComponentRef<TRef>(
  componentRef: MutableRefObject<TRef> | undefined,
  createComponentRef: () => TRef,
  deps?: unknown[],
): void {
  useMemo(() => {
    if (componentRef) {
      componentRef.current = createComponentRef();
    }
  }, deps);
}
