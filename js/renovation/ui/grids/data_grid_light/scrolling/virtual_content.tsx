import {
  Component, JSXComponent, ComponentBindings,
  Fragment, InternalState, Consumer, Effect,
} from '@devextreme-generator/declarations';
import {
  Plugins, PluginsContext,
} from '../../../../utils/plugin/context';
import { PlaceholderExtender } from '../../../../utils/plugin/placeholder_extender';
import { TopRowPlaceholder, BottomRowPlaceholder } from '../views/table_content';
import { ViewportParamsValue, ROW_HEIGHT } from './plugins';
import { VirtualRow } from './virtual_row';
import { ViewportParamsProps } from '../types';
import {
  VisibleColumns, TotalCount,
} from '../data_grid_light';

export const viewFunction = ({
  topHeight, bottomHeight, columnCount,
}: VirtualContent): JSX.Element => (
  <Fragment>
    { topHeight > 0 && (
      <PlaceholderExtender
        type={TopRowPlaceholder}
        order={1}
        template={(): JSX.Element => (
          <VirtualRow
            height={topHeight}
            columnCount={columnCount}
            rowKey={-1}
          />
        )}
      />
    )}
    { bottomHeight > 0 && (
      <PlaceholderExtender
        type={BottomRowPlaceholder}
        order={1}
        template={(): JSX.Element => (
          <VirtualRow
            height={bottomHeight}
            columnCount={columnCount}
            rowKey={-2}
          />
        )}
      />
    )}
  </Fragment>
);

/* eslint-disable @typescript-eslint/no-extraneous-class */
@ComponentBindings()
export class VirtualContentProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualContent extends JSXComponent(VirtualContentProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  topHeight = 0;

  @InternalState()
  bottomHeight = 0;

  @InternalState()
  columnCount = 0;

  @Effect()
  watchVisibleColumns(): () => void {
    return this.plugins.watch(VisibleColumns, (visibleColumns) => {
      this.columnCount = visibleColumns.length;
    });
  }

  @Effect()
  watchViewportParams(): () => void {
    return this.plugins.watch(ViewportParamsValue, (viewportParams) => {
      this.updateContent(viewportParams);
    });
  }

  updateContent(viewportParams: ViewportParamsProps): void {
    const { skip = 0, take = 0 } = viewportParams ?? {};
    const totalCount = this.plugins.getValue(TotalCount) ?? 0;

    this.topHeight = skip * ROW_HEIGHT;
    this.bottomHeight = (totalCount - skip - take) * ROW_HEIGHT;
  }
}
