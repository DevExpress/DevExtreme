import {
  JSXComponent, Component, Mutable,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../utils/combine_classes';
import { GridBaseViewProps } from './common/grid_base_view_props';
import { GridBaseViewWrapper } from './grid_base_view_wrapper';
import { DataGridProps } from '../data_grid/common/data_grid_props';

const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';
const BORDERS_CLASS = 'borders';

export const viewFunction = ({
  props: {
    views,
    role,
  },
  className,
  viewRendered,
}: GridBaseViews): JSX.Element => (
  <div className={className} role={role}>
    {(views.map(({ name, view }) => (
      <GridBaseViewWrapper
        key={name}
        view={view}
        onRendered={viewRendered}
      />
    )))}
  </div>
);

type GridBaseViewPropsType = Pick<DataGridProps, 'showBorders'> & GridBaseViewProps;

@Component({ defaultOptionRules: null, view: viewFunction })
export class GridBaseViews extends JSXComponent<GridBaseViewPropsType, 'views' | 'className' | 'role'>() {
  get className(): string | undefined {
    const { showBorders } = this.props;

    return combineClasses({
      [GRIDBASE_CONTAINER_CLASS]: true,
      [`${this.props.className}`]: !!this.props.className,
      [`${this.props.className}-${BORDERS_CLASS}`]: !!showBorders,
    });
  }

  @Mutable() viewRenderedCount = 0;

  viewRendered(): void {
    this.viewRenderedCount += 1;

    if (this.viewRenderedCount === this.props.views.length) {
      this.props.onRendered?.();
    }
  }
}
