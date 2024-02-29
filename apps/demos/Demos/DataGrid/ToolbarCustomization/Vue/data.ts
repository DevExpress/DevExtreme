export type Order = {
  ID: number;

  OrderNumber: number;

  OrderDate: Date;

  SaleAmount: number;

  Terms: string;

  TotalAmount: number;

  CustomerStoreState: string;

  CustomerStoreCity: string;

  Employee:string;
};

export const orders: Order[] = [{
  ID: 1,
  OrderNumber: 35703,
  OrderDate: new Date(2014, 3, 10),
  SaleAmount: 11800,
  Terms: '15 Days',
  TotalAmount: 12175,
  CustomerStoreState: 'California',
  CustomerStoreCity: 'Los Angeles',
  Employee: 'Harv Mudd',
}, {
  ID: 4,
  OrderNumber: 35711,
  OrderDate: new Date(2014, 0, 12),
  SaleAmount: 16050,
  Terms: '15 Days',
  TotalAmount: 16550,
  CustomerStoreState: 'California',
  CustomerStoreCity: 'San Jose',
  Employee: 'Jim Packard',
}, {
  ID: 5,
  OrderNumber: 35714,
  OrderDate: new Date(2014, 0, 22),
  SaleAmount: 14750,
  Terms: '15 Days',
  TotalAmount: 15250,
  CustomerStoreState: 'Nevada',
  CustomerStoreCity: 'Las Vegas',
  Employee: 'Harv Mudd',
}, {
  ID: 7,
  OrderNumber: 35983,
  OrderDate: new Date(2014, 1, 7),
  SaleAmount: 3725,
  Terms: '15 Days',
  TotalAmount: 3850,
  CustomerStoreState: 'Colorado',
  CustomerStoreCity: 'Denver',
  Employee: 'Todd Hoffman',
}, {
  ID: 9,
  OrderNumber: 36987,
  OrderDate: new Date(2014, 2, 11),
  SaleAmount: 14200,
  Terms: '15 Days',
  TotalAmount: 14800,
  CustomerStoreState: 'Utah',
  CustomerStoreCity: 'Salt Lake City',
  Employee: 'Clark Morgan',
}, {
  ID: 11,
  OrderNumber: 38466,
  OrderDate: new Date(2014, 2, 1),
  SaleAmount: 7800,
  Terms: '15 Days',
  TotalAmount: 8200,
  CustomerStoreState: 'California',
  CustomerStoreCity: 'Los Angeles',
  Employee: 'Harv Mudd',
}, {
  ID: 14,
  OrderNumber: 39420,
  OrderDate: new Date(2014, 1, 15),
  SaleAmount: 20500,
  Terms: '15 Days',
  TotalAmount: 9100,
  CustomerStoreState: 'California',
  CustomerStoreCity: 'San Jose',
  Employee: 'Jim Packard',
}, {
  ID: 15,
  OrderNumber: 39874,
  OrderDate: new Date(2014, 1, 4),
  SaleAmount: 9050,
  Terms: '30 Days',
  TotalAmount: 19100,
  CustomerStoreState: 'Nevada',
  CustomerStoreCity: 'Las Vegas',
  Employee: 'Harv Mudd',
}, {
  ID: 18,
  OrderNumber: 42847,
  OrderDate: new Date(2014, 1, 15),
  SaleAmount: 20400,
  Terms: '30 Days',
  TotalAmount: 20800,
  CustomerStoreState: 'Wyoming',
  CustomerStoreCity: 'Casper',
  Employee: 'Todd Hoffman',
}, {
  ID: 19,
  OrderNumber: 43982,
  OrderDate: new Date(2014, 4, 29),
  SaleAmount: 6050,
  Terms: '30 Days',
  TotalAmount: 6250,
  CustomerStoreState: 'Utah',
  CustomerStoreCity: 'Salt Lake City',
  Employee: 'Clark Morgan',
}, {
  ID: 29,
  OrderNumber: 56272,
  OrderDate: new Date(2014, 1, 6),
  SaleAmount: 15850,
  Terms: '30 Days',
  TotalAmount: 16350,
  CustomerStoreState: 'Utah',
  CustomerStoreCity: 'Salt Lake City',
  Employee: 'Clark Morgan',
}, {
  ID: 30,
  OrderNumber: 57429,
  OrderDate: new Date(2013, 11, 31),
  SaleAmount: 11050,
  Terms: '30 Days',
  TotalAmount: 11400,
  CustomerStoreState: 'Arizona',
  CustomerStoreCity: 'Phoenix',
  Employee: 'Clark Morgan',
}];
