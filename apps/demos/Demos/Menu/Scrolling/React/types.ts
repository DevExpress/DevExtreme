interface ProductItemType {
  text: string;
}

export interface ProductType {
  text: string;
  items: (ProductType | ProductItemType)[];
}
