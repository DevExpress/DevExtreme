import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { Widget } from '../common/widget';
import { ResponsiveBoxProps } from './responsive_box_props';
import { combineClasses } from '../../utils/combine_classes';
import { Box } from '../box/box';

import { hasWindow } from '../../../core/utils/window';
import domAdapter from '../../../core/dom_adapter';
import { ScreenSizeQualifier } from './types';
import { convertToScreenSizeQualifier } from './screen_utils';

const HD_SCREEN_WIDTH = 1920;
const RESPONSIVE_BOX_CLASS = 'dx-responsivebox';
const SCREEN_SIZE_CLASS_PREFIX = `${RESPONSIVE_BOX_CLASS}-screen-`;

export const viewFunction = (viewModel: ResponsiveBox): JSX.Element => {
  const getCurrentScreenSizeQualifier = (): ScreenSizeQualifier => {
    const screenWidth = hasWindow()
      ? domAdapter.getDocumentElement().clientWidth
      : HD_SCREEN_WIDTH;

    const screenSizeFunc = viewModel.props.screenByWidth ?? convertToScreenSizeQualifier;
    return screenSizeFunc(screenWidth);
  };

  const screenSizeQualifier = getCurrentScreenSizeQualifier();
  const cssClasses = combineClasses({
    [RESPONSIVE_BOX_CLASS]: true,
    [SCREEN_SIZE_CLASS_PREFIX + screenSizeQualifier]: true,
  });

  return (
    <Widget classes={cssClasses}>
      <Box />
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class ResponsiveBox extends JSXComponent<ResponsiveBoxProps>() {

}
