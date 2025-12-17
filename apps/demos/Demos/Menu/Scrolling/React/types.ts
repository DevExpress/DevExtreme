interface ProductItem {
  text: string;
}

export interface Product {
  text: string;
  items: (Product | ProductItem)[];
}
