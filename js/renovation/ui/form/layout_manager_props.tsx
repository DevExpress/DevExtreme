import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';
import { ScreenSizeQualifier } from '../responsive_box/types';

@ComponentBindings()
export class LayoutManagerProps {
  @OneWay() screenByWidth?: (width) => ScreenSizeQualifier;
}
