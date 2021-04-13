import {
  JSXComponent, Component, Effect,
} from '@devextreme-generator/declarations';
import { GridBaseViews } from '../grid_base/grid_base_views';
import { GridBaseView } from '../grid_base/common/types';
import { DataGridViewProps } from './common/data_grid_view_props';
import { gridViewModule } from '../../../../ui/grid_core/ui.grid_core.grid_view';

const { VIEW_NAMES } = gridViewModule;

const DATA_GRID_CLASS = 'dx-datagrid';

const DATA_GRID_ROLE_NAME = 'grid';

export const viewFunction = ({
  views,
}: DataGridViews): JSX.Element => (
  <GridBaseViews views={views} className={DATA_GRID_CLASS} role={DATA_GRID_ROLE_NAME} />
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class DataGridViews extends JSXComponent<DataGridViewProps, 'instance'>() {
  get views(): { name: string; view: GridBaseView }[] {
    if (!this.props.instance) {
      return [];
    }

    const views = VIEW_NAMES.map(
      (viewName) => this.props.instance.getView(viewName) as GridBaseView,
    ).filter((view) => view);

    return views.map((view) => ({
      name: view.name,
      view,
    }));
  }

  @Effect()
  update(): void {
    const gridInstance = this.props.instance;

    if (!gridInstance) {
      return;
    }

    const dataController = gridInstance.getController('data');
    const resizingController = gridInstance.getController('resizing');

    resizingController.resize();
    if (dataController.isLoaded()) {
      resizingController.fireContentReadyAction();
    }
  }
}
