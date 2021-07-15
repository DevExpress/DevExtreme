import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { ItemBase } from './item_base';
import { LabelProps } from './label_props';

@ComponentBindings()
export class SimpleItem extends ItemBase {
  @OneWay() dataField?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() editorOptions?: any;

  @OneWay() editorType?: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';

  @OneWay() helpText?: string;

  @OneWay() isRequired?: boolean;

  @OneWay() label?: LabelProps;

  // TODO: not working yet
  // template?: template;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() validationRules?: any[];
}
