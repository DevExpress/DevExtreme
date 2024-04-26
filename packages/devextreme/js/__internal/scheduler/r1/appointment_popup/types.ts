export interface IToolbarButtonConfig {
  shortcut: string;
  location: string;
  options?: { text: string };
  onClick?: (e: { cancel: boolean }) => void;
}

export interface IAppointmentPopupSize {
  fullScreen: boolean;
  maxWidth: number | string;
}
