import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, OneWay, Slot,
} from '@devextreme-generator/declarations';

export const viewFunction = ({
  props: {
    colSpan,
    className,
    styles,
    children,
  },
}: OrdinaryCell): JSX.Element => (
  <td
    className={className}
    style={styles}
    colSpan={colSpan}
  >
    {children}
  </td>
);

@ComponentBindings()
export class CellProps {
  @OneWay() styles?: CSSAttributes;

  @OneWay() colSpan?: number;

  @OneWay() className?: string;

  @Slot() children?: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class OrdinaryCell extends JSXComponent(CellProps) {}
