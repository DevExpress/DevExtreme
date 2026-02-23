export interface Vehicle {
  ID: number;
  TrademarkName: string;
  TrademarkID: number;
  Name: string;
  Modification: string;
  CategoryID: number;
  CategoryName: string;
  Price: number;
  MPGCity: number;
  MPGHighway: number;
  Doors: number;
  BodyStyleID: number;
  BodyStyleName: string;
  Cylinders: number;
  Horsepower: string;
  Torque: string;
  TransmissionSpeeds: number;
  TransmissionType: number;
  Description: string;
  DeliveryDate: boolean;
  InStock: boolean;
  Edits: string;
  LicenseName: string;
  Author: string;
  Source: string;
}

export interface VehicleImageLicenseProps {
  vehicle: Vehicle;
}

export interface VehicleCardProps extends VehicleImageLicenseProps {
  id: number;
  model: string;
  price: string;
  categoryName: string;
  modification: string;
  bodyStyleName: string;
  horsepower: string;
  onShowInfo: (vehicle: Vehicle) => void;
}
