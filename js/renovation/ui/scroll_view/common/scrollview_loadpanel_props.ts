import {
  Ref,
  OneWay,
  RefObject,
  ComponentBindings,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export class ScrollViewLoadPanelProps {
  @Ref() targetElement?: RefObject<HTMLDivElement>;

  @OneWay() refreshingText?: string;

  @OneWay() visible = false;
}
