import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';
import { ColCountByScreen, ScreenSize } from './types';

@ComponentBindings()
export class FormLayoutManagerProps {
  @OneWay() isRoot = false;

  @OneWay() colCount?: number = 1;

  @OneWay() alignItemLabels?: boolean = true;

  @OneWay() screenByWidth?: (width) => ScreenSize;

  @OneWay() colCountByScreen?: ColCountByScreen = undefined;
}
