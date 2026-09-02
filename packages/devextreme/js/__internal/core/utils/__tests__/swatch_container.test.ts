import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { value as viewPort } from '@js/core/utils/view_port';
import swatchContainer from '@ts/core/utils/swatch_container';

/*
 * The viewport is mocked rather than assigned: `value(x)` falls back to <body> for anything empty,
 * so the state before documentReady - `value()` returning undefined - is otherwise unreachable,
 * and that is the state overlays created too early run into (T713615, T1143527).
 */
jest.mock('@js/core/utils/view_port');

const viewPortMock = viewPort as unknown as jest.Mock<() => unknown>;

const { getSwatchContainer } = swatchContainer;

// jsdom resolves a custom property declared ON an element but does not inherit it, so the tests
// name the resolved mode at the elements the code reads it from.
const MODE_STYLES = `
  .mode-light { --dx-theme-mode: light; }
  .mode-dark { --dx-theme-mode: dark; }
`;

const classesOf = (element: Element): string[] => [...element.classList].sort();

describe('getSwatchContainer', () => {
  let $viewport = document.createElement('div');

  const render = (markup: string): HTMLElement => {
    const host = document.createElement('div');

    host.innerHTML = markup;
    document.body.appendChild(host);

    return host.querySelector('.target') as HTMLElement;
  };

  const containerFor = (
    markup: string,
  ): Element => getSwatchContainer(render(markup))?.get(0) as Element;

  beforeEach(() => {
    document.head.innerHTML = `<style>${MODE_STYLES}</style>`;
    $viewport = document.createElement('div');
    $viewport.className = 'dx-viewport';
    document.body.appendChild($viewport);
    viewPortMock.mockReturnValue($($viewport));
  });

  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    viewPortMock.mockReset();
  });

  it('returns the viewport itself when the element is in no swatch and in no mode', () => {
    expect(containerFor('<div class="target"></div>')).toBe($viewport);
  });

  describe('swatches', () => {
    it('creates a container in the viewport for a swatch', () => {
      const container = containerFor('<div class="dx-swatch-custom"><div class="target"></div></div>');

      expect(classesOf(container)).toEqual(['dx-swatch-custom']);
      expect(container.parentElement).toBe($viewport);
    });

    it('reads the classes off the element itself', () => {
      expect(classesOf(containerFor('<div class="target dx-swatch-custom"></div>'))).toEqual(['dx-swatch-custom']);
    });

    it('carries every swatch class, not just the first', () => {
      const container = containerFor('<div class="dx-swatch-a dx-swatch-b"><div class="target"></div></div>');

      expect(classesOf(container)).toEqual(['dx-swatch-a', 'dx-swatch-b']);
    });

    it('takes the nearest swatch', () => {
      const container = containerFor(`
        <div class="dx-swatch-outer">
          <div class="dx-swatch-inner"><div class="target"></div></div>
        </div>`);

      expect(classesOf(container)).toEqual(['dx-swatch-inner']);
    });
  });

  describe('theme mode', () => {
    it('carries the mode the element resolved to', () => {
      const container = containerFor('<div class="target mode-dark"></div>');

      expect(classesOf(container)).toEqual(['dx-theme-mode-dark']);
      expect(container.parentElement).toBe($viewport);
    });

    /*
     * `dx-theme-mode-inverted` means "the opposite of my surroundings" and the container is
     * reparented to the viewport, where the surroundings are different ones - so the mode comes
     * from what the cascade resolved, never from the class the element wears.
     */
    it('names the resolved mode, not the class the element carries', () => {
      const container = containerFor('<div class="target dx-theme-mode-inverted mode-light"></div>');

      expect(classesOf(container)).toEqual(['dx-theme-mode-light']);
    });

    it('carries no mode when the theme declares none', () => {
      expect(containerFor('<div class="target dx-theme-mode-inverted"></div>')).toBe($viewport);
    });

    it('carries a swatch and a mode together', () => {
      const container = containerFor(`
        <div class="dx-swatch-custom">
          <div class="target mode-dark"></div>
        </div>`);

      expect(classesOf(container)).toEqual(['dx-swatch-custom', 'dx-theme-mode-dark']);
    });
  });

  describe('scopes the viewport already resolves to', () => {
    it('returns the viewport when it resolves to the same mode', () => {
      $viewport.classList.add('mode-dark');

      expect(containerFor('<div class="target mode-dark"></div>')).toBe($viewport);
      expect($viewport.children).toHaveLength(0);
    });

    it('returns the viewport when it sits in the same swatch', () => {
      const $swatch = document.createElement('div');

      $swatch.className = 'dx-swatch-custom';
      document.body.appendChild($swatch);
      $swatch.appendChild($viewport);

      expect(containerFor('<div class="dx-swatch-custom"><div class="target"></div></div>')).toBe($viewport);
    });

    it('creates a container when the modes differ', () => {
      $viewport.classList.add('mode-dark');

      const container = containerFor('<div class="target mode-light"></div>');

      expect(classesOf(container)).toEqual(['dx-theme-mode-light']);
      expect(container.parentElement).toBe($viewport);
    });
  });

  describe('reuse', () => {
    it('reuses one container for elements in the same swatch and mode', () => {
      const markup = '<div class="dx-swatch-custom"><div class="target mode-dark"></div></div>';

      expect(containerFor(markup)).toBe(containerFor(markup));
      expect($viewport.children).toHaveLength(1);
    });

    it('does not reuse a container carrying a scope the element is not in', () => {
      const inBoth = containerFor('<div class="dx-swatch-custom"><div class="target mode-dark"></div></div>');
      const inSwatch = containerFor('<div class="dx-swatch-custom"><div class="target"></div></div>');

      expect(inSwatch).not.toBe(inBoth);
      expect(classesOf(inSwatch)).toEqual(['dx-swatch-custom']);
    });

    // Only swatch and mode classes describe the scope; anything else on the page may have tagged
    // the container, and re-creating it on every call would grow the viewport without bound.
    it('reuses a container that picked up an unrelated class', () => {
      const first = containerFor('<div class="dx-swatch-custom"><div class="target"></div></div>');

      first.classList.add('some-app-class');

      expect(containerFor('<div class="dx-swatch-custom"><div class="target"></div></div>')).toBe(first);
      expect($viewport.children).toHaveLength(1);
    });
  });

  describe('before the viewport is set', () => {
    beforeEach(() => {
      viewPortMock.mockReturnValue(undefined);
    });

    it('reports no container for an element in no scope', () => {
      expect(getSwatchContainer(render('<div class="target"></div>'))).toBeUndefined();
    });

    it('reports no container for an element in a mode', () => {
      expect(getSwatchContainer(render('<div class="target mode-dark"></div>'))).toBeUndefined();
    });

    it('reports no container for an element in a swatch', () => {
      const element = render('<div class="dx-swatch-custom"><div class="target"></div></div>');

      expect(getSwatchContainer(element)).toBeUndefined();
    });
  });
});
