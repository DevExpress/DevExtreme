/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { rerender } from 'inferno';

import type { Options as CardViewOptions } from './options';
import { CardView } from './widget';

describe('common', () => {
  describe('initial render', () => {
    it('should be successfull', () => {
      const container = document.createElement('div');
      const cardView = new CardView(container, {});

      rerender();

      expect(container).toMatchSnapshot();
    });
  });
});

describe('options', () => {
  describe('rtlEnabled', () => {
    const container = document.createElement('div');
    const cardView = new CardView(container, {
      rtlEnabled: true,
      pager: {
        visible: true,
      },
    });

    it('should add dx-rtl class to container div', () => {
      expect(container.classList).toContain('dx-rtl');
    });

    it('should pass rtlEnabled options to nested components', () => {
      expect(
        $(container).find('.dx-pagination')
          // @ts-expect-error
          .dxPagination('instance').option('rtlEnabled'),
      ).toBe(true);
    });
  });
});

describe('regressions', () => {
  it('should not have leaks to defaultOptions after changing option', () => {
    const container = document.createElement('div');
    let cardView = new CardView(container, {
      keyExpr: 'a',
      dataSource: [{ a: 'a' }],
    });

    expect(cardView.option('pager.showPageSizeSelector')).toBe(false);

    cardView.option('pager.showPageSizeSelector', true);
    expect(cardView.option('pager.showPageSizeSelector')).toBe(true);

    cardView.dispose();

    cardView = new CardView(container, {
      keyExpr: 'a',
      dataSource: [{ a: 'a' }],
    });
    expect(cardView.option('pager.showPageSizeSelector')).toBe(false);
  });
});

describe('absence of multiple re-render', () => {
  const dataSource = [
    { id: 1, name: 'Audi' },
    { id: 2, name: 'BMW' },
  ];

  const columns = [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
  ];

  describe('card template', () => {
    it('should render each card template not more than once per sort update', () => {
      const cardTemplate = jest.fn();

      const container = document.createElement('div');
      const cardView = new CardView(container, {
        keyExpr: 'id',
        dataSource,
        columns,
        cardTemplate,
        sorting: {
          mode: 'single',
        },
      } as CardViewOptions);

      cardTemplate.mockClear();
      cardView.columnOption('name', 'sortOrder', 'asc');

      expect(cardTemplate).toBeCalledTimes(dataSource.length);
    });

    it('should render each card template not more than once per filter update', () => {
      const cardTemplate = jest.fn();

      const container = document.createElement('div');
      const cardView = new CardView(container, {
        keyExpr: 'id',
        dataSource,
        cardTemplate,
        columns: [
          ...columns.slice(0, -1),
          {
            dataField: 'name',
            caption: 'Name',
            filterValues: ['Audi'],
          }],
        headerFilter: {
          visible: true,
        },
      } as CardViewOptions);

      cardTemplate.mockClear();
      cardView.clearFilter();

      expect(cardTemplate).toBeCalledTimes(dataSource.length);
    });

    it('should render each card template not more than once per search update', () => {
      const cardTemplate = jest.fn();
      const searchValue = 'audi';
      const foundCards = dataSource.filter((card) => card.name.toLowerCase().includes(searchValue));
      const calledTimes = foundCards.length + dataSource.length;

      const container = document.createElement('div');
      const cardView = new CardView(container, {
        keyExpr: 'id',
        dataSource,
        columns,
        cardTemplate,
        searchPanel: {
          visible: true,
        },
      } as CardViewOptions);

      cardTemplate.mockClear();
      cardView.searchByText(searchValue);
      cardView.searchByText('');

      expect(cardTemplate).toBeCalledTimes(calledTimes);
    });
  });

  describe('card footer template', () => {
    it('should render each card template not more than once per sort update', () => {
      const cardFooterTemplate = jest.fn();

      const container = document.createElement('div');
      const cardView = new CardView(container, {
        keyExpr: 'id',
        dataSource,
        columns,
        cardFooterTemplate,
        sorting: {
          mode: 'single',
        },
      } as CardViewOptions);

      cardFooterTemplate.mockClear();
      cardView.columnOption('name', 'sortOrder', 'asc');

      expect(cardFooterTemplate).toBeCalledTimes(dataSource.length);
    });

    it('should render each card template not more than once per filter update', () => {
      const cardFooterTemplate = jest.fn();

      const container = document.createElement('div');
      const cardView = new CardView(container, {
        keyExpr: 'id',
        dataSource,
        cardFooterTemplate,
        columns: [
          ...columns.slice(0, -1),
          {
            dataField: 'name',
            caption: 'Name',
            filterValues: ['Audi'],
          }],
        headerFilter: {
          visible: true,
        },
      } as CardViewOptions);

      cardFooterTemplate.mockClear();
      cardView.clearFilter();

      expect(cardFooterTemplate).toBeCalledTimes(dataSource.length);
    });

    it('should render each card template not more than once per search update', () => {
      const cardFooterTemplate = jest.fn();
      const searchValue = 'audi';
      const foundCards = dataSource.filter((card) => card.name.toLowerCase().includes(searchValue));
      const calledTimes = foundCards.length + dataSource.length;

      const container = document.createElement('div');
      const cardView = new CardView(container, {
        keyExpr: 'id',
        dataSource,
        columns,
        cardFooterTemplate,
        searchPanel: {
          visible: true,
        },
      } as CardViewOptions);

      cardFooterTemplate.mockClear();
      cardView.searchByText(searchValue);
      cardView.searchByText('');

      expect(cardFooterTemplate).toBeCalledTimes(calledTimes);
    });
  });
});

