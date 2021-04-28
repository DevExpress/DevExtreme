import { ComponentBindings, Event, OneWay } from '@devextreme-generator/declarations';
import {
  ColCountByScreen,
  OnFieldDataChangedCallback,
  LabelLocation,
  ScreenSize,
  OnCustomizeItemCallback, OnEditorEnterKeyCallback, FormItem, StylingMode,
} from './types';
import { defaultScreenFactorFunc } from './form_utils';

@ComponentBindings()
export class FormProps {
  @OneWay() scrollingEnabled = false;

  @OneWay() useNativeScrolling?: boolean;

  @OneWay() formData: any = {};

  @OneWay() colCount?: number = 1;

  @OneWay() screenByWidth?: (width) => ScreenSize = defaultScreenFactorFunc;

  @OneWay() colCountByScreen?: ColCountByScreen = undefined;

  @OneWay() labelLocation: LabelLocation = 'left';

  @OneWay() readOnly = false;

  @Event() onFieldDataChanged?: OnFieldDataChangedCallback = null;

  @Event() customizeItem?: OnCustomizeItemCallback = null;

  @Event() onEditorEnterKey?: OnEditorEnterKeyCallback = null;

  @OneWay() minColWidth = 200;

  @OneWay() alignItemLabels?: boolean = true;

  @OneWay() alignItemLabelsInAllGroups?: boolean = true;

  @OneWay() alignRootItemLabels = true;

  @OneWay() showColonAfterLabel = true;

  @OneWay() showRequiredMark = true;

  @OneWay() showOptionalMark = false;

  @OneWay() requiredMark = '*';

  @OneWay() optionalMark?: string = undefined;

  @OneWay() requiredMessage?: () => string = undefined;

  @OneWay() showValidationSummary = true;

  @OneWay() items?: FormItem[] = undefined;

  @OneWay() validationGroup?: string = undefined;

  @OneWay() stylingMode?: StylingMode = undefined;
}
