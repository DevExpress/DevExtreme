import {
  Component, ComponentBindings, JSXComponent, Ref, Effect, OneWay, RefObject,
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

  @Effect()
  updateFontSize(): void {
    const { size, isChecked } = this.props;

    if (hasWindow()) {
      const newIconSize = isNumber(size) ? size : this.getComputedIconSize();

      if (newIconSize) {
        const newFontSize = getFontSizeByIconSize(newIconSize, isChecked);

        this.setIconFontSize(newFontSize);
      }
    }
  }

  setIconFontSize(fontSize: number): void {
    const element = this.elementRef.current!;

    element.style.fontSize = `${fontSize}px`;
  }

  getComputedIconSize(): number {
    const element = this.elementRef.current!;

    const iconComputedStyle = getElementComputedStyle(element) as CSSStyleDeclaration;
    const computedIconSize = parseInt(iconComputedStyle?.width, 10);

    return computedIconSize;
  }

  get cssStyles(): { [key: string]: string | number } {
    const { size } = this.props;
    const width = normalizeStyleProp('width', size);
    const height = normalizeStyleProp('height', size);

    return { height, width };
  }
}
