export interface ProductItemType {
  id: string,
  name: string,
  price: number,
  icon: string,
  disabled?: boolean,
}

export interface ProductType {
  id: string,
  name: string,
  items: (ProductType | ProductItemType)[],
}
