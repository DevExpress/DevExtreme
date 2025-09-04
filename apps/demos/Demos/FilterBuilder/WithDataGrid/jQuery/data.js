const filter = [
  // ['Product_Current_Inventory', '<>', 0],
  // 'or',
  [
    ['ProductName', 'contains', 'Ch'],
    'and',
    ['UnitPrice', '<', 20],
  ],
];
const fields = [
  {
    caption: 'ID',
    width: 50,
    dataField: 'ProductID',
    dataType: 'number',
  }, {
    dataField: 'ProductName',
    dataType: 'string',
  }, {
    caption: 'Cost',
    dataField: 'UnitPrice',
    dataType: 'number',
    format: 'currency',
  },
];
