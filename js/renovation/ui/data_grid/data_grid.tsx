import {
  Ref, Effect, Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import DxDataGrid from '../../../ui/data_grid';

import { DataGridProps } from './props';

export const viewFunction = ({ widgetRef, props: { className }, restAttributes }: DataGrid) => (
  <div
    ref={widgetRef as any}
    className={className}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  // jQuery: { register: true },
  view: viewFunction,
})
export class DataGrid extends JSXComponent(DataGridProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  updateWidget(): void {
    const widget = DxDataGrid.getInstance(this.widgetRef);
    widget?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget(): () => void {
    const widget = new DxDataGrid(this.widgetRef, this.properties);

    return (): void => {
      widget.dispose();
    };
  }

  get properties(): any /* Options */ {
    return this.props;
  }
}
