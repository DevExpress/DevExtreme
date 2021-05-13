import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';
import { ScreenSizeQualifier } from '../responsive_box/types';
import { convertToScreenSizeQualifier } from '../responsive_box/screen_utils';

@ComponentBindings()
export class FormProps {
  @OneWay() scrollingEnabled = false;

  @OneWay() useNativeScrolling?: boolean;

  @OneWay() screenByWidth?: (width) => ScreenSizeQualifier = convertToScreenSizeQualifier;
}
