import {
  ComponentBindings,
  OneWay,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export class BottomPocketProps {
  @OneWay() reachBottomText?: string;
}
