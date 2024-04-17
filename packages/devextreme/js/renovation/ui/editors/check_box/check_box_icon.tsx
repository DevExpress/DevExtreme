import {
  Component, ComponentBindings, JSXComponent, Ref, OneWay, RefObject,
} from '@devextreme-generator/declarations';
import { normalizeStyleProp } from '../../../../core/utils/style';

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

  get cssStyles(): { [key: string]: string | number } {
    const { size } = this.props;
    const width = normalizeStyleProp('width', size);
    const height = normalizeStyleProp('height', size);

    return { height, width };
  }
}
