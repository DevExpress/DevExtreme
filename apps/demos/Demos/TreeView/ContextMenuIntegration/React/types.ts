interface ProductItem {
  id: string;
  text: string;
  price: number;
  image: string;
}

export interface Product {
  id: string;
  text: string;
  expanded?: boolean;
  items: (Product | ProductItem)[];
}
