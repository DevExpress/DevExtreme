import { Injectable } from '@angular/core';

export type Condition = Condition[] | string | number;
export type Fields = typeof fields;

const filter: Condition = [
  ['Product_Current_Inventory', '<>', 0],
  'or',
  [
    ['Product_Name', 'contains', 'HD'],
    'and',
    ['Product_Cost', '<', 200],
  ],
];
const fields: Record<string, string | number>[] = [
  {
    caption: 'ID',
    width: 50,
    dataField: 'Product_ID',
    dataType: 'number',
  }, {
    dataField: 'Product_Name',
    dataType: 'string',
  }, {
    caption: 'Cost',
    dataField: 'Product_Cost',
    dataType: 'number',
    format: 'currency',
  }, {
    dataField: 'Product_Sale_Price',
    caption: 'Sale Price',
    dataType: 'number',
    format: 'currency',
  }, {
    dataField: 'Product_Retail_Price',
    caption: 'Retail Price',
    dataType: 'number',
    format: 'currency',
  }, {
    dataField: 'Product_Current_Inventory',
    dataType: 'number',
    caption: 'Inventory',
  },
];

@Injectable()
export class Service {
  getFields(): Fields {
    return fields;
  }

  getFilter(): Condition {
    return filter;
  }
}
