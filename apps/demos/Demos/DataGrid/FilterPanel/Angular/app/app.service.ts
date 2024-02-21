import { Injectable } from '@angular/core';

export class Order {
  ID: number;

  OrderNumber: number;

  OrderDate: string;

  SaleAmount: number;

  Terms: string;

  CustomerInfo: {
    StoreState: string;
    StoreCity: string;
  };

  Employee: string;
}

const orders: Order[] = [{
  ID: 1,
  OrderNumber: 35703,
  OrderDate: '2014/04/10',
  SaleAmount: 11800,
  Terms: '15 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'Los Angeles',
  },
}, {
  ID: 4,
  OrderNumber: 35711,
  OrderDate: '2014/01/12',
  SaleAmount: 16050,
  Terms: '15 Days',
  Employee: 'Jim Packard',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'San Jose',
  },
}, {
  ID: 5,
  OrderNumber: 35714,
  OrderDate: '2014/01/22',
  SaleAmount: 14750,
  Terms: '15 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Las Vegas',
  },
}, {
  ID: 7,
  OrderNumber: 35983,
  OrderDate: '2014/02/07',
  SaleAmount: 3725,
  Terms: '15 Days',
  Employee: 'Todd Hoffman',
  CustomerInfo: {
    StoreState: 'Colorado',
    StoreCity: 'Denver',
  },
}, {
  ID: 9,
  OrderNumber: 36987,
  OrderDate: '2014/03/11',
  SaleAmount: 14200,
  Terms: '15 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Utah',
    StoreCity: 'Salt Lake City',
  },
}, {
  ID: 11,
  OrderNumber: 38466,
  OrderDate: '2014/03/01',
  SaleAmount: 7800,
  Terms: '15 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'Los Angeles',
  },
}, {
  ID: 14,
  OrderNumber: 39420,
  OrderDate: '2014/02/15',
  SaleAmount: 20500,
  Terms: '15 Days',
  Employee: 'Jim Packard',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'San Jose',
  },
}, {
  ID: 15,
  OrderNumber: 39874,
  OrderDate: '2014/02/04',
  SaleAmount: 9050,
  Terms: '30 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Las Vegas',
  },
}, {
  ID: 18,
  OrderNumber: 42847,
  OrderDate: '2014/02/15',
  SaleAmount: 20400,
  Terms: '30 Days',
  Employee: 'Todd Hoffman',
  CustomerInfo: {
    StoreState: 'Wyoming',
    StoreCity: 'Casper',
  },
}, {
  ID: 19,
  OrderNumber: 43982,
  OrderDate: '2014/05/29',
  SaleAmount: 6050,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Utah',
    StoreCity: 'Salt Lake City',
  },
}, {
  ID: 29,
  OrderNumber: 56272,
  OrderDate: '2014/02/06',
  SaleAmount: 15850,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Utah',
    StoreCity: 'Salt Lake City',
  },
}, {
  ID: 30,
  OrderNumber: 57429,
  OrderDate: '2014/05/16',
  SaleAmount: 11050,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Arizona',
    StoreCity: 'Phoenix',
  },
}, {
  ID: 32,
  OrderNumber: 58292,
  OrderDate: '2014/05/13',
  SaleAmount: 13500,
  Terms: '15 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'Los Angeles',
  },
}, {
  ID: 36,
  OrderNumber: 62427,
  OrderDate: '2014/01/27',
  SaleAmount: 23500,
  Terms: '15 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Las Vegas',
  },
}, {
  ID: 39,
  OrderNumber: 65977,
  OrderDate: '2014/02/05',
  SaleAmount: 2550,
  Terms: '15 Days',
  Employee: 'Todd Hoffman',
  CustomerInfo: {
    StoreState: 'Wyoming',
    StoreCity: 'Casper',
  },
}, {
  ID: 40,
  OrderNumber: 66947,
  OrderDate: '2014/03/23',
  SaleAmount: 3500,
  Terms: '15 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Utah',
    StoreCity: 'Salt Lake City',
  },
}, {
  ID: 42,
  OrderNumber: 68428,
  OrderDate: '2014/04/10',
  SaleAmount: 10500,
  Terms: '15 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'Los Angeles',
  },
}, {
  ID: 43,
  OrderNumber: 69477,
  OrderDate: '2014/03/09',
  SaleAmount: 14200,
  Terms: '15 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'Anaheim',
  },
}, {
  ID: 46,
  OrderNumber: 72947,
  OrderDate: '2014/01/14',
  SaleAmount: 13350,
  Terms: '30 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Las Vegas',
  },
}, {
  ID: 47,
  OrderNumber: 73088,
  OrderDate: '2014/03/25',
  SaleAmount: 8600,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Reno',
  },
}, {
  ID: 50,
  OrderNumber: 76927,
  OrderDate: '2014/04/27',
  SaleAmount: 9800,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Utah',
    StoreCity: 'Salt Lake City',
  },
}, {
  ID: 51,
  OrderNumber: 77297,
  OrderDate: '2014/04/30',
  SaleAmount: 10850,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Arizona',
    StoreCity: 'Phoenix',
  },
}, {
  ID: 56,
  OrderNumber: 84744,
  OrderDate: '2014/02/10',
  SaleAmount: 4650,
  Terms: '30 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Las Vegas',
  },
}, {
  ID: 57,
  OrderNumber: 85028,
  OrderDate: '2014/05/17',
  SaleAmount: 2575,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Reno',
  },
}, {
  ID: 59,
  OrderNumber: 87297,
  OrderDate: '2014/04/21',
  SaleAmount: 14200,
  Terms: '30 Days',
  Employee: 'Todd Hoffman',
  CustomerInfo: {
    StoreState: 'Wyoming',
    StoreCity: 'Casper',
  },
}, {
  ID: 60,
  OrderNumber: 88027,
  OrderDate: '2014/02/14',
  SaleAmount: 13650,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Utah',
    StoreCity: 'Salt Lake City',
  },
}, {
  ID: 65,
  OrderNumber: 94726,
  OrderDate: '2014/05/22',
  SaleAmount: 20500,
  Terms: '15 Days',
  Employee: 'Jim Packard',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'San Jose',
  },
}, {
  ID: 66,
  OrderNumber: 95266,
  OrderDate: '2014/03/10',
  SaleAmount: 9050,
  Terms: '15 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Las Vegas',
  },
}, {
  ID: 69,
  OrderNumber: 98477,
  OrderDate: '2014/01/01',
  SaleAmount: 23500,
  Terms: '15 Days',
  Employee: 'Todd Hoffman',
  CustomerInfo: {
    StoreState: 'Wyoming',
    StoreCity: 'Casper',
  },
}, {
  ID: 70,
  OrderNumber: 99247,
  OrderDate: '2014/02/08',
  SaleAmount: 2100,
  Terms: '15 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Utah',
    StoreCity: 'Salt Lake City',
  },
}, {
  ID: 78,
  OrderNumber: 174884,
  OrderDate: '2014/04/10',
  SaleAmount: 7200,
  Terms: '30 Days',
  Employee: 'Todd Hoffman',
  CustomerInfo: {
    StoreState: 'Colorado',
    StoreCity: 'Denver',
  },
}, {
  ID: 81,
  OrderNumber: 188877,
  OrderDate: '2014/02/11',
  SaleAmount: 8750,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Arizona',
    StoreCity: 'Phoenix',
  },
}, {
  ID: 82,
  OrderNumber: 191883,
  OrderDate: '2014/02/05',
  SaleAmount: 9900,
  Terms: '30 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'Los Angeles',
  },
}, {
  ID: 83,
  OrderNumber: 192474,
  OrderDate: '2014/01/21',
  SaleAmount: 12800,
  Terms: '30 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'Anaheim',
  },
}, {
  ID: 84,
  OrderNumber: 193847,
  OrderDate: '2014/03/21',
  SaleAmount: 14100,
  Terms: '30 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'San Diego',
  },
}, {
  ID: 85,
  OrderNumber: 194877,
  OrderDate: '2014/03/06',
  SaleAmount: 4750,
  Terms: '30 Days',
  Employee: 'Jim Packard',
  CustomerInfo: {
    StoreState: 'California',
    StoreCity: 'San Jose',
  },
}, {
  ID: 86,
  OrderNumber: 195746,
  OrderDate: '2014/05/26',
  SaleAmount: 9050,
  Terms: '30 Days',
  Employee: 'Harv Mudd',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Las Vegas',
  },
}, {
  ID: 87,
  OrderNumber: 197474,
  OrderDate: '2014/03/02',
  SaleAmount: 6400,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Nevada',
    StoreCity: 'Reno',
  },
}, {
  ID: 88,
  OrderNumber: 198746,
  OrderDate: '2014/05/09',
  SaleAmount: 15700,
  Terms: '30 Days',
  Employee: 'Todd Hoffman',
  CustomerInfo: {
    StoreState: 'Colorado',
    StoreCity: 'Denver',
  },
}, {
  ID: 91,
  OrderNumber: 214222,
  OrderDate: '2014/02/08',
  SaleAmount: 11050,
  Terms: '30 Days',
  Employee: 'Clark Morgan',
  CustomerInfo: {
    StoreState: 'Arizona',
    StoreCity: 'Phoenix',
  },
}];

@Injectable()
export class Service {
  getOrders(): Order[] {
    return orders;
  }
}
