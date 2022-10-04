// eslint-disable-next-line import/named
import { GridBase } from '../../../../../common/grids';

export interface GridBaseInstance extends GridBase {
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
