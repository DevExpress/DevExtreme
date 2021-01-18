import {
  JSXComponent, Component,
} from 'devextreme-generator/component_declaration/common';
import { DataGridView } from './common/types';
import { DataGridViewProps } from './common/data_grid_view_props';
import { DataGridViewWrapper } from './data_grid_view_wrapper';
import { VIEW_NAMES } from '../../../ui/grid_core/ui.grid_core.grid_view';

const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  views,
}: DataGridViews) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div className={`dx-datagrid ${GRIDBASE_CONTAINER_CLASS}`}>
    {(views.map(({ name, view }) => (<DataGridViewWrapper key={name} view={view} />)))}
  </div>
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class DataGridViews extends JSXComponent<DataGridViewProps, 'gridInstance'>() {
  get views(): {name: string; view: DataGridView}[] {
    const result: {name: string; view: DataGridView}[] = [];

    VIEW_NAMES.forEach((viewName) => {
      const view = this.props.gridInstance?.getView(viewName) as DataGridView;

      if (view) {
        result.push({
          name: viewName,
          view,
        });
      }
    });

    return result;
  }
}
