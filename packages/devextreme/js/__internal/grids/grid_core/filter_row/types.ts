import type { Column } from '@ts/grids/grid_core/columns_controller/types';

export type FilterRowEditorOptions = Omit<Column, 'width'> & {
  value: unknown;
  parentType: 'filterRow';
  showAllText?: string;
  updateValueTimeout: number;
  width: null;
  setValue: (value: unknown, notFireEvent?: boolean) => void;
  placeholder?: string;
};
