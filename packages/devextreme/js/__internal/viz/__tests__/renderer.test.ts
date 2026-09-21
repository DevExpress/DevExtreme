import { describe, expect, it } from '@jest/globals';
import { Renderer } from '@ts/viz/core/renderers/renderer';

interface Shape {
  element: SVGElement;
  attr: (attrs: Record<string, string | null>) => void;
}

type RendererConstructor = new (options: { container: HTMLElement }) => { rect: () => Shape };

describe('a shape painted from a published name', () => {
  const REFERENCE = 'var(--dx-viz-blue, #0078d4)';
  const shape = (): Shape => new (Renderer as unknown as RendererConstructor)({
    container: document.createElement('div'),
  }).rect();

  it('carries the reference in the style, where the cascade resolves it', () => {
    const rect = shape();

    rect.attr({ fill: REFERENCE });

    expect(rect.element.getAttribute('fill')).toBe(null);
    expect(rect.element.style.getPropertyValue('fill')).toBe(REFERENCE);
  });

  it('goes back to an attribute when the colour becomes a literal', () => {
    const rect = shape();

    rect.attr({ fill: REFERENCE });
    rect.attr({ fill: '#ff0000' });

    expect(rect.element.getAttribute('fill')).toBe('#ff0000');
    expect(rect.element.style.getPropertyValue('fill')).toBe('');
  });

  it('leaves nothing behind when the colour is taken away', () => {
    const rect = shape();

    rect.attr({ fill: REFERENCE });
    rect.attr({ fill: null });

    expect(rect.element.getAttribute('fill')).toBe(null);
    expect(rect.element.style.getPropertyValue('fill')).toBe('');
  });

  it('keeps every reference apart from the others', () => {
    const rect = shape();

    rect.attr({ fill: REFERENCE, stroke: 'var(--dx-viz-border, #d1d1d1)' });
    rect.attr({ stroke: '#000000' });

    expect(rect.element.style.getPropertyValue('fill')).toBe(REFERENCE);
    expect(rect.element.style.getPropertyValue('stroke')).toBe('');
    expect(rect.element.getAttribute('stroke')).toBe('#000000');
  });
});
