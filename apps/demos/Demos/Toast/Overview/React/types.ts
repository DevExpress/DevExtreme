import type { ToastTypes } from 'devextreme-react/toast';

export type Product = {
  ID: number;
  Name: string;
  Price: number;
  Current_Inventory: number;
  Backorder: number;
  Manufacturing: number;
  Category: string;
  ImageSrc: string;
};

export type ToastConfig = {
  isVisible: boolean;
  type: ToastTypes.ToastType;
  message: string;
};
