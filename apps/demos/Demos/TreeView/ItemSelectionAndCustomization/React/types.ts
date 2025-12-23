export type Employee = {
  id: number;
  fullName: string;
  prefix: string;
  position: string;
  expanded?: boolean;
  selected?: boolean;
  items?: Employee[];
};
