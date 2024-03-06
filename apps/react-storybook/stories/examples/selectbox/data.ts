const simpleProducts = [
  'HD Video Player',
  'SuperHD Video Player',
  'SuperPlasma 50',
  'SuperLED 50',
  'SuperLED 42',
  'SuperLCD 55',
  'SuperLCD 42',
  'SuperPlasma 65',
  'SuperLCD 70',
  'Projector Plus',
  'Projector PlusHT',
  'ExcelRemote IR',
  'ExcelRemote BT',
  'ExcelRemote IP',
];

const products = [{
  ID: 1,
  Name: 'HD Video Player',
  Price: 330,
  Current_Inventory: 225,
  Backorder: 0,
  Manufacturing: 10,
  Category: 'Video Players',
  ImageSrc: 'images/products/1-small.png',
}, {
  ID: 2,
  Name: 'SuperHD Player',
  Price: 400,
  Current_Inventory: 150,
  Backorder: 0,
  Manufacturing: 25,
  Category: 'Video Players',
  ImageSrc: 'images/products/2-small.png',
}, {
  ID: 3,
  Name: 'SuperPlasma 50',
  Price: 2400,
  Current_Inventory: 0,
  Backorder: 0,
  Manufacturing: 0,
  Category: 'Televisions',
  ImageSrc: 'images/products/3-small.png',
}, {
  ID: 4,
  Name: 'SuperLED 50',
  Price: 1600,
  Current_Inventory: 77,
  Backorder: 0,
  Manufacturing: 55,
  Category: 'Televisions',
  ImageSrc: 'images/products/4-small.png',
}, {
  ID: 5,
  Name: 'SuperLED 42',
  Price: 1450,
  Current_Inventory: 445,
  Backorder: 0,
  Manufacturing: 0,
  Category: 'Televisions',
  ImageSrc: 'images/products/5-small.png',
}];

export default {
  getSimpleProducts() {
    return simpleProducts;
  },
  getProducts() {
    return products;
  },
};
