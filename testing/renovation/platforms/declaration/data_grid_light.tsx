/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect,
} from '@devextreme-generator/declarations';
import React from 'react';
import { DataGridLight, DataGridLightProps } from '../../../../js/renovation/ui/grids/data_grid_light/data_grid_light';

export const viewFunction = ({
  options,
}: App): JSX.Element => (
  <DataGridLight
    id="container"
    dataSource={options.dataSource}
    columns={options.columns}
    paging={options.paging}
    pager={options.pager}
  />
);
@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class App extends JSXComponent<AppProps>() {
  @InternalState() options: Partial<DataGridLightProps> = {
    columns: ['id', 'text'],
    dataSource: [
      { id: 1, text: 'text 1' },
      { id: 2, text: 'text 2' },
      { id: 3, text: 'text 3' },
      { id: 4, text: 'text 4' },
      { id: 5, text: 'text 5' },
    ],
    paging: {
      pageSize: 2,
      pageIndex: 0,
      enabled: true,
    },
    pager: {
      visible: true,
      allowedPageSizes: [2, 4, 'all'],
      showPageSizeSelector: true,
      displayMode: 'full',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  };

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as unknown as { onOptionsUpdated: (unknown) => void })
      .onOptionsUpdated = (newOptions) => {
        this.options = {
          ...this.options,
          ...newOptions,
        };
      };
  }
}
