import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';
import { ColCountByScreen, ScreenSize } from './types';
import { defaultScreenFactorFunc } from './form_utils';

@ComponentBindings()
export class FormProps {
  @OneWay() scrollingEnabled = false;

  @OneWay() useNativeScrolling?: boolean;

  @OneWay() colCount?: number = 1;

  @OneWay() alignItemLabels?: boolean = true;

  @OneWay() alignItemLabelsInAllGroups?: boolean = true;

  @OneWay() screenByWidth?: (width) => ScreenSize = defaultScreenFactorFunc;

  @OneWay() colCountByScreen?: ColCountByScreen = undefined;
}
