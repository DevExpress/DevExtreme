import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { value as viewPort } from '@js/core/utils/view_port';
import swatchContainer from '@ts/core/utils/swatch_container';

const { getSwatchContainer } = swatchContainer;

const classesOf = (element: Element | undefined): string[] => [...(element?.classList ?? [])]
  .sort();

describe('getSwatchContainer', () => {
  let $viewport = document.createElement('div');

  const render = (markup: string): HTMLElement => {
    const host = document.createElement('div');

    host.innerHTML = markup;
    document.body.appendChild(host);

    return host.querySelector('.target') as HTMLElement;
  };

  const containerFor = (markup: string): Element => getSwatchContainer(render(markup)).get(0);

  beforeEach(() => {
    $viewport = document.createElement('div');
    $viewport.className = 'dx-viewport';
    document.body.appendChild($viewport);
    viewPort($viewport);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    viewPort(undefined);
  });

  it('returns the viewport itself when the element is in no swatch and in no named mode', () => {
    expect(containerFor('<div class="target"></div>')).toBe($viewport);
  });

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

  it('carries a named theme mode', () => {
    const container = containerFor('<div class="dx-theme-mode-dark"><div class="target"></div></div>');

    expect(classesOf(container)).toEqual(['dx-theme-mode-dark']);
    expect(container.parentElement).toBe($viewport);
  });

  it('carries a swatch and a theme mode declared on different ancestors', () => {
    const container = containerFor(`
      <div class="dx-swatch-custom">
        <div class="dx-theme-mode-dark"><div class="target"></div></div>
      </div>`);

    expect(classesOf(container)).toEqual(['dx-swatch-custom', 'dx-theme-mode-dark']);
  });

  it('takes the nearest declaration of each kind', () => {
    const container = containerFor(`
      <div class="dx-swatch-outer dx-theme-mode-light">
        <div class="dx-swatch-inner">
          <div class="dx-theme-mode-dark"><div class="target"></div></div>
        </div>
      </div>`);

    expect(classesOf(container)).toEqual(['dx-swatch-inner', 'dx-theme-mode-dark']);
  });

  it('reuses one container for elements in the same swatch and mode', () => {
    const markup = '<div class="dx-swatch-custom dx-theme-mode-dark"><div class="target"></div></div>';

    expect(containerFor(markup)).toBe(containerFor(markup));
    expect($viewport.children).toHaveLength(1);
  });

  it('does not reuse a container that carries classes the element is not in', () => {
    const inBoth = containerFor('<div class="dx-swatch-custom dx-theme-mode-dark"><div class="target"></div></div>');
    const inSwatch = containerFor('<div class="dx-swatch-custom"><div class="target"></div></div>');

    expect(inSwatch).not.toBe(inBoth);
    expect(classesOf(inSwatch)).toEqual(['dx-swatch-custom']);
  });

  describe('inverted mode', () => {
    it('is carried as is when no named mode surrounds it', () => {
      const container = containerFor('<div class="dx-theme-mode-inverted"><div class="target"></div></div>');

      expect(classesOf(container)).toEqual(['dx-theme-mode-inverted']);
    });

    it('resolves to light inside a dark scope', () => {
      const container = containerFor(`
        <div class="dx-theme-mode-dark">
          <div class="dx-theme-mode-inverted"><div class="target"></div></div>
        </div>`);

      expect(classesOf(container)).toEqual(['dx-theme-mode-light']);
    });

    it('resolves to dark inside a light scope', () => {
      const container = containerFor(`
        <div class="dx-theme-mode-light">
          <div class="dx-theme-mode-inverted"><div class="target"></div></div>
        </div>`);

      expect(classesOf(container)).toEqual(['dx-theme-mode-dark']);
    });

    it('resolves against the nearest named scope, not the outermost', () => {
      const container = containerFor(`
        <div class="dx-theme-mode-light">
          <div class="dx-theme-mode-dark">
            <div class="dx-theme-mode-inverted"><div class="target"></div></div>
          </div>
        </div>`);

      expect(classesOf(container)).toEqual(['dx-theme-mode-light']);
    });

    it('does not invert again when nested in another inverted block', () => {
      const container = containerFor(`
        <div class="dx-theme-mode-inverted">
          <div class="dx-theme-mode-inverted"><div class="target"></div></div>
        </div>`);

      expect(classesOf(container)).toEqual(['dx-theme-mode-inverted']);
    });

    it('resolves nested inverted blocks against the named scope around them', () => {
      const container = containerFor(`
        <div class="dx-theme-mode-dark">
          <div class="dx-theme-mode-inverted">
            <div class="dx-theme-mode-inverted"><div class="target"></div></div>
          </div>
        </div>`);

      expect(classesOf(container)).toEqual(['dx-theme-mode-light']);
    });
  });
});
