import {
  describe, expect, it, jest,
} from '@jest/globals';
import {
  copyResolvedStyles,
  fallbackOf,
  isCssVariableReference,
  paintedColor,
  portableColor,
  resolvedInScope,
} from '@ts/core/utils/css_variables';

describe('telling a reference from a value', () => {
  it.each([
    'var(--dx-viz-blue, #0078d4)',
    'var( --dx-viz-blue )',
    'color-mix(in srgb, var(--dx-viz-blue, #0078d4) 50%, #fff)',
  ])('sees a name in %s', (value) => {
    expect(isCssVariableReference(value)).toBe(true);
  });

  it.each(['#0078d4', 'rgb(0, 120, 212)', '', undefined, null, 42])('sees no name in %s', (value) => {
    expect(isCssVariableReference(value)).toBe(false);
  });
});

describe('the literal written beside a name', () => {
  it('is what the theme falls back to', () => {
    expect(fallbackOf('var(--dx-viz-blue, #0078d4)')).toBe('#0078d4');
  });

  it('is read through the spacing the author used', () => {
    expect(fallbackOf('var(  --dx-viz-blue ,   #0078d4 )')).toBe('#0078d4');
  });

  it('is the first one when a value mixes two names', () => {
    expect(fallbackOf('color-mix(in srgb, var(--dx-viz-blue, #0078d4) 50%, var(--dx-viz-green, #008f04))'))
      .toBe('#0078d4');
  });

  it('is the value itself when there is nothing to fall back to', () => {
    expect(fallbackOf('#0078d4')).toBe('#0078d4');
    expect(fallbackOf('var(--dx-viz-blue)')).toBe('var(--dx-viz-blue)');
  });
});

describe('resolving a value against the scope it is painted in', () => {
  it('hands back anything that is not a reference', () => {
    expect(resolvedInScope('#0078d4', document.body)).toBe('#0078d4');
  });

  it('falls back to the literal when the page declares no such name', () => {
    expect(resolvedInScope('var(--nowhere-at-all, #0078d4)', document.body)).toBe('#0078d4');
  });

  it('falls back to the literal when there is no element to ask', () => {
    expect(resolvedInScope('var(--dx-viz-blue, #0078d4)', undefined)).toBe('#0078d4');
  });
});

describe('a painted value in a form any reader takes', () => {
  it.each([
    ['rgb(11, 7, 3)', '#0b0703'],
    ['rgba(1, 2, 3, 0.5)', 'rgba(1, 2, 3, 0.5)'],
    ['color(srgb 0 0.5 0.4)', '#008066'],
    ['color(srgb 1.02745 -0.2 0.5 / 0.25)', 'rgba(255, 0, 128, 0.25)'],
  ])('turns %s into %s', (painted, handedOut) => {
    expect(portableColor(painted)).toBe(handedOut);
  });

  it.each([
    'oklch(0.55 0.15 250)',
    'color(display-p3 1 0 0)',
    'none',
    'rgb(from var(--dx-viz-blue, #0078d4) r g b)',
  ])('does not read %s as channels', (painted) => {
    expect(portableColor(painted)).toBeUndefined();
  });
});

describe('the colour a value is painted with, handed out', () => {
  const paintedWith = (...answers: string[]): { element: HTMLElement; restore: () => void } => {
    const element = document.createElement('div');
    const computed = jest.spyOn(window, 'getComputedStyle');

    answers.forEach((fill) => {
      computed.mockReturnValueOnce({ fill } as unknown as CSSStyleDeclaration);
    });
    document.body.appendChild(element);

    return {
      element,
      restore: (): void => {
        computed.mockRestore();
        element.remove();
      },
    };
  };

  it('is what the browser painted, when it answers in sRGB', () => {
    const { element, restore } = paintedWith('rgb(11, 7, 3)');

    expect(paintedColor('var(--dx-viz-blue, #0078d4)', element)).toBe('#0b0703');

    restore();
  });

  it('is brought to sRGB when the page declared the name in another colour space', () => {
    const { element, restore } = paintedWith('oklch(0.55 0.15 250)', 'color(srgb 0.0595434 0.455324 0.770876)');

    expect(paintedColor('var(--dx-viz-blue, #0078d4)', element)).toBe('#0f74c5');

    restore();
  });

  it('is the literal written beside the name when the browser answers no colour at all', () => {
    const { element, restore } = paintedWith('none', 'none');

    expect(paintedColor('var(--dx-viz-blue, #0078d4)', element)).toBe('#0078d4');

    restore();
  });
});

