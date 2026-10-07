import type { dxElementWrapper } from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';

import type { ViewsWithBorder } from './types';

const CLASSES = {
  borderedTop: 'dx-bordered-top-view',
  borderedBottom: 'dx-bordered-bottom-view',
};

const getFirstVisibleViewElement = ({
  columnHeadersView,
  rowsView,
}: ViewsWithBorder): dxElementWrapper | undefined => {
  if (columnHeadersView?.isVisible()) {
    return columnHeadersView.element();
  }

  return rowsView.element();
};

const getLastVisibleViewElement = ({
  filterPanelView,
  footerView,
  rowsView,
}: ViewsWithBorder): dxElementWrapper | undefined => {
  if (filterPanelView?.isVisible()) {
    return filterPanelView.element();
  }

  if (footerView?.isVisible()) {
    return footerView.element();
  }

  return rowsView.element();
};

const getViewElementWithClass = (
  viewsWithBorder: ViewsWithBorder,
  className: string,
): dxElementWrapper | null => {
  const borderedView = Object.values(viewsWithBorder)
    .find((view) => view?.element()?.hasClass(className));

  return borderedView?.element() ?? null;
};

const shouldUpdateBorders = (
  viewName: string,
  viewsWithBorder: ViewsWithBorder,
): boolean => {
  if (!Object.keys(viewsWithBorder).includes(viewName)) {
    return false;
  }

  const { rowsView, ...otherViews } = viewsWithBorder;
  if (!isDefined(rowsView?.element?.())) {
    return false;
  }

  return Object.values(otherViews)
    .filter((view) => view?.isVisible?.())
    .every((view) => isDefined(view?.element()));
};

export const updateViewsBorders = (
  viewName: string,
  viewsWithBorder: ViewsWithBorder,
): void => {
  if (!shouldUpdateBorders(viewName, viewsWithBorder)) {
    return;
  }

  const $oldFirst = getViewElementWithClass(viewsWithBorder, CLASSES.borderedTop);
  const $oldLast = getViewElementWithClass(viewsWithBorder, CLASSES.borderedBottom);
  const $newFirst = getFirstVisibleViewElement(viewsWithBorder);
  const $newLast = getLastVisibleViewElement(viewsWithBorder);

  if (!isDefined($newFirst) || !isDefined($newLast)) {
    return;
  }

  if ($oldFirst && !$oldFirst.is($newFirst)) {
    $oldFirst.removeClass(CLASSES.borderedTop);
  }

  if ($oldLast && !$oldLast.is($newLast)) {
    $oldLast.removeClass(CLASSES.borderedBottom);
  }

  if (!$newFirst.hasClass(CLASSES.borderedTop)) {
    $newFirst.addClass(CLASSES.borderedTop);
  }

  if (!$newLast.hasClass(CLASSES.borderedBottom)) {
    $newLast.addClass(CLASSES.borderedBottom);
  }
};
