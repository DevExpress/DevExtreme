import { useEffect } from 'react';
import { LifecyclePropsCompatible } from '../props';
import { useCallbackRef } from './use-callback-ref';

export function useCompatibleLifecycle(
  lifecycleProps: LifecyclePropsCompatible,
): void {
  const onInitialized = useCallbackRef<void>(lifecycleProps.onInitialized);
  const onDisposing = useCallbackRef<void>(lifecycleProps.onDisposing);

  useEffect(() => {
    onInitialized.current();

    return () => { onDisposing.current(); };
  }, []);

  useEffect(() => {
    // NOTE: Maybe it will be better to remove the onContentReady as the BC.
    lifecycleProps.onContentReady?.();
  });
}
