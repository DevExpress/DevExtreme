export type Product = {
  ID: number;
  Name: string;
  Price: number;
  Current_Inventory: number | null;
  Backorder: number;
  Manufacturing: number;
  Category: string;
  ImageSrc: string;
};