describe('copying resolved styles onto a detached copy', () => {
  const svgWith = (markup: string): SVGElement => {
    const host = document.createElement('div');

    host.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`;
    document.body.appendChild(host);

    return host.firstElementChild as SVGElement;
  };

  it('replaces a reference in a style with what the live node is painted with', () => {
    const source = svgWith('<rect></rect>');
    const rect = source.firstElementChild as SVGElement;

    rect.style.setProperty('fill', 'red');

    const copy = source.cloneNode(true) as SVGElement;
    const copiedRect = copy.firstElementChild as SVGElement;

    copiedRect.style.setProperty('fill', 'var(--dx-viz-blue, #0078d4)');
    copyResolvedStyles(source, copy);

    expect(copiedRect.style.getPropertyValue('fill')).toBe('red');
  });

  it('replaces a reference in an attribute the same way', () => {
    const source = svgWith('<rect></rect>');
    const rect = source.firstElementChild as SVGElement;

    rect.style.setProperty('fill', 'red');

    const copy = source.cloneNode(true) as SVGElement;
    const copiedRect = copy.firstElementChild as SVGElement;

    copiedRect.setAttribute('fill', 'var(--dx-viz-blue, #0078d4)');
    copyResolvedStyles(source, copy);

    expect(copiedRect.getAttribute('fill')).toBe('red');
  });

  it('leaves a literal alone', () => {
    const source = svgWith('<rect></rect>');
    const copy = source.cloneNode(true) as SVGElement;
    const copiedRect = copy.firstElementChild as SVGElement;

    copiedRect.style.setProperty('fill', '#00ff00');
    copiedRect.setAttribute('stroke', '#0000ff');
    copyResolvedStyles(source, copy);

    expect(copiedRect.style.getPropertyValue('fill')).toBe('#00ff00');
    expect(copiedRect.getAttribute('stroke')).toBe('#0000ff');
  });

  it('hands a colour the browser worked out over in a form any SVG reader takes', () => {
    const source = svgWith('<rect></rect>');
    const copy = source.cloneNode(true) as SVGElement;
    const copiedRect = copy.firstElementChild as SVGElement;
    const computed = jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (property: string) => ({
        stroke: 'color(srgb 0 0.5 0.4)',
        fill: 'color(srgb 0 0.5 0.4 / 0.5)',
      })[property] ?? '',
    } as unknown as CSSStyleDeclaration);

    copiedRect.setAttribute('stroke', 'color-mix(in srgb, var(--dx-viz-blue, #0078d4) 50%, #008f04)');
    copiedRect.style.setProperty('fill', 'var(--dx-viz-blue, #0078d4)');
    copyResolvedStyles(source, copy);
    computed.mockRestore();

    expect(copiedRect.getAttribute('stroke')).toBe('#008066');
    expect(copiedRect.style.getPropertyValue('fill')).toBe('rgba(0, 128, 102, 0.5)');
  });

  it('steps over a node that carries no style at all', () => {
    const source = new DOMParser().parseFromString('<text>a</text>', 'image/svg+xml').documentElement;
    const copy = source.cloneNode(true) as Element;

    expect(() => copyResolvedStyles(source, copy)).not.toThrow();
  });

  it('reaches the stroke a text node carries on a tspan of its own', () => {
    const source = svgWith('<text><tspan></tspan></text>');
    const tspan = source.querySelector('tspan') as SVGElement;

    tspan.style.setProperty('stroke', 'blue');

    const copy = source.cloneNode(true) as SVGElement;
    const copiedTspan = copy.querySelector('tspan') as SVGElement;

    copiedTspan.setAttribute('stroke', 'var(--dx-viz-bg, #ffffff)');
    copyResolvedStyles(source, copy);

    expect(copiedTspan.getAttribute('stroke')).toBe('blue');
  });
});
