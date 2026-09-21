import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import errors from '@js/ui/widget/ui.errors';
import { themeModeChangedCallback } from '@ts/ui/m_themes_callback';
import {
  customAccentColor, isFluentNext, mode, refreshMode, resetTheme,
} from '@ts/ui/themes';

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
});

describe('themes.isFluentNext', () => {
  it.each([
    'fluent-next.blue.light',
    'fluent-next.blue.dark',
    'fluent-next.blue.light.compact',
    'fluent-next.blue.dark.compact',
  ])('knows %s by name', (themeName) => {
    expect(isFluentNext(themeName)).toBe(true);
  });

  it.each([
    'fluent.blue.light',
    'generic.light',
    'material.blue.light',
  ])('tells %s from it, though the fluent name is a part of the fluent-next one', (themeName) => {
    expect(isFluentNext(themeName)).toBe(false);
  });
});

describe('themes.customAccentColor', () => {
  const useTheme = (themeName: string, pageCss = ''): void => {
    style(`${withThemeMarker(themeName)} ${pageCss}`);
    resetTheme();
  };

  const useNoThemeYet = (): void => {
    style('');
    resetTheme();
  };

  const declaredAccentColor = (): string => window.getComputedStyle(document.documentElement)
    .getPropertyValue('--dx-accent-color')
    .trim();

  beforeEach(() => {
    useTheme('fluent-next.blue.light');
  });

  afterEach(() => {
    document.documentElement.style.removeProperty('--dx-accent-color');
    document.head.innerHTML = '';
    resetTheme();
    jest.restoreAllMocks();
  });

  it.each([
    '#a703ff',
    '#abc',
    '#a703ff80',
    'rebeccapurple',
    'rgb(167, 3, 255)',
    'rgb(167 3 255)',
    'hsl(280 100% 50%)',
    'oklch(0.6 0.15 250)',
    'color-mix(in oklab, red, blue)',
    'transparent',
  ])('declares %s as given, a color the browser parses', (value) => {
    customAccentColor(value);

    expect(declaredAccentColor()).toBe(value);
  });

  it('reads the color the page declares in a stylesheet', () => {
    useTheme('fluent-next.blue.light', ':root { --dx-accent-color: #0f6cbd; }');

    expect(customAccentColor()).toBe('#0f6cbd');
  });

  it('answers with nothing while no accent color is declared', () => {
    expect(customAccentColor()).toBe('');
  });

  it('answers with the color when the value handed in is absent', () => {
    const withAnAbsentValue = customAccentColor as (color?: string | null) => string | undefined;
    customAccentColor('#a703ff');

    expect(withAnAbsentValue(undefined)).toBe('#a703ff');
    expect(declaredAccentColor()).toBe('#a703ff');
  });

  it('brings back the palette of the theme when passed null', () => {
    useTheme('fluent-next.blue.light', ':root { --dx-accent-color: #0f6cbd; }');
    customAccentColor('#a703ff');

    customAccentColor(null);

    expect(declaredAccentColor()).toBe('#0f6cbd');
  });

  it.each([
    'foo',
    'rgb(167 3)',
    '   ',
  ])('leaves the accent color alone and warns about %s, which parses as no color at all', (value) => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});
    customAccentColor('#a703ff');

    customAccentColor(value);

    expect(declaredAccentColor()).toBe('#a703ff');
    expect(log).toHaveBeenCalledWith('W0024', value);
  });

  it('brings back the palette of the theme when passed an empty string', () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});
    useTheme('fluent-next.blue.light', ':root { --dx-accent-color: #0f6cbd; }');
    customAccentColor('#a703ff');

    customAccentColor('');

    expect(declaredAccentColor()).toBe('#0f6cbd');
    expect(log).not.toHaveBeenCalled();
  });

  it('takes back whatever the getter hands out while no accent color is declared', () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});

    customAccentColor(customAccentColor());

    expect(log).not.toHaveBeenCalled();
  });

  it.each([
    'currentColor',
    'inherit',
    'initial',
    'unset',
    'revert',
    'revert-layer',
  ])('refuses %s, which points at another color instead of naming one', (value) => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});

    customAccentColor(value);

    expect(declaredAccentColor()).toBe('');
    expect(log).toHaveBeenCalledWith('W0024', value);
  });

  it('reads the value the same however it is capitalized or spaced', () => {
    jest.spyOn(errors, 'log').mockImplementation(() => {});

    customAccentColor(' #A703FF ');
    const written = declaredAccentColor();
    customAccentColor('INHERIT');

    expect([written, declaredAccentColor()]).toEqual(['#A703FF', '#A703FF']);
  });

  it('declares the color and warns when the loaded theme knows no accent color', () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});
    useTheme('generic.light');

    customAccentColor('#a703ff');

    expect(declaredAccentColor()).toBe('#a703ff');
    expect(log).toHaveBeenCalledWith('W0025', 'generic.light');
  });

  it('tells the fluent theme apart from the fluent-next one', () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});
    useTheme('fluent.blue.light');

    customAccentColor('#a703ff');

    expect(declaredAccentColor()).toBe('#a703ff');
    expect(log).toHaveBeenCalledWith('W0025', 'fluent.blue.light');
  });

  it('declares the color and stays silent while no theme has named itself yet', () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});
    useNoThemeYet();

    customAccentColor('#a703ff');

    expect(declaredAccentColor()).toBe('#a703ff');
    expect(log).not.toHaveBeenCalled();
  });

  it('clears the color a theme that knows no accent has inherited from the previous one', () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});
    customAccentColor('#a703ff');
    useTheme('generic.light');

    customAccentColor(null);

    expect(declaredAccentColor()).toBe('');
    expect(log).not.toHaveBeenCalled();
  });
});
