export interface ProductItem {
  id: string,
  name: string,
  price: number,
  icon: string,
  disabled?: boolean,
}

export interface Product {
  id: string,
  name: string,
  items: (Product | ProductItem)[],
}
