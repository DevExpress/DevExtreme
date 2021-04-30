import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';
import { ScreenSizeQualifier } from './types';
import { convertToScreenSizeQualifier } from './screen_utils';

@ComponentBindings()
export class ResponsiveBoxProps {
  @OneWay() screenByWidth: (width) => ScreenSizeQualifier = convertToScreenSizeQualifier;
}
