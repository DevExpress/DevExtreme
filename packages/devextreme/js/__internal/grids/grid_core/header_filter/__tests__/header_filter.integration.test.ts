import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

describe('headerFilter.groupInterval as array - tree popup', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('number[] - automatic numeric buckets', () => {
    it('builds a tree of nested buckets and filters by the selected one', async () => {
      const { instance, component } = await createDataGrid({
        dataSource: [
          { id: 1, price: 5 },
          { id: 2, price: 15 },
          { id: 3, price: 115 },
        ],
        headerFilter: { visible: true },
        columns: [
          {
            dataField: 'price',
            dataType: 'number',
            headerFilter: { groupInterval: [100, 10] },
          },
        ],
      });

      const headerFilter = component.openHeaderFilter(0);

      await flushAsync();
      await flushAsync();
      const treeView = headerFilter.getTreeView();
      treeView.expandAll();

      expect(treeView.getStructure()).toEqual([
        {
          text: '0 - 100',
          children: [
            { text: '0 - 10', children: [] },
            { text: '10 - 20', children: [] },
          ],
        },
        {
          text: '100 - 200',
          children: [{ text: '110 - 120', children: [] }],
        },
      ]);

      treeView.selectItemByText('0 - 100');
      await flushAsync();
      headerFilter.getOKButton().click();
      await flushAsync();

      expect([...(instance.getCombinedFilter(true) as unknown[])]).toEqual([
        ['price', '>=', 0], 'and', ['price', '<', 100],
      ]);
      expect(instance.getVisibleRows().map((row) => row.data.price)).toEqual([5, 15]);
    });
  });

  describe('string[] - hierarchical dataSource', () => {
    const createGrid = (): ReturnType<typeof createDataGrid> => createDataGrid({
      dataSource: [
        {
          id: 1, city: 'Munich', state: 'Bavaria', country: 'Germany',
        },
        {
          id: 2, city: 'Nuremberg', state: 'Bavaria', country: 'Germany',
        },
        {
          id: 3, city: 'Berlin', state: 'Berlin', country: 'Germany',
        },
        {
          id: 4, city: 'Lyon', state: 'Rhone', country: 'France',
        },
      ],
      headerFilter: { visible: true },
      columns: [
        {
          dataField: 'city',
          dataType: 'string',
          headerFilter: {
            groupInterval: ['country', 'state', 'city'],
            dataSource: [
              {
                text: 'Germany',
                value: 'Germany',
                items: [
                  {
                    text: 'Bavaria',
                    value: 'Bavaria',
                    items: [
                      { text: 'Munich', value: 'Munich' },
                      { text: 'Nuremberg', value: 'Nuremberg' },
                    ],
                  },
                  { text: 'Berlin', value: 'Berlin', items: [{ text: 'Berlin', value: 'Berlin' }] },
                ],
              },
              {
                text: 'France',
                value: 'France',
                items: [{ text: 'Rhone', value: 'Rhone', items: [{ text: 'Lyon', value: 'Lyon' }] }],
              },
            ],
          },
          calculateFilterExpression(filterValue, selectedFilterOperation, target) {
            if (target === 'headerFilter' && filterValue) {
              const operation = selectedFilterOperation ?? '=';
              return [
                [['country', operation, filterValue], 'or', ['state', operation, filterValue]],
                'or',
                ['city', operation, filterValue],
              ];
            }

            return this.defaultCalculateFilterExpression?.(
              filterValue,
              selectedFilterOperation,
              target,
            ) ?? '';
          },
        },
        { dataField: 'country', dataType: 'string' },
      ],
    });

    it('builds the hierarchy tree from the dataSource', async () => {
      const { component } = await createGrid();

      const headerFilter = component.openHeaderFilter(0);

      await flushAsync();
      await flushAsync();
      const treeView = headerFilter.getTreeView();
      treeView.expandAll();

      expect(treeView.getStructure()).toEqual([
        {
          text: 'Germany',
          children: [
            {
              text: 'Bavaria',
              children: [
                { text: 'Munich', children: [] },
                { text: 'Nuremberg', children: [] },
              ],
            },
            { text: 'Berlin', children: [{ text: 'Berlin', children: [] }] },
          ],
        },
        {
          text: 'France',
          children: [{ text: 'Rhone', children: [{ text: 'Lyon', children: [] }] }],
        },
      ]);
    });

    it.each([
      { node: 'Germany', cities: ['Munich', 'Nuremberg', 'Berlin'] },
      { node: 'Bavaria', cities: ['Munich', 'Nuremberg'] },
      { node: 'Munich', cities: ['Munich'] },
    ])('filters by the selected "$node" node', async ({ node, cities }) => {
      const { instance, component } = await createGrid();

      const headerFilter = component.openHeaderFilter(0);

      await flushAsync();
      await flushAsync();
      const treeView = headerFilter.getTreeView();
      treeView.expandAll();
      treeView.selectItemByText(node);
      await flushAsync();
      headerFilter.getOKButton().click();
      await flushAsync();

      expect([...(instance.getCombinedFilter(true) as unknown[])]).toEqual([
        [['country', '=', node], 'or', ['state', '=', node]],
        'or',
        ['city', '=', node],
      ]);
      expect(instance.getVisibleRows().map((row) => row.data.city)).toEqual(cities);
    });
  });
});
