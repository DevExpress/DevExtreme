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
  props: { width, height, children },
  restAttributes,
}: RootSvgElement): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
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
    {...restAttributes}
  >
    {children}
  </svg>
);

@ComponentBindings()
export class RootSvgElementProps {
  @OneWay() height?: number = 400;

  @OneWay() width?: number = 400;

  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class RootSvgElement extends JSXComponent(RootSvgElementProps) {}
