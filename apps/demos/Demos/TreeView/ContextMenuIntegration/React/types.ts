type ProductItem = {
  id: string;
  text: string;
  price: number;
  image: string;
};

export type Product = {
  id: string;
  text: string;
  expanded?: boolean;
  items: (Product | ProductItem)[];
};

export type MenuItem = {
  id: string;
  text: string;
};
