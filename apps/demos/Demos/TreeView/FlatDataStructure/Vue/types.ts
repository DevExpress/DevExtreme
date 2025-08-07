export interface Product {
  ID: string;
  name: string;
  expanded?: boolean;
  categoryId?: string;
  icon?: string;
  price?: number;
}
