export const filter = [['Category', 'anyof', '']];
export const categories = [
  'Video Players',
  'Televisions',
  'Monitors',
  'Projectors',
  'Automation',
];
export const groupOperations = ['and', 'or'];
export const fields = [
  {
    dataField: 'Name',
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
    filterOperations: ['=', 'anyof'],
    lookup: {
      dataSource: categories,
    },
  },
];
