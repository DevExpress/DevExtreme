/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings,
  OneWay, Effect, InternalState, Provider, Slot,
} from '@devextreme-generator/declarations';

import {
  createGetter, Plugins, PluginsContext, createPlaceholder,
} from '../../../utils/plugin/context';
import { Widget } from '../../common/widget';
import { BaseWidgetProps } from '../../common/base_props';

import type { RowData } from './types';

import { TableContent } from './views/table_content';
import { TableHeader } from './views/table_header';
import { Placeholder } from '../../../utils/plugin/placeholder';

export const FooterPlaceholder = createPlaceholder();

export const VisibleItems = createGetter<RowData[]>([]);

export const viewFunction = (viewModel: DataGridLight): JSX.Element => (
  <Widget // eslint-disable-line jsx-a11y/no-access-key
    accessKey={viewModel.props.accessKey}
    activeStateEnabled={viewModel.props.activeStateEnabled}
    aria={viewModel.aria}
    disabled={viewModel.props.disabled}
    focusStateEnabled={viewModel.props.focusStateEnabled}
    height={viewModel.props.height}
    hint={viewModel.props.hint}
    hoverStateEnabled={viewModel.props.hoverStateEnabled}
    rtlEnabled={viewModel.props.rtlEnabled}
    tabIndex={viewModel.props.tabIndex}
    visible={viewModel.props.visible}
    width={viewModel.props.width}
    {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  >
    <div className="dx-datagrid dx-gridbase-container" role="grid" aria-label="Data grid">
      <TableHeader columns={viewModel.props.columns} />
      <TableContent columns={viewModel.props.columns} dataSource={viewModel.visibleItems} />
      <Placeholder type={FooterPlaceholder} />
      { viewModel.props.children }
    </div>
  </Widget>
);

@ComponentBindings()
export class DataGridLightProps extends BaseWidgetProps {
  @OneWay()
  dataSource: RowData[] = [];

  @OneWay()
  columns: string[] = [];

  @Slot()
  children?: JSX.Element | JSX.Element[];
}

const aria = {
  role: 'presentation',
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export class DataGridLight extends JSXComponent(DataGridLightProps) {
  // eslint-disable-next-line class-methods-use-this
  get aria(): Record<string, string> {
    return aria;
  }

  @Provider(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  visibleItems: RowData[] = [];

  @Effect()
  updateVisibleItems(): () => void {
    return this.plugins.watch(VisibleItems, (items) => {
      this.visibleItems = items;
    });
  }

  @Effect()
  setDataSourceToVisibleItems(): () => void {
    return this.plugins.extend(
      VisibleItems, -1, () => this.props.dataSource,
    );
  }
}
