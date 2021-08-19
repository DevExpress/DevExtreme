import {
  Component, ComponentBindings, JSXComponent, Ref, Effect, OneWay, RefObject,
} from '@devextreme-generator/declarations';
import { EffectReturn } from '../../../utils/effect_return';
import getElementComputedStyle from '../../../utils/get_computed_style';
import { hasWindow } from '../../../../core/utils/window';
import { normalizeStyleProp } from '../../../../core/utils/style';
import { isNumeric as isNumber } from '../../../../core/utils/type';
import { getDefaultIconSize, getFontSizeByIconSize } from './utils';

export const viewFunction = (viewModel: CheckBoxIcon): JSX.Element => {
  const { elementRef, cssStyles } = viewModel;
  return (
    <span className="dx-checkbox-icon" ref={elementRef} style={cssStyles} />
  );
};

@ComponentBindings()
export class CheckBoxIconProps {
  @OneWay() size?: number | string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class CheckBoxIcon extends JSXComponent(CheckBoxIconProps) {
  @Ref() elementRef!: RefObject<HTMLDivElement>;

  @Effect()
  updateFontSize(): EffectReturn {
    const { size } = this.props;

    if (hasWindow()) {
      const newIconSize = isNumber(size) ? size : this.getComputedIconSize();
      const newFontSize = getFontSizeByIconSize(newIconSize);

      this.setIconFontSize(newFontSize);
    }

    return undefined;
  }

  setIconFontSize(fontSize: number): void {
    const element = this.elementRef.current!;

    element.style.fontSize = `${fontSize}px`;
  }

  getComputedIconSize(): number {
    const element = this.elementRef.current!;

    const iconComputedStyle = getElementComputedStyle(element) as CSSStyleDeclaration;
    const computedIconSize = parseInt(iconComputedStyle?.width, 10);

    return computedIconSize || getDefaultIconSize();
  }

  get cssStyles(): { [key: string]: string | number } {
    const { size } = this.props;
    const width = normalizeStyleProp('width', size);
    const height = normalizeStyleProp('height', size);

    return { height, width };
  }
}
