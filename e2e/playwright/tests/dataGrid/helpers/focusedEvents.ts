import type { Page } from '@playwright/test';

// A test grid's focused-event handlers push { name, args } to window.focusedEvents. The args hold
// the component and elements, which don't leave the page: only their plain values come back.

export interface FocusedCellChangedArgs {
  cellText: string;
  columnIndex: number;
  rowIndex: number;
  rowData: unknown;
}

export type FocusedEvent = {
  name: 'onFocusedCellChanging';
  args: {
    newColumnIndex: number;
    newRowIndex: number;
    prevColumnIndex: number;
    prevRowIndex: number;
  };
} | {
  name: 'onFocusedRowChanging';
  args: { newRowIndex: number; prevRowIndex: number };
} | {
  name: 'onFocusedCellChanged';
  args: FocusedCellChangedArgs;
} | {
  name: 'onFocusedRowChanged';
  args: { rowIndex: number };
};

export const resetFocusedEvents = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    (window as any).focusedEvents = [];
  });
};

export const getFocusedEvents = (page: Page): Promise<FocusedEvent[]> => page.evaluate(
  () => (window as any).focusedEvents.map(({ name, args }) => {
    switch (name) {
      case 'onFocusedCellChanging':
        return {
          name,
          args: {
            newColumnIndex: args.newColumnIndex,
            newRowIndex: args.newRowIndex,
            prevColumnIndex: args.prevColumnIndex,
            prevRowIndex: args.prevRowIndex,
          },
        };
      case 'onFocusedRowChanging':
        return { name, args: { newRowIndex: args.newRowIndex, prevRowIndex: args.prevRowIndex } };
      case 'onFocusedCellChanged':
        return {
          name,
          args: {
            cellText: $(args.cellElement).text(),
            columnIndex: args.columnIndex,
            rowIndex: args.rowIndex,
            rowData: args.row?.data,
          },
        };
      case 'onFocusedRowChanged':
        return { name, args: { rowIndex: args.rowIndex } };
      default:
        throw new Error(`Unknown focused event: ${name}`);
    }
  }),
);

export const getFocusedCellChangedArgs = async (
  page: Page,
): Promise<FocusedCellChangedArgs | null> => {
  const events = await getFocusedEvents(page);
  const event = events.find((focusedEvent) => focusedEvent.name === 'onFocusedCellChanged');

  return event?.args ?? null;
};
