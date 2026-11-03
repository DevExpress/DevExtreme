import type { EffectReturn } from '@ts/core/r1/utils/effect_return';
import { isPendingThemeLoaded } from '@ts/ui/themes';
import { themeReadyCallback } from '@ts/ui/themes_callback';

export function onThemeReady(callback: () => void): EffectReturn {
  const isThemeLoaded = isPendingThemeLoaded();
  if (isThemeLoaded) {
    return undefined;
  }
  themeReadyCallback.add(callback);
  return (): void => { themeReadyCallback.remove(callback); };
}
