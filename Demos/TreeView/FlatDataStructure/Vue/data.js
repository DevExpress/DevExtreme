const products = [{
  ID: '1',
  name: 'Stores',
  expanded: true
}, {
  ID: '1_1',
  categoryId: '1',
  name: 'Super Mart of the West',
  expanded: true
}, {
  ID: '1_1_1',
  categoryId: '1_1',
  name: 'Video Players'
}, {
  ID: '1_1_1_1',
  categoryId: '1_1_1',
  name: 'HD Video Player',
  icon: '../../../../images/products/1.png',
  price: 220
}, {
  ID: '1_1_1_2',
  categoryId: '1_1_1',
  name: 'SuperHD Video Player',
  icon: '../../../../images/products/2.png',
  price: 270
}, {
  ID: '1_1_2',
  categoryId: '1_1',
  name: 'Televisions',
  expanded: true
}, {
  ID: '1_1_2_1',
  categoryId: '1_1_2',
  name: 'SuperLCD 42',
  icon: '../../../../images/products/7.png',
  price: 1200
}, {
  ID: '1_1_2_2',
  categoryId: '1_1_2',
  name: 'SuperLED 42',
  icon: '../../../../images/products/5.png',
  price: 1450
}, {
  ID: '1_1_2_3',
  categoryId: '1_1_2',
  name: 'SuperLED 50',
  icon: '../../../../images/products/4.png',
  price: 1600
}, {
  ID: '1_1_2_4',
  categoryId: '1_1_2',
  name: 'SuperLCD 55',
  icon: '../../../../images/products/6.png',
  price: 1750
}, {
  ID: '1_1_2_5',
  categoryId: '1_1_2',
  name: 'SuperLCD 70',
  icon: '../../../../images/products/9.png',
  price: 4000
}, {
  ID: '1_1_3',
  categoryId: '1_1',
  name: 'Monitors'
}, {
  ID: '1_1_3_1',
  categoryId: '1_1_3',
  name: '19"',
}, {
  ID: '1_1_3_1_1',
  categoryId: '1_1_3_1',
  name: 'DesktopLCD 19',
  icon: '../../../../images/products/10.png',
  price: 160
}, {
  ID: '1_1_4',
  categoryId: '1_1',
  name: 'Projectors'
}, {
  ID: '1_1_4_1',
  categoryId: '1_1_4',
  name: 'Projector Plus',
  icon: '../../../../images/products/14.png',
  price: 550
}, {
  ID: '1_1_4_2',
  categoryId: '1_1_4',
  name: 'Projector PlusHD',
  icon: '../../../../images/products/15.png',
  price: 750
}
];

export default {
  getProducts() {
    return products;
  }
};
