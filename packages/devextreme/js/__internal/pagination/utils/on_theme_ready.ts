import type { EffectReturn } from '@ts/core/r1/utils/effect_return';
import { themeReadyCallback } from '@ts/ui/m_themes_callback';
import { isPendingThemeLoaded } from '@ts/ui/themes';

export function onThemeReady(callback: () => void): EffectReturn {
  const isThemeLoaded = isPendingThemeLoaded();
  if (isThemeLoaded) {
    return undefined;
  }
  themeReadyCallback.add(callback);
  return (): void => { themeReadyCallback.remove(callback); };
}
