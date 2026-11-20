import type { Locator } from '@playwright/test';
import type CardView from '../../../models/cardView';
import TreeView from '../../../models/treeView';

export const SELECTORS = {
  dragging: '.dx-sortable-dragging',
  treeView: '.dx-cardview-column-chooser .dx-treeview',
  treeViewItem: '.dx-treeview-item',
};

export const triggerDragStart = async (locator: Locator): Promise<void> => {
  await locator.evaluate((element) => {
    const left = element.getBoundingClientRect().left + 5;
    const top = element.getBoundingClientRect().top + 5;

    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: left,
      clientY: top,
    });

    const mouseMoveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: left + 0,
      clientY: top + 30,
    });

    element.dispatchEvent(mouseDownEvent);
    element.dispatchEvent(mouseMoveEvent);
  });
};

export const triggerDragEnd = async (locator: Locator): Promise<void> => {
  await locator.evaluate((element) => {
    const { top, left } = element.getBoundingClientRect();

    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      clientX: left,
      clientY: top,
    });

    element.dispatchEvent(mouseUpEvent);
  });
};

export const getColumnItem = (
  cardView: CardView,
  index: number,
  source: 'headerPanel' | 'columnChooser' = 'headerPanel',
): Locator => {
  const headers = cardView.getHeaders();

  if (source === 'headerPanel') {
    return headers.getHeaderItemNth(index).element;
  }

  // A Playwright locator does not match a scope that is itself the first part of the selector,
  // so the tree view is looked up from the page instead of from the column chooser element.
  const treeView = new TreeView(cardView.page, cardView.page.locator(SELECTORS.treeView));

  return treeView.getNodeItem(index).locator(SELECTORS.treeViewItem);
};
