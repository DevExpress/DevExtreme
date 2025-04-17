export interface NavigationItem {
  focus: () => void;
  getElement: () => HTMLElement | null;
}
