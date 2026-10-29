import $ from '@js/core/renderer';
import gridCoreUtils from '@ts/grids/grid_core/utils';

import { CLASSES } from './const';
import type { HandleCellTemplate } from './types';

const createHandleTemplateFunc = (
  addWidgetPrefix: (className: string) => string,
): HandleCellTemplate => (container, options) => {
  const $container = $(container);

  if (options.rowType === 'data') {
    $container.addClass(CLASSES.cellFocusDisabled);
    return $('<span>').addClass(addWidgetPrefix(CLASSES.handleIcon));
  }
  gridCoreUtils.setEmptyText($container);

  return undefined;
};

export const GridCoreRowDraggingDom = {
  createHandleTemplateFunc,
};
