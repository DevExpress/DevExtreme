import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';
import { ScreenSizeQualifier } from './types';

@ComponentBindings()
export class ResponsiveBoxProps {
  @OneWay() screenByWidth?: (width) => ScreenSizeQualifier;
}
