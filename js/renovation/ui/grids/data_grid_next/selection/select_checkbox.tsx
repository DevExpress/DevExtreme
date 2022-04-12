import {
  Component, JSXComponent, ComponentBindings, OneWay,
  Effect, InternalState, Consumer,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';

import CLASSES from '../classes';

import { CheckBox } from '../../../editors/check_box/check_box';
import { RowData } from '../types';
import { IsSelected, SetSelected } from './plugins';

export const viewFunction = (viewModel: SelectionCheckbox): JSX.Element => (
  <CheckBox
    className={`${CLASSES.selectCheckbox} ${CLASSES.checkboxSize}`}
    value={viewModel.isSelected}
    valueChange={viewModel.setSelected}
  />
);

@ComponentBindings()
export class SelectionCheckboxProps {
  @OneWay()
  data!: RowData;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class SelectionCheckbox extends JSXComponent<SelectionCheckboxProps, 'data'>(SelectionCheckboxProps) {
  @Consumer(PluginsContext)
  plugins: Plugins = new Plugins();

  @InternalState()
  isSelected = false;

  @Effect()
  updateIsSelected(): () => void {
    return this.plugins.watch(IsSelected, (isSelected) => {
      const newSelected = isSelected(this.props.data);
      this.isSelected = newSelected;
    });
  }

  setSelected(isSelected: boolean): void {
    this.plugins.callAction(SetSelected, this.props.data, isSelected);
  }
}
