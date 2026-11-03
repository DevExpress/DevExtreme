import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import { ALL_FOCUSABLE_ELEMENTS_SELECTOR } from '@ts/core/utils/selectors';
import eventsEngine from '@ts/events/core/events_engine';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { KeyDownEventSpies } from '@ts/grids/grid_core/keyboard_navigation/__tests__/helpers/utils';
import { triggerKeyDown } from '@ts/grids/grid_core/keyboard_navigation/__tests__/helpers/utils';

const ALEX = {
  name: 'Alex', phone: '555555', text: 'aaaaaa', room: 1,
};
const BOB = {
  name: 'Bob', phone: '777777', text: 'bbbbbb', room: 2,
};
const BOB_ROW_INDEX = 2;

const createGridWithExpandedAdaptiveRow = async (
  options: DataGridProperties,
): Promise<DataGridInstance> => {
  // JSDOM has no layout: without client rects the grid isn't :visible and hides no columns
  jest.spyOn(Element.prototype, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);

  const { instance } = await createDataGrid({
    keyExpr: 'name',
    dataSource: [ALEX, BOB],
    width: 150,
    columnWidth: 60,
    columnHidingEnabled: true,
    columns: ['name', { dataField: 'phone', hidingPriority: 0 }, { dataField: 'text', hidingPriority: 1 }, 'room'],
    ...options,
  });
  await flushAsync();

  instance.expandAdaptiveDetailRow(ALEX.name);
  await flushAsync();

  return instance;
};

const clickElement = (element: Element | undefined): void => {
  eventsEngine.trigger(element, 'dxpointerdown');
  eventsEngine.trigger(element, 'dxpointerup');
  eventsEngine.trigger(element, 'dxclick');
  jest.runAllTimers();
};

const getFocusedValue = (): string | undefined => (
  document.activeElement as HTMLInputElement | null
)?.value;

// JSDOM has no sequential focus navigation, so the browser's default Tab action is emulated
const pressShiftTab = (instance: DataGridInstance): KeyDownEventSpies => {
  const target = document.activeElement as HTMLElement;
  const spies = triggerKeyDown(instance, 'tab', target, { shiftKey: true });

  if (!spies.preventDefault.mock.calls.length) {
    const focusableElements = Array.from(
      instance.element().querySelectorAll<HTMLElement>(ALL_FOCUSABLE_ELEMENTS_SELECTOR),
    );

    focusableElements[focusableElements.indexOf(target) - 1]?.focus();
  }

  jest.runAllTimers();

  return spies;
};

describe('Adaptivity keyboard navigation', () => {
  beforeEach(beforeTest);
  afterEach(() => {
    afterTest();
    jest.restoreAllMocks();
  });

  describe.each(['batch', 'cell'] as const)('Shift+Tab from the row after an expanded adaptive row (%s edit mode)', (mode) => {
    const editing = { mode, allowUpdating: true };

    it('should walk the adaptive editors in the reverse of the Tab order', async () => {
      const instance = await createGridWithExpandedAdaptiveRow({ editing });

      clickElement(instance.getCellElement(BOB_ROW_INDEX, 'name'));
      expect(getFocusedValue()).toBe(BOB.name);

      const focusPath = [1, 2, 3].map(() => {
        pressShiftTab(instance);

        return getFocusedValue();
      });

      expect(focusPath).toEqual([ALEX.text, ALEX.phone, String(ALEX.room)]);
    });

    it('should keep the browser from moving focus once the last adaptive editor is focused', async () => {
      const instance = await createGridWithExpandedAdaptiveRow({ editing });

      clickElement(instance.getCellElement(BOB_ROW_INDEX, 'name'));
      const { preventDefault } = pressShiftTab(instance);

      expect(getFocusedValue()).toBe(ALEX.text);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should leave Shift+Tab to the browser when the last adaptive item is not editable', async () => {
      const instance = await createGridWithExpandedAdaptiveRow({
        editing,
        columns: [
          'name',
          { dataField: 'phone', hidingPriority: 0 },
          { dataField: 'text', hidingPriority: 1, allowEditing: false },
          'room',
        ],
      });

      clickElement(instance.getCellElement(BOB_ROW_INDEX, 'name'));
      const { preventDefault } = triggerKeyDown(instance, 'tab', document.activeElement, { shiftKey: true });

      expect(preventDefault).not.toHaveBeenCalled();
    });
  });
});
