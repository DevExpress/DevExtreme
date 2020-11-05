/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable class-methods-use-this */
import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({
  props: {
    className, width, height, direction, children,
  },
}: RootSvgElement): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    className={className}
    fill="none"
    stroke="none"
    strokeWidth={0}
    style={{
      display: 'block',
      overflow: 'hidden',
      lineHeight: 'normal',
      msUserSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    }}
    width={width}
    height={height}
    direction={direction}
  >
    {children}
  </svg>
);

@ComponentBindings()
export class RootSvgElementProps {
  @OneWay() className = '';

  @OneWay() height = 400;

  @OneWay() width = 400;

  @OneWay() direction?: 'ltr' | 'rtl';

  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class RootSvgElement extends JSXComponent(RootSvgElementProps) {}
