import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { themeModeChangedCallback } from '@ts/ui/m_themes_callback';
import { mode, refreshMode, resetTheme } from '@ts/ui/themes';

/*
 * jsdom resolves a custom property declared ON an element but does not inherit it, so these cases
 * name the mode at the element `mode()` reads it from. Inheritance - a scope declaring the property
 * and a descendant resolving it through the cascade, which is how the mechanism actually works - is
 * covered in a real browser by e2e/testcafe-devextreme/tests/common/themeModes.ts.
 */
const style = (css: string): void => { document.head.innerHTML = `<style>${css}</style>`; };

const withThemeMarker = (themeName: string): string => `.dx-theme-marker { font-family: "dx.${themeName}"; }`;

describe('themes.mode', () => {
  let element = document.createElement('div');

  beforeEach(() => {
    element = document.createElement('div');
    element.className = 'probe';
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    resetTheme();
  });

  it('reads the mode the element resolves to', () => {
    style('.probe { --dx-theme-mode: dark; }');

    expect(mode(element)).toBe('dark');
  });

  it('accepts a renderer wrapper as well as an element', () => {
    style('.probe { --dx-theme-mode: dark; }');

    expect(mode($(element))).toBe('dark');
  });

  it('falls back to the loaded theme when nothing declares a mode', () => {
    style(withThemeMarker('generic.dark'));

    expect(mode(element)).toBe('dark');
  });

  it('answers light for a loaded theme that is not dark', () => {
    style(withThemeMarker('generic.light'));

    expect(mode(element)).toBe('light');
  });

  it('lets the element outrank the loaded theme', () => {
    style(`${withThemeMarker('generic.dark')} .probe { --dx-theme-mode: light; }`);

    expect(mode(element)).toBe('light');
  });

  it('ignores a value that names no mode', () => {
    style(`${withThemeMarker('generic.dark')} .probe { --dx-theme-mode: sepia; }`);

    expect(mode(element)).toBe('dark');
  });

  it('answers for a detached element instead of throwing', () => {
    style(withThemeMarker('generic.dark'));

    expect(mode(document.createElement('div'))).toBe('dark');
  });
});

describe('themes.refreshMode', () => {
  it('announces that a resolved mode may have changed', () => {
    const told: number[] = [];
    const subscriber = (): void => { told.push(1); };

    themeModeChangedCallback.add(subscriber);

    try {
      refreshMode();
      refreshMode();

      expect(told).toHaveLength(2);
    } finally {
      themeModeChangedCallback.remove(subscriber);
    }
  });

  it('stops telling a subscriber that unsubscribed', () => {
    const told: number[] = [];
    const subscriber = (): void => { told.push(1); };

    themeModeChangedCallback.add(subscriber);
    themeModeChangedCallback.remove(subscriber);
    refreshMode();

    expect(told).toHaveLength(0);
  });
});
