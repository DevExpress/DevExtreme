import { ClientFunction } from 'testcafe';
import CardView from 'devextreme-testcafe-models/cardView';
import TreeView from 'devextreme-testcafe-models/treeView';

export const SELECTORS = {
  dragging: '.dx-sortable-dragging',
  treeView: '.dx-cardview-column-chooser .dx-treeview',
  treeViewItem: '.dx-treeview-item',
};

export const triggerDragStart = ClientFunction((selector) => {
  const element = selector() as Element;

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

export const triggerDragEnd = ClientFunction((selector) => {
  const element = selector() as Element;

  const { top, left } = element.getBoundingClientRect();

  const mouseUpEvent = new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
    clientX: left,
    clientY: top,
  });

  element.dispatchEvent(mouseUpEvent);
});

export const getColumnItem = (
  cardView: CardView,
  index: number,
  source: 'headerPanel' | 'columnChooser' = 'headerPanel',
): Selector => {
  const headers = cardView.getHeaders();
  const columnChooser = cardView.getColumnChooser();

  if (source === 'headerPanel') {
    return headers.getHeaderItemNth(index).element;
  }

  const treeView = new TreeView(columnChooser.element.find(SELECTORS.treeView));
  const column = treeView.getNodeItem(index).find(SELECTORS.treeViewItem);

  return column;
};

export const dragToHeaderPanel = async (
  t: TestController,
  cardView: CardView,
  columnElement: Selector,
  gapIndex: number,
): Promise<void> => {
  const headers = cardView.getHeaders();
  const columnsNum = await headers.getHeaderItemsElements().count;

  if (gapIndex < columnsNum) {
    const insertBeforeColumn = headers.getHeaderItemNth(gapIndex).element;

    await t.dragToElement(
      columnElement,
      insertBeforeColumn,
      { destinationOffsetX: +5, destinationOffsetY: -20, speed: 0.5 },
    );
  } else {
    const insertAfterColumn = headers.getHeaderItemNth(columnsNum - 1).element;

    await t.dragToElement(
      columnElement,
      insertAfterColumn,
      { destinationOffsetX: -5, destinationOffsetY: -20, speed: 0.5 },
    );
  }

  await t.wait(300);
};

export const dragToColumnChooser = async (
  t: TestController,
  cardView: CardView,
  columnElement: Selector,
): Promise<void> => {
  const columnChooser = cardView.getColumnChooser();
  const treeView = columnChooser.element.find(SELECTORS.treeView);

  await t.dragToElement(columnElement, treeView);
};

export const arrayMoveToGap = (arr: number[], index: number, gapIndex: number): number[] => {
  if (gapIndex === index || gapIndex === index + 1) return arr;

  const [element] = arr.splice(index, 1);

  const adjustedGapIndex = gapIndex > index ? gapIndex - 1 : gapIndex;

  arr.splice(adjustedGapIndex, 0, element);

  return arr;
};

export const expectColumns = async (
  t: TestController,
  cardView: CardView,
  expectedColumns: number[],
  source: 'headerPanel' | 'columnChooser' = 'headerPanel',
): Promise<void> => {
  const actualColumns: string[] = [];

  for (let i = 0; i < expectedColumns.length; i += 1) {
    let column: Selector;

    if (source === 'headerPanel') {
      column = cardView.getHeaders().getHeaderItemNth(i)?.element;
    } else {
      const treeView = new TreeView(cardView.getColumnChooser().element.find(SELECTORS.treeView));
      column = treeView.getNodeItem(i);
    }

    if (await column?.exists) {
      actualColumns.push(await column.innerText);
    }
  }

  const adjustedExpectedColumns = expectedColumns.map((columnIndex) => `Column ${columnIndex}`);

  await t.expect(actualColumns).eql(adjustedExpectedColumns);
};
