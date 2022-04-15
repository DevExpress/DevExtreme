/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings,
  TwoWay, Consumer, Effect, OneWay, Method, Fragment,
} from '@devextreme-generator/declarations';
import type {
  Key, SelectAllMode, SelectionMode,
} from '../types';
import {
  Plugins, PluginsContext,
} from '../../../../utils/plugin/context';

import CLASSES from '../classes';

import { ValueSetter } from '../../../../utils/plugin/value_setter';
import { TemplateSetter } from '../../../../utils/plugin/template_setter';
import { GetterExtender } from '../../../../utils/plugin/getter_extender';

import { SelectionCheckbox } from './select_checkbox';
import { SelectAllCheckbox } from './select_all_checkbox';

import {
  VisibleColumns,
} from '../data_grid_next';

import {
  RowClassesGetter, RowPropertiesGetter,
} from '../widgets/row_base';
import { RowClick } from '../views/table_content';
import {
  ClearSelection, SelectAll,
  SelectedRowKeys, SetSelectedRowKeys,
  SelectionModeValue, AllowSelectAllValue, ToggleSelected, SelectAllModeValue,
  SelectionCheckboxTemplate,
  SelectAllCheckboxTemplate,
  AddSelectionColumnToVisibleColumns,
  AddSelectionToRowClasses,
  AddSelectionToRowProperties,
} from './plugins';

export const viewFunction = (viewModel: DataGridNextSelection): JSX.Element => (
  <Fragment>
    <ValueSetter type={SelectedRowKeys} value={viewModel.props.selectedRowKeys} />
    <ValueSetter type={SetSelectedRowKeys} value={viewModel.setSelectedRowKeys} />

    <ValueSetter type={SelectAllModeValue} value={viewModel.props.selectAllMode} />
    <ValueSetter type={SelectionModeValue} value={viewModel.props.mode} />
    <ValueSetter type={AllowSelectAllValue} value={viewModel.props.allowSelectAll} />
    <TemplateSetter
      type={SelectionCheckboxTemplate}
      template={({ data }): JSX.Element => <SelectionCheckbox data={data} />}
    />
    <TemplateSetter
      type={SelectAllCheckboxTemplate}
      template={SelectAllCheckbox}
    />
    <GetterExtender type={VisibleColumns} order={2} value={AddSelectionColumnToVisibleColumns} />
    <GetterExtender type={RowPropertiesGetter} order={1} value={AddSelectionToRowProperties} />
    <GetterExtender type={RowClassesGetter} order={1} value={AddSelectionToRowClasses} />
  </Fragment>
);

@ComponentBindings()
export class DataGridNextSelectionProps {
  @TwoWay()
  selectedRowKeys: Key[] = [];

  @OneWay()
  mode: SelectionMode = 'single';

  @OneWay()
  allowSelectAll = true;

  @OneWay()
  selectAllMode: SelectAllMode = 'allPages';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  angular: {
    innerComponent: false,
  },
})
export class DataGridNextSelection extends JSXComponent(DataGridNextSelectionProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @Effect()
  setRowClickEvent(): void {
    this.plugins.set(RowClick, (row, event) => {
      const isSelectCheckBox = Boolean((event.target as Element).closest(`.${CLASSES.selectCheckbox}`));
      if (!isSelectCheckBox) {
        this.plugins.callAction(ToggleSelected, row.data);
      }
    });
  }

  @Method()
  selectAll(): void {
    this.plugins.callAction(SelectAll);
  }

  @Method()
  clearSelection(): void {
    this.plugins.callAction(ClearSelection);
  }

  setSelectedRowKeys(keys: Key[]): void {
    this.props.selectedRowKeys = keys;
  }
}
