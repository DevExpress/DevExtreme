import {
  Component, ComponentBindings, JSXComponent, Ref, OneWay, RefObject,
} from '@devextreme-generator/declarations';
import getElementComputedStyle from '../../../utils/get_computed_style';
import { hasWindow } from '../../../../core/utils/window';
import { normalizeStyleProp } from '../../../../core/utils/style';
import { isNumeric as isNumber } from '../../../../core/utils/type';
import { getFontSizeByIconSize } from './utils';

export const viewFunction = (viewModel: CheckBoxIcon): JSX.Element => {
  const { elementRef, cssStyles } = viewModel;
  return (
    <span className="dx-checkbox-icon" ref={elementRef} style={cssStyles} />
  );
};

@ComponentBindings()
export class CheckBoxIconProps {
  @OneWay() size?: number | string;

  @OneWay() isChecked = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class CheckBoxIcon extends JSXComponent(CheckBoxIconProps) {
  @Ref() elementRef!: RefObject<HTMLDivElement>;

  getIconSize(size: number | string): number {
    if (isNumber(size)) {
      return size;
    }

    if (size.endsWith('px')) {
      return parseInt(size, 10);
    }

    return this.getComputedIconSize();
  }

  getComputedIconSize(): number {
    const element = this.elementRef.current!;
    const iconComputedStyle = getElementComputedStyle(element) as CSSStyleDeclaration;
    return parseInt(iconComputedStyle?.width, 10);
  }

  get cssStyles(): { [key: string]: string | number | undefined } {
    const { size, isChecked } = this.props;
    const iconSize = size && hasWindow() ? this.getIconSize(size) : null;
    const fontSize = iconSize ? getFontSizeByIconSize(iconSize, isChecked) : null;

    return {
      fontSize: fontSize ? `${fontSize}px` : undefined,
      ...normalizeStyleProp('width', size) || {},
      ...normalizeStyleProp('height', size) || {},
    };
  }
}
