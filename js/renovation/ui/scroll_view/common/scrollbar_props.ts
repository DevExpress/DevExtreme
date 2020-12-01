import {
  ComponentBindings, OneWay,
} from 'devextreme-generator/component_declaration/common';

export type ScrollbarDirection = 'horizontal' | 'vertical';
export type ScrollbarVisibilityMode = 'onScroll' | 'onHover' | 'always' | 'never';

@ComponentBindings()
export class ScrollbarProps {
  @OneWay() classes?: string;

  @OneWay() direction?: ScrollbarDirection;

  @OneWay() showScrollbar?: ScrollbarVisibilityMode;

  @OneWay() visible = false;

  @OneWay() activeStateEnabled = false;

  @OneWay() visibilityMode: ScrollbarVisibilityMode = 'onScroll';

  @OneWay() containerSize = 0;

  @OneWay() contentSize = 0;

  @OneWay() baseContainerSize = 0;

  @OneWay() baseContentSize = 0;

  @OneWay() baseContainerToContentRatio?: number;

  @OneWay() realContainerToContentRatio?: number;

  @OneWay() thumbRatio?: number;

  @OneWay() scrollByThumb = true;

  @OneWay() scaleRatio = 1;
}
