import { Vehicle } from "./data";

export interface VehicleImageLicenseProps {
  vehicle: Vehicle;
}

export interface VehicleCardProps extends VehicleImageLicenseProps {
  onShowInfo: (vehicle: Vehicle) => void;
}