export const filter = [
  ['Category', '=', 'Video Players'],
  'or',
  [
    ['Category', '=', 'Monitors'],
    'and',
    ['Price', 'between', [165, 700]],
  ],
  'or',
  [
    ['Category', '=', 'Televisions'],
    'and',
    ['Price', 'between', [2000, 4000]],
  ],
];

export const categories = [
  'Video Players',
  'Televisions',
  'Monitors',
  'Projectors',
  'Automation',
];

export const fields = [
  {
    dataField: 'ID',
    dataType: 'number',
  },
  {
    dataField: 'Name.Surname',
  },
  {
    dataField: 'Price',
    dataType: 'number',
    format: 'currency',
  },
  {
    dataField: 'Current_Inventory',
    dataType: 'number',
    caption: 'Inventory',
  },
  {
    dataField: 'Category',
    lookup: {
      dataSource: categories,
    },
  },
];
