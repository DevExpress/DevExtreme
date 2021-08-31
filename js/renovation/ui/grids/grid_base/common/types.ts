// eslint-disable-next-line import/named
import { GridBase, Column } from '../../../../../ui/data_grid';

export interface GridBaseInstance
  <TRowData,
   TKey,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   TColumns extends (Column<TRowData, TKey, any> | string)[]
   =(Column<TRowData, TKey, any> | string)[],
  > extends GridBase<TRowData, TKey, TColumns> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getView: (name: string) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getController: (name: string) => any;
}

export interface GridBaseView {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _$element: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _$parent: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: () => any;
}
