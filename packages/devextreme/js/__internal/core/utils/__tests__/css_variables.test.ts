import { describe, expect, it } from '@jest/globals';
import {
  copyResolvedStyles,
  fallbackOf,
  isCssVariableReference,
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
