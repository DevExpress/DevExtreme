import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';
import { GridInstance } from './types';
import { Column } from '../../../../../ui/data_grid';

@ComponentBindings()
export class DataGridViewProps
  <TRowData,
   TKeyExpr extends string | string[],
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   TKey=TKeyExpr extends keyof TRowData ? TRowData[TKeyExpr] : any,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   TColumns extends (Column<TRowData, TKey, any> | string)[]=(Column<TRowData, TKey, any> | string)[],
  > {
  @OneWay() instance!: GridInstance<TRowData, TKeyExpr, TKey, TColumns>;
}
