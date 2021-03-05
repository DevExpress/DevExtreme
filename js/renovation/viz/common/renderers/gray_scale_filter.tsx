import {
  ComponentBindings,
  Component,
  JSXComponent,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({ props: { id } }: GrayScaleFilter): JSX.Element => (
  <filter id={id}>
    <feColorMatrix
      type="matrix"
      values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 0.6 0"
    />
  </filter>
);

@ComponentBindings()
export class GrayScaleFilterProps {
  @OneWay() id?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class GrayScaleFilter extends JSXComponent(GrayScaleFilterProps) {}