describe('reactivity to column option changes', () => {
  const dataSource = [
    { id: 1, name: 'Audi' },
    { id: 2, name: 'BMW' },
  ];

  const columns = [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
  ];

  it('should re-render cards when column caption changes', () => {
    const cardTemplate = jest.fn();

    const container = document.createElement('div');
    const cardView = new CardView(container, {
      keyExpr: 'id',
      dataSource,
      columns,
      cardTemplate,
    } as CardViewOptions);

    cardTemplate.mockClear();
    cardView.columnOption('name', 'caption', 'Vehicle');

    expect(cardTemplate).toBeCalledTimes(dataSource.length);
  });

  it('should re-render cards when column format changes', () => {
    const cardTemplate = jest.fn();

    const container = document.createElement('div');
    const cardView = new CardView(container, {
      keyExpr: 'id',
      dataSource,
      columns,
      cardTemplate,
    } as CardViewOptions);

    cardTemplate.mockClear();
    cardView.columnOption('id', 'format', 'currency');

    expect(cardTemplate).toBeCalledTimes(dataSource.length);
  });

  it('should re-render cards when column alignment changes', () => {
    const cardTemplate = jest.fn();

    const container = document.createElement('div');
    const cardView = new CardView(container, {
      keyExpr: 'id',
      dataSource,
      columns,
      cardTemplate,
    } as CardViewOptions);

    cardTemplate.mockClear();
    cardView.columnOption('name', 'alignment', 'right');

    expect(cardTemplate).toBeCalledTimes(dataSource.length);
  });

  it('should not cause extra re-render when sort/filter options change', () => {
    const cardTemplate = jest.fn();

    const container = document.createElement('div');
    const cardView = new CardView(container, {
      keyExpr: 'id',
      dataSource,
      columns,
      cardTemplate,
      sorting: {
        mode: 'single',
      },
    } as CardViewOptions);

    cardTemplate.mockClear();
    cardView.columnOption('name', 'sortOrder', 'asc');

    // Should be called dataSource.length times (once per card for data update),
    // not dataSource.length * 2 (which would indicate extra re-render).
    expect(cardTemplate).toBeCalledTimes(dataSource.length);
  });
});
