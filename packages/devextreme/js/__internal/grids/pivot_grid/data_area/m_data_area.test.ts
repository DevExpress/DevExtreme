import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { DataArea } from './m_data_area';

const createComponent = (): unknown => ({
  option: (optionName?: string) => {
    if (optionName === undefined) {
      return {};
    }

    return {
      rtlEnabled: false,
      encodeHtml: false,
    }[optionName];
  },
  _eventsStrategy: { hasEvent: () => false },
  _defaultActionArgs: () => ({}),
});

describe('DataArea', () => {
  let container: HTMLElement = document.createElement('div');

  const cellsData = [
    [{ text: '1' }, { text: '2' }],
    [{ text: '3' }, { text: '4' }],
  ];

  const renderDataArea = (data: unknown[]): DataArea => {
    const area = new DataArea(createComponent());

    area.render($(container), data);

    return area;
  };

  const getCellsTabIndexes = (): (string | null)[] => Array.from(container.querySelectorAll('td'))
    .map((cell) => cell.getAttribute('tabindex'));

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('render', () => {
    it('should make only the first data cell focusable', () => {
      renderDataArea(cellsData);

      expect(getCellsTabIndexes()).toEqual(['0', null, null, null]);
    });

    it('should keep the first data cell focusable after re-render', () => {
      const area = renderDataArea(cellsData);

      area.render($(container), cellsData);

      expect(getCellsTabIndexes()).toEqual(['0', null, null, null]);
    });

    it('should not fail when there is no data', () => {
      expect(() => renderDataArea([])).not.toThrow();
    });
  });
});
