import {
  ComponentBindings,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

@ComponentBindings()
export class BottomPocketProps {
  @OneWay() reachBottomText?: string;
}
