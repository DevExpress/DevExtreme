import {
  JSXComponent, Component,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../utils/combine_classes';
import { GridBaseViewProps } from './common/grid_base_view_props';
import { GridBaseViewWrapper } from './grid_base_view_wrapper';

const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';
const BORDERS_CLASS = 'borders';

export const viewFunction = ({
  props: {
    views,
    role,
  },
  className,
}: GridBaseViews): JSX.Element => (
  <div className={className} role={role}>
    {(views.map(({ name, view }) => (<GridBaseViewWrapper key={name} view={view} />)))}
  </div>
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class GridBaseViews extends JSXComponent<GridBaseViewProps, 'views' | 'className'>() {
  get className(): string | undefined {
    return combineClasses({
      [GRIDBASE_CONTAINER_CLASS]: true,
      [`${this.props.className}`]: !!this.props.className,
      [`${this.props.className}-${BORDERS_CLASS}`]: this.props.showBorders,
    });
  }
}
