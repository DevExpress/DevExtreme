import type { RendererInstance, SvgElementInstance } from '@ts/viz/core/renderers/renderer';

export const createTracker = (
  renderer: RendererInstance,
  root: SvgElementInstance,
): SvgElementInstance => renderer
  .g()
  .attr({
    stroke: 'none',
    'stroke-width': 0,
    fill: '#000000',
    opacity: 0.0001,
  })
  .css({ cursor: 'pointer' })
  .append(root);

export const createVisibilityGroup = (
  renderer: RendererInstance,
  root: SvgElementInstance,
  className = '',
): SvgElementInstance => renderer.g().attr({ class: className }).append(root);

export const toggleDisplay = (blocks: SvgElementInstance[], isVisible: boolean): void => {
  const cssDisplayBlock = { display: 'block' };
  const cssDisplayNone = { display: 'none' };
  const style = isVisible ? cssDisplayBlock : cssDisplayNone;

  blocks.map((item) => item.css(style));
};
