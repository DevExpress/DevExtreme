import { Vehicle } from './data';

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
