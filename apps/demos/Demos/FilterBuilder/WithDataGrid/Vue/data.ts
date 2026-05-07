import { type DxDataGridTypes } from "devextreme-vue/data-grid";
import { type DxFilterBuilderTypes } from 'devextreme-vue/filter-builder';

interface Product {
  Product_ID: number;
  Product_Name: string;
  Product_Cost: string;
  Product_Sale_Price: string;
  Product_Retail_Price: string;
  Product_Current_Inventory: number;
}

export const filter = [
  ['Product_Current_Inventory', '<>', 0],
  'or',
  [
    ['Product_Name', 'contains', 'HD'],
    'and',
    ['Product_Cost', '<', 200],
  ],
];

export const fields: (DxFilterBuilderTypes.Field)[] = [
  {
    caption: 'ID',
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

export const columns: (DxDataGridTypes.Column)[] = [
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

export const products: Product[] = [
  {
    Product_ID: 1,
    Product_Name: "HD Video Player",
    Product_Cost: "110.0000",
    Product_Sale_Price: "220.0000",
    Product_Retail_Price: "330.0000",
    Product_Current_Inventory: 225,
  },
  {
    Product_ID: 2,
    Product_Name: "SuperHD Video Player",
    Product_Cost: "175.0000",
    Product_Sale_Price: "275.0000",
    Product_Retail_Price: "400.0000",
    Product_Current_Inventory: 150,
  },
  {
    Product_ID: 3,
    Product_Name: "SuperPlasma 50",
    Product_Cost: "1100.0000",
    Product_Sale_Price: "1800.0000",
    Product_Retail_Price: "2400.0000",
    Product_Current_Inventory: 0,
  },
  {
    Product_ID: 4,
    Product_Name: "SuperLED 50",
    Product_Cost: "775.0000",
    Product_Sale_Price: "1100.0000",
    Product_Retail_Price: "1600.0000",
    Product_Current_Inventory: 77,
  },
  {
    Product_ID: 5,
    Product_Name: "SuperLED 42",
    Product_Cost: "675.0000",
    Product_Sale_Price: "1050.0000",
    Product_Retail_Price: "1450.0000",
    Product_Current_Inventory: 445,
  },
  {
    Product_ID: 6,
    Product_Name: "SuperLCD 55",
    Product_Cost: "745.0000",
    Product_Sale_Price: "1045.0000",
    Product_Retail_Price: "1350.0000",
    Product_Current_Inventory: 345,
  },
  {
    Product_ID: 7,
    Product_Name: "SuperLCD 42",
    Product_Cost: "710.0000",
    Product_Sale_Price: "999.0000",
    Product_Retail_Price: "1200.0000",
    Product_Current_Inventory: 210,
  },
  {
    Product_ID: 8,
    Product_Name: "SuperPlasma 65",
    Product_Cost: "1800.0000",
    Product_Sale_Price: "2900.0000",
    Product_Retail_Price: "3500.0000",
    Product_Current_Inventory: 0,
  },
  {
    Product_ID: 9,
    Product_Name: "SuperLCD 70",
    Product_Cost: "2125.0000",
    Product_Sale_Price: "3200.0000",
    Product_Retail_Price: "4000.0000",
    Product_Current_Inventory: 95,
  },
  {
    Product_ID: 10,
    Product_Name: "DesktopLED 21",
    Product_Cost: "75.0000",
    Product_Sale_Price: "125.0000",
    Product_Retail_Price: "175.0000",
    Product_Current_Inventory: 0,
  },
  {
    Product_ID: 11,
    Product_Name: "DesktopLED 19",
    Product_Cost: "70.0000",
    Product_Sale_Price: "115.0000",
    Product_Retail_Price: "165.0000",
    Product_Current_Inventory: 425,
  },
  {
    Product_ID: 12,
    Product_Name: "DesktopLCD 21",
    Product_Cost: "75.0000",
    Product_Sale_Price: "120.0000",
    Product_Retail_Price: "170.0000",
    Product_Current_Inventory: 210,
  },
  {
    Product_ID: 13,
    Product_Name: "DesktopLCD 19",
    Product_Cost: "68.0000",
    Product_Sale_Price: "110.0000",
    Product_Retail_Price: "160.0000",
    Product_Current_Inventory: 150,
  },
  {
    Product_ID: 14,
    Product_Name: "Projector Plus",
    Product_Cost: "225.0000",
    Product_Sale_Price: "400.0000",
    Product_Retail_Price: "550.0000",
    Product_Current_Inventory: 0,
  },
  {
    Product_ID: 15,
    Product_Name: "Projector PlusHD",
    Product_Cost: "425.0000",
    Product_Sale_Price: "600.0000",
    Product_Retail_Price: "750.0000",
    Product_Current_Inventory: 110,
  },
  {
    Product_ID: 16,
    Product_Name: "Projector PlusHT",
    Product_Cost: "725.0000",
    Product_Sale_Price: "900.0000",
    Product_Retail_Price: "1050.0000",
    Product_Current_Inventory: 0,
  },
  {
    Product_ID: 17,
    Product_Name: "ExcelRemote IR",
    Product_Cost: "55.0000",
    Product_Sale_Price: "105.0000",
    Product_Retail_Price: "150.0000",
    Product_Current_Inventory: 650,
  },
  {
    Product_ID: 18,
    Product_Name: "ExcelRemote Bluetooth",
    Product_Cost: "85.0000",
    Product_Sale_Price: "135.0000",
    Product_Retail_Price: "180.0000",
    Product_Current_Inventory: 310,
  },
  {
    Product_ID: 19,
    Product_Name: "ExcelRemote IP",
    Product_Cost: "105.0000",
    Product_Sale_Price: "155.0000",
    Product_Retail_Price: "200.0000",
    Product_Current_Inventory: 0,
  },
];
