import {
  describe, expect, it, jest,
} from '@jest/globals';
import { themeReadyCallback } from '@ts/ui/m_themes_callback';

import { onThemeReady } from '../utils/on_theme_ready';

const mockThemeState = { loaded: false };

jest.mock('@ts/ui/themes', () => ({
  ...jest.requireActual<object>('@ts/ui/themes'),
  isPendingThemeLoaded: (): boolean => mockThemeState.loaded,
}));

describe('onThemeReady', () => {
  it('runs the callback once the pending theme is loaded and unsubscribes on dispose', () => {
    mockThemeState.loaded = false;
    const callback = jest.fn();

    const dispose = onThemeReady(callback);

    expect(callback).not.toHaveBeenCalled();

    themeReadyCallback.fire();

    expect(callback).toHaveBeenCalledTimes(1);

    dispose?.();
    themeReadyCallback.fire();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not subscribe when the theme is already loaded', () => {
    mockThemeState.loaded = true;
    const callback = jest.fn();

    expect(onThemeReady(callback)).toBeUndefined();

    themeReadyCallback.fire();

    expect(callback).not.toHaveBeenCalled();
  });
});
