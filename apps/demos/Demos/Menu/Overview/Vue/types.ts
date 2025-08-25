export interface ProductType {
  id: string,
  name: string,
  price?: number,
  icon?: string,
  disabled?: boolean,
  items?: ProductType[],
}
