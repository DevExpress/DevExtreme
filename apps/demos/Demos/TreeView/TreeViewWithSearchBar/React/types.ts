export interface Product {
  id: string;
  text: string;
  expanded?: boolean;
  items?: Product[];
  price?: number;
}
