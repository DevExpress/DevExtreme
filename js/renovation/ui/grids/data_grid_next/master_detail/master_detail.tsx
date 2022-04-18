/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component,
  JSXComponent,
  ComponentBindings,
  Effect,
  Fragment,
  Template,
  OneWay,
  TwoWay,
  Consumer,
  JSXTemplate,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext, createSelector } from '../../../../utils/plugin/context';

import {
  VisibleRows, VisibleColumns,
} from '../data_grid_next';
import {
  Row, Key, ColumnInternal, RowTemplateProps,
} from '../types';
import { GetterExtender } from '../../../../utils/plugin/getter_extender';

import { ExpandColumn } from './expand_column';
import { SetExpanded, IsExpanded, MasterDetailTemplate } from './plugins';
import { MasterDetailRow } from './master_detail_row';
import CLASSES from '../classes';

export const AddMasterDetailRows = createSelector(
  [VisibleRows, IsExpanded],
  (visibleRows: Row[], isExpanded): Row[] => {
    const result = visibleRows.slice();

    for (let i = 0; i < result.length; i += 1) {
      const item = result[i];

      if (isExpanded(item.key)) {
        result.splice(i + 1, 0, {
          ...item,
          rowType: 'detail',
          template: MasterDetailRow,
        });
        i += 1;
      } else if (item.rowType === 'detail') {
        result.splice(i, 1);
      }
    }

    return result;
  },
);

export const viewFunction = (): JSX.Element => (
  <Fragment>
    <GetterExtender type={VisibleRows} order={2} value={AddMasterDetailRows} />
  </Fragment>
);

@ComponentBindings()
export class DataGridNextMasterDetailProps {
  @OneWay()
  enabled = true;

  @TwoWay()
  expandedRowKeys: Key[] = [];

  @Template() template?: JSXTemplate<RowTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class DataGridNextMasterDetail extends JSXComponent<DataGridNextMasterDetailProps, 'template'>(DataGridNextMasterDetailProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @Effect()
  setMasterDetailTemplate(): void {
    this.plugins.set(MasterDetailTemplate, this.props.template);
  }

  @Effect()
  addVisibleColumnsHandler(): (() => void) | undefined {
    if (this.props.enabled) {
      return this.plugins.extend(VisibleColumns, 1, (columns) => {
        const expandColumn: ColumnInternal = {
          headerCssClass: `${CLASSES.commandExpand} ${CLASSES.groupSpace}`,
          cellContainerTemplate: ExpandColumn,
        };

        return [
          expandColumn,
          ...columns,
        ];
      });
    }
    return undefined;
  }

  @Effect()
  addPluginMethods(): void {
    this.plugins.set(SetExpanded, this.setExpanded);
    this.plugins.set(IsExpanded, this.isExpanded);
  }

  isExpanded(key: Key): boolean {
    return this.props.expandedRowKeys.includes(key);
  }

  setExpanded(key: Key, value: boolean): void {
    if (value) {
      this.props.expandedRowKeys = [
        ...this.props.expandedRowKeys,
        key,
      ];
    } else {
      this.props.expandedRowKeys = this.props.expandedRowKeys
        .filter((i) => i !== key);
    }
  }
}
