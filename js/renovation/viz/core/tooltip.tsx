import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({
  props: {
    color, border, text,
  },
}: Tooltip) => (
  <Fragment>
    <g>
      <rect
        x={0}
        y={0}
        width={120}
        height={70}
        fill={color}
        stroke={border.color}
        strokeWidth={border.width}
      />
      <text x={20} y={40}>
        {text}
      </text>
    </g>

  </Fragment>
);

@ComponentBindings()
export class TooltipProps {
  @OneWay() color = '#fff';

  @OneWay() border = { color: '#000', width: 2 };

  @OneWay() text = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class Tooltip extends JSXComponent<TooltipProps> {

}
