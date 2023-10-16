/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';

// eslint-disable-next-line @typescript-eslint/no-restricted-imports,
import gridCoreUtils from '../m_utils';
import { CLASSES } from './const';

const createHandleTemplateFunc = (addWidgetPrefix) => (container, options) => {
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
