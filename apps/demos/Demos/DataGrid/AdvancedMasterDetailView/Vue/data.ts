export type Supplier = {
  SupplierID: number;

  CompanyName: string;

  ContactName: string;

  ContactTitle: string;

  Address: string;

  City: string;

  Region: string | null;

  PostalCode: string;

  Country: string;

  Phone: string;

  Fax: string | null;

  HomePage: string | null;
};

export type Product = {
  ProductID: number;

  ProductName: string

  SupplierID: number;

  CategoryID: number;

  QuantityPerUnit: string

  UnitPrice: number

  UnitsInStock: number

  UnitsOnOrder: number

  ReorderLevel: number

  Discontinued: boolean;
};

export type Order = {
  OrderID: number;

  OrderDate: Date;

  ShipCountry: string;

  ShipCity: string;

  UnitPrice: number;

  Quantity: number;

  Discount: number;
};
