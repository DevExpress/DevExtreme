import {
  JSXComponent, Component,
} from '@devextreme-generator/declarations';
import { GridBaseViewProps } from './common/grid_base_view_props';
import { GridBaseViewWrapper } from './grid_base_view_wrapper';

const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';

export const viewFunction = ({
  props: {
    views,
    className,
    role,
  },
}: GridBaseViews): JSX.Element => (
  <div className={`${className} ${GRIDBASE_CONTAINER_CLASS}`} role={role}>
    {(views.map(({ name, view }) => (<GridBaseViewWrapper key={name} view={view} />)))}
  </div>
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class GridBaseViews extends JSXComponent<GridBaseViewProps, 'views' | 'className'>() {
}
