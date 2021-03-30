import {
  JSXComponent, Component,
} from 'devextreme-generator/component_declaration/common';
import { GridBaseViews } from '../grid_base/grid_base_views';
import { GridBaseView } from '../grid_base/common/types';
import { DataGridViewProps } from './common/data_grid_view_props';
import { gridViewModule } from '../../../../ui/grid_core/ui.grid_core.grid_view';

const { VIEW_NAMES } = gridViewModule;

const DATA_GRID_CLASS = 'dx-datagrid';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  views,
}: DataGridViews) => (
  <GridBaseViews views={views} className={DATA_GRID_CLASS} />
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class DataGridViews extends JSXComponent<DataGridViewProps, 'instance'>() {
  get views(): { name: string; view: GridBaseView }[] {
    const views = VIEW_NAMES.map(
      (viewName) => this.props.instance?.getView(viewName) as GridBaseView,
    ).filter((view) => view);

    return views.map((view) => ({
      name: view.name,
      view,
    }));
  }
}
