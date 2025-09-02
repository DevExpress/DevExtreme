import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { value } from '@js/core/utils/view_port';

export const SWATCH_CONTAINER_CLASS_PREFIX = 'dx-swatch-';

const getSwatchContainer = (
  element: Element | dxElementWrapper,
): dxElementWrapper => {
  const $element = $(element);
  const swatchContainer = $element.closest(`[class^="${SWATCH_CONTAINER_CLASS_PREFIX}"], [class*=" ${SWATCH_CONTAINER_CLASS_PREFIX}"]`);
  const viewport: dxElementWrapper = value();

  if (!swatchContainer.length) {
    return viewport;
  }

  const swatchClassRegex = new RegExp(`(\\s|^)(${SWATCH_CONTAINER_CLASS_PREFIX}.*?)(\\s|$)`);
  const swatchClass = swatchContainer[0].className.match(swatchClassRegex)[2];
  let viewportSwatchContainer = viewport.children(`.${swatchClass}`);

  if (!viewportSwatchContainer.length) {
    viewportSwatchContainer = $('<div>').addClass(swatchClass).appendTo(viewport);
  }

  return viewportSwatchContainer;
};

export default { getSwatchContainer };
