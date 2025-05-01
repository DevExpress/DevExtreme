/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import CardView from '@ts/grids/new/card_view/widget';
import { rerender } from 'inferno';

const SELECTORS = {
  cardView: '.dx-cardview',
  card: '.dx-card',
  value: '.dx-cardview-field-value',
};

const rootQuerySelector = (selector: string) => document.body.querySelector(selector);
const rootQuerySelectorAll = (selector: string) => Array.from(
  document.body.querySelectorAll(selector),
);

const createCardView = (options: any): CardView => {
  const container = document.createElement('div');
  document.body.append(container);

  const cardView = new CardView(container, options);
  rerender();
  return cardView;
};

describe('ColumnsController - Column Option Generation', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let instance: CardView;

  afterEach(() => {
    const cardView = rootQuerySelector(SELECTORS.cardView);
    // @ts-expect-error
    $(cardView ?? undefined as any)?.dxCardView('dispose');
  });

  it('should auto-generate columns from first data row', () => {
    instance = createCardView({
      dataSource: [{
        name: 'Alice',
        age: 25,
        isActive: true,
        birthday: new Date(2000, 0, 1),
      }],
    });

    const columns = instance.getVisibleColumns();
    expect(columns.map((c) => c.dataField)).toEqual(['name', 'age', 'isActive', 'birthday']);
    expect(columns.find((c) => c.dataField === 'name')?.dataType).toBe('string');
    expect(columns.find((c) => c.dataField === 'age')?.dataType).toBe('number');
    expect(columns.find((c) => c.dataField === 'isActive')?.dataType).toBe('boolean');
    expect(columns.find((c) => c.dataField === 'birthday')?.dataType).toBe('date');
  });

  it('should regenerate columns with updated data types after dataSource change', () => {
    instance = createCardView({
      dataSource: [{ id: 1 }],
    });

    expect(instance.getVisibleColumns()[0].dataType).toBe('number');

    instance.option('dataSource', [{ id: 'foo' }]);
    rerender();

    expect(instance.getVisibleColumns()[0].dataType).toBe('string');
  });

  it.each([
    { value: 'hello', expected: 'string' },
    { value: 123, expected: 'number' },
    { value: true, expected: 'boolean' },
    { value: new Date(2020, 0, 1), expected: 'date' },
  ])('should respect auto-detected dataType = $expected', ({ value, expected }) => {
    instance = createCardView({
      dataSource: [{ col: value }],
    });

    const column = instance.getVisibleColumns().find((c) => c.dataField === 'col');
    expect(column?.dataType).toBe(expected);
  });

  it.each([
    {
      dataType: 'number', format: 'currency', value: 1999, expectedText: '$1,999',
    },
    {
      dataType: 'date', format: 'shortDate', value: new Date(2020, 0, 2), expectedText: '1/2/2020',
    },
    {
      dataType: 'boolean', format: undefined, value: true, expectedText: 'true',
    },
    {
      dataType: 'string', format: undefined, value: 'Test', expectedText: 'Test',
    },
  ])('should render formatted value in card for dataType=$dataType with format=$format', ({
    dataType, format, value, expectedText,
  }) => {
    instance = createCardView({
      dataSource: [{ field: value }],
      columns: [{ dataField: 'field', dataType, format }],
    });

    const renderedText = rootQuerySelectorAll(SELECTORS.value)[0]?.textContent;
    expect(renderedText).toBe(expectedText);
  });

  describe('when value has mismatched type from declared dataType', () => {
    it.each([
      { dataType: 'number', value: '1234', expectedText: '1234' },
      {
        dataType: 'date', value: 'abcde', format: 'shortDate', expectedText: 'abcde',
      },
      { dataType: 'boolean', value: 'hello', expectedText: 'true' },
      { dataType: 'string', value: 9876, expectedText: '9876' },
    ])('should render $value (type mismatch) with declared dataType=$dataType', ({
      dataType, value, expectedText, format,
    }) => {
      instance = createCardView({
        dataSource: [{ field: value }],
        columns: [{ dataField: 'field', dataType, format }],
      });

      const renderedText = rootQuerySelectorAll(SELECTORS.value)[0]?.textContent?.trim();
      expect(renderedText).toBe(expectedText);
    });
  });
});
