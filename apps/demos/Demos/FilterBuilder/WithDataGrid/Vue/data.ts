import { type DxDataGridTypes } from "devextreme-vue/data-grid";
import { type DxFilterBuilderTypes } from 'devextreme-vue/filter-builder';

export const filter = [
  ['Product_Current_Inventory', '<>', 0],
  'or',
  [
    ['Product_Name', 'contains', 'HD'],
    'and',
    ['Product_Cost', '<', 200],
  ],
];

export const fields: (DxFilterBuilderTypes.Field & DxDataGridTypes.Column)[] = [
  {
    caption: 'ID',
    dataField: 'Product_ID',
    dataType: 'number',
    width: 50,
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
