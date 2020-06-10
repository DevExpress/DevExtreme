const orders = [{
  'ID': 1,
  'OrderNumber': 35703,
  'OrderDate': '2017/04/10',
  'DeliveryDate': '2017/04/13 9:00',
  'SaleAmount': 11800,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Los Angeles, CA',
  'Employee': 'Harv Mudd'
}, {
  'ID': 4,
  'OrderNumber': 35711,
  'OrderDate': '2017/01/12',
  'DeliveryDate': '2017/01/13 9:00',
  'SaleAmount': 16050,
  'Terms': '15 Days',
  'CustomerStoreCity': 'San Jose, CA',
  'Employee': 'Jim Packard'
}, {
  'ID': 5,
  'OrderNumber': 35714,
  'OrderDate': '2017/01/22',
  'DeliveryDate': '2017/01/27 9:00',
  'SaleAmount': 14750,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Las Vegas, NV',
  'Employee': 'Harv Mudd'
}, {
  'ID': 7,
  'OrderNumber': 35983,
  'OrderDate': '2017/02/07',
  'DeliveryDate': '2017/02/10 13:00',
  'SaleAmount': 3725,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Denver, CO',
  'Employee': 'Todd Hoffman'
}, {
  'ID': 11,
  'OrderNumber': 38466,
  'OrderDate': '2017/03/01',
  'DeliveryDate': '2017/03/03 17:45',
  'SaleAmount': 7800,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Los Angeles, CA',
  'Employee': 'Harv Mudd'
}, {
  'ID': 14,
  'OrderNumber': 39420,
  'OrderDate': '2017/02/15',
  'DeliveryDate': '2017/02/17 11:45',
  'SaleAmount': 20500,
  'Terms': '15 Days',
  'CustomerStoreCity': 'San Jose, CA',
  'Employee': 'Jim Packard'
}, {
  'ID': 15,
  'OrderNumber': 39874,
  'OrderDate': '2017/02/04',
  'DeliveryDate': '2017/02/10 15:00',
  'SaleAmount': 9050,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Las Vegas, NV',
  'Employee': 'Harv Mudd'
}, {
  'ID': 18,
  'OrderNumber': 42847,
  'OrderDate': '2017/02/15',
  'DeliveryDate': '2017/02/17 8:30',
  'SaleAmount': 20400,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Casper, WY',
  'Employee': 'Todd Hoffman'
}, {
  'ID': 30,
  'OrderNumber': 57429,
  'OrderDate': '2017/05/16',
  'DeliveryDate': '2017/05/19 11:45',
  'SaleAmount': 11050,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Phoenix, AZ',
  'Employee': 'Clark Morgan'
}, {
  'ID': 32,
  'OrderNumber': 58292,
  'OrderDate': '2017/05/13',
  'DeliveryDate': '2017/05/19 14:30',
  'SaleAmount': 13500,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Los Angeles, CA',
  'Employee': 'Harv Mudd'
}, {
  'ID': 36,
  'OrderNumber': 62427,
  'OrderDate': '2017/01/27',
  'DeliveryDate': '2017/02/03 18:00',
  'SaleAmount': 23500,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Las Vegas, NV',
  'Employee': 'Harv Mudd'
}, {
  'ID': 39,
  'OrderNumber': 65977,
  'OrderDate': '2017/02/05',
  'DeliveryDate': '2017/02/10 13:15',
  'SaleAmount': 2550,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Casper, WY',
  'Employee': 'Todd Hoffman'
}, {
  'ID': 42,
  'OrderNumber': 68428,
  'OrderDate': '2017/04/10',
  'DeliveryDate': '2017/04/14 11:30',
  'SaleAmount': 10500,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Los Angeles, CA',
  'Employee': 'Harv Mudd'
}, {
  'ID': 43,
  'OrderNumber': 69477,
  'OrderDate': '2017/03/09',
  'DeliveryDate': '2017/03/10 12:00',
  'SaleAmount': 14200,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Anaheim, CA',
  'Employee': 'Harv Mudd'
}, {
  'ID': 46,
  'OrderNumber': 72947,
  'OrderDate': '2017/01/14',
  'DeliveryDate': '2017/01/20 9:00',
  'SaleAmount': 13350,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Las Vegas, NV',
  'Employee': 'Harv Mudd'
}, {
  'ID': 47,
  'OrderNumber': 73088,
  'OrderDate': '2017/03/25',
  'DeliveryDate': '2017/03/31 17:15',
  'SaleAmount': 8600,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Reno, NV',
  'Employee': 'Clark Morgan'
}, {
  'ID': 51,
  'OrderNumber': 77297,
  'OrderDate': '2017/04/30',
  'DeliveryDate': '2017/05/05 18:00',
  'SaleAmount': 10850,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Phoenix, AZ',
  'Employee': 'Clark Morgan'
}, {
  'ID': 56,
  'OrderNumber': 84744,
  'OrderDate': '2017/02/10',
  'DeliveryDate': '2017/02/17 14:00',
  'SaleAmount': 4650,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Las Vegas, NV',
  'Employee': 'Harv Mudd'
}, {
  'ID': 57,
  'OrderNumber': 85028,
  'OrderDate': '2017/05/17',
  'DeliveryDate': '2017/05/19 12:00',
  'SaleAmount': 2575,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Reno, NV',
  'Employee': 'Clark Morgan'
}, {
  'ID': 59,
  'OrderNumber': 87297,
  'OrderDate': '2017/04/21',
  'DeliveryDate': '2017/04/28 9:00',
  'SaleAmount': 14200,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Casper, WY',
  'Employee': 'Todd Hoffman'
}, {
  'ID': 65,
  'OrderNumber': 94726,
  'OrderDate': '2017/05/22',
  'DeliveryDate': '2017/05/26 13:30',
  'SaleAmount': 20500,
  'Terms': '15 Days',
  'CustomerStoreCity': 'San Jose, CA',
  'Employee': 'Jim Packard'
}, {
  'ID': 66,
  'OrderNumber': 95266,
  'OrderDate': '2017/03/10',
  'DeliveryDate': '2017/03/17 11:45',
  'SaleAmount': 9050,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Las Vegas, NV',
  'Employee': 'Harv Mudd'
}, {
  'ID': 69,
  'OrderNumber': 98477,
  'OrderDate': '2017/01/01',
  'DeliveryDate': '2017/01/06 9:00',
  'SaleAmount': 23500,
  'Terms': '15 Days',
  'CustomerStoreCity': 'Casper, WY',
  'Employee': 'Todd Hoffman'
}, {
  'ID': 78,
  'OrderNumber': 174884,
  'OrderDate': '2017/04/10',
  'DeliveryDate': '2017/04/14 8:30',
  'SaleAmount': 7200,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Denver, CO',
  'Employee': 'Todd Hoffman'
}, {
  'ID': 81,
  'OrderNumber': 188877,
  'OrderDate': '2017/02/11',
  'DeliveryDate': '2017/02/17 16:00',
  'SaleAmount': 8750,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Phoenix, AZ',
  'Employee': 'Clark Morgan'
}, {
  'ID': 82,
  'OrderNumber': 191883,
  'OrderDate': '2017/02/05',
  'DeliveryDate': '2017/02/10 18:30',
  'SaleAmount': 9900,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Los Angeles, CA',
  'Employee': 'Harv Mudd'
}, {
  'ID': 83,
  'OrderNumber': 192474,
  'OrderDate': '2017/01/21',
  'DeliveryDate': '2017/01/27 12:45',
  'SaleAmount': 12800,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Anaheim, CA',
  'Employee': 'Harv Mudd'
}, {
  'ID': 84,
  'OrderNumber': 193847,
  'OrderDate': '2017/03/21',
  'DeliveryDate': '2017/03/24 9:00',
  'SaleAmount': 14100,
  'Terms': '30 Days',
  'CustomerStoreCity': 'San Diego, CA',
  'Employee': 'Harv Mudd'
}, {
  'ID': 85,
  'OrderNumber': 194877,
  'OrderDate': '2017/03/06',
  'DeliveryDate': '2017/03/10 18:15',
  'SaleAmount': 4750,
  'Terms': '30 Days',
  'CustomerStoreCity': 'San Jose, CA',
  'Employee': 'Jim Packard'
}, {
  'ID': 86,
  'OrderNumber': 195746,
  'OrderDate': '2017/05/26',
  'DeliveryDate': '2017/06/02 17:00',
  'SaleAmount': 9050,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Las Vegas, NV',
  'Employee': 'Harv Mudd'
}, {
  'ID': 87,
  'OrderNumber': 197474,
  'OrderDate': '2017/03/02',
  'DeliveryDate': '2017/03/03 11:00',
  'SaleAmount': 6400,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Reno, NV',
  'Employee': 'Clark Morgan'
}, {
  'ID': 88,
  'OrderNumber': 198746,
  'OrderDate': '2017/05/09',
  'DeliveryDate': '2017/05/12 15:45',
  'SaleAmount': 15700,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Denver, CO',
  'Employee': 'Todd Hoffman'
}, {
  'ID': 91,
  'OrderNumber': 214222,
  'OrderDate': '2017/02/08',
  'DeliveryDate': '2017/02/10 9:45',
  'SaleAmount': 11050,
  'Terms': '30 Days',
  'CustomerStoreCity': 'Phoenix, AZ',
  'Employee': 'Clark Morgan'
}];

export default {
  getOrders() {
    return orders;
  }
};
