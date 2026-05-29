import { ClientFunction } from 'testcafe';

const getFocusedCellChangingEventArgs = ClientFunction(
  () => {
    const eventArgs = (window as any).focusedEventsTestData
      .find((data) => data.name === 'onFocusedCellChanging')
      .args;

    return {
      newColumnIndex: eventArgs.newColumnIndex,
      newRowIndex: eventArgs.newRowIndex,
      prevColumnIndex: eventArgs.prevColumnIndex,
      prevRowIndex: eventArgs.prevRowIndex,
    };
  },
);

const getFocusedRowChangingEventArgs = ClientFunction(
  () => {
    const eventArgs = (window as any).focusedEventsTestData
      .find((data) => data.name === 'onFocusedRowChanging')
      .args;

    return {
      newRowIndex: eventArgs.newRowIndex,
      prevRowIndex: eventArgs.prevRowIndex,
    };
  },
);

const getFocusedCellChangedEventArgs = ClientFunction(
  () => {
    const eventArgs = (window as any).focusedEventsTestData
      .find((data) => data.name === 'onFocusedCellChanged')
      .args;

    return {
      cellElementText: eventArgs.cellElement.get(0).textContent,
      columnIndex: eventArgs.columnIndex,
      row: {
        data: eventArgs.row.data,
      },
      rowIndex: eventArgs.rowIndex,
    };
  },
);

const getFocusedRowChangedEventArgs = ClientFunction(
  () => {
    const eventArgs = (window as any).focusedEventsTestData
      .find((data) => data.name === 'onFocusedRowChanged')
      .args;

    return {
      rowIndex: eventArgs.rowIndex,
    };
  },
);

export const getOrderOfEventCalls = ClientFunction(
  () => (window as any).focusedEventsTestData.map((data) => data.name),
);

export const resetFocusedEventsTestData = ClientFunction(() => {
  (window as any).focusedEventsTestData = [];
});

export const checkFocusedCellChangingEventArgs = async (
  t: TestController,
  expectedArgs: {
    newColumnIndex: number;
    newRowIndex: number;
    prevColumnIndex: number;
    prevRowIndex: number;
  },
): Promise<void> => {
  const args = await getFocusedCellChangingEventArgs();

  await t
    .expect(args.newColumnIndex)
    .eql(expectedArgs.newColumnIndex)
    .expect(args.newRowIndex)
    .eql(expectedArgs.newRowIndex)
    .expect(args.prevColumnIndex)
    .eql(expectedArgs.prevColumnIndex)
    .expect(args.prevRowIndex)
    .eql(expectedArgs.prevRowIndex);
};

export const checkFocusedRowChangingEventArgs = async (
  t: TestController,
  expectedArgs: {
    newRowIndex: number;
    prevRowIndex: number;
  },
): Promise<void> => {
  const args = await getFocusedRowChangingEventArgs();

  await t
    .expect(args.newRowIndex)
    .eql(expectedArgs.newRowIndex)
    .expect(args.prevRowIndex)
    .eql(expectedArgs.prevRowIndex);
};

export const checkFocusedCellChangedEventArgs = async (
  t: TestController,
  expectedArgs: {
    cellElement?: Selector;
    columnIndex: number;
    row?: {
      data: any;
    };
    rowIndex: number;
  },
): Promise<void> => {
  const args = await getFocusedCellChangedEventArgs();

  await t
    .expect(args.columnIndex)
    .eql(expectedArgs.columnIndex)
    .expect(args.rowIndex)
    .eql(expectedArgs.rowIndex);

  if (expectedArgs.row?.data) {
    await t
      .expect(args.row.data)
      .eql(expectedArgs.row.data);
  }

  if (expectedArgs.cellElement) {
    const expectedCellElementText = await expectedArgs.cellElement.textContent;
    await t
      .expect(args.cellElementText)
      .eql(expectedCellElementText);
  }
};

export const checkFocusedRowChangedEventArgs = async (
  t: TestController,
  expectedArgs: {
    rowIndex: number;
  },
): Promise<void> => {
  const args = await getFocusedRowChangedEventArgs();

  await t
    .expect(args.rowIndex)
    .eql(expectedArgs.rowIndex);
};

export const triggerEvent = async (
  element: Selector,
  eventName: string,
  eventOptions: Record<string, unknown> = {},
): Promise<void> => ClientFunction(() => {
  $(element()).trigger($.Event(eventName, eventOptions));
}, {
  dependencies: { element, eventName, eventOptions },
})();
