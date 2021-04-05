// eslint-disable-next-line import/named
import { GridBase } from '../../../../../ui/data_grid';

export interface GridBaseInstance extends GridBase {
  getView: (name: string) => any;
  getController: (name: string) => any;
}

export interface GridBaseView {
  name: string;
  _$element: any;
  render: () => any;
}
