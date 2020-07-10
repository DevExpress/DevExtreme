import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
  OneWay,
  Method,
  Ref,
} from 'devextreme-generator/component_declaration/common';
import { isNumeric } from '../core/utils/type';
import Widget from './widget';
import config from '../core/config';

enum Direction {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  BOTH = 'both'
}

export interface Location {
  top: number;
  left: number;
}

export const viewFunction = ({
  cssClasses, contentRef, containerRef,
  props: {
    disabled, height, width, rtlEnabled, children,
  },
}: ScrollView) => (
  <Widget
    classes={cssClasses}
    disabled={disabled}
    rtlEnabled={rtlEnabled}
    height={height}
    width={width}
  >
    <div className="dx-scrollable-wrapper">
      <div className="dx-scrollable-container" ref={containerRef as any}>
        <div className="dx-scrollable-content" ref={contentRef as any}>
          {children}
        </div>
      </div>
    </div>
  </Widget>
);

@ComponentBindings()
export class ScrollViewProps {
  @Slot() children?: any;

  @OneWay() direction?: 'both' | 'horizontal' | 'vertical' = 'vertical';

  @OneWay() disabled?: boolean = false;

  @OneWay() height?: string | number | (() => (string | number));

  @OneWay() rtlEnabled?: boolean = config().rtlEnabled;

  @OneWay() width?: string | number | (() => (string | number));
}

@Component({
  view: viewFunction,
})

export default class ScrollView extends JSXComponent(ScrollViewProps) {
  @Ref() contentRef!: HTMLDivElement;

  @Ref() containerRef!: HTMLDivElement;

  @Method()
  content() {
    return this.contentRef;
  }

  @Method()
  scrollBy(distance: number | Location) {
    const { direction } = this.props;
    const location = isNumeric(distance) ? {
      left: distance,
      top: distance,
    } as Location : distance;

    if (direction === Direction.VERTICAL || direction === Direction.BOTH) {
      this.containerRef.scrollTop = Math.round(this.containerRef.scrollTop + location.top);
    }
    if (direction === Direction.HORIZONTAL || direction === Direction.BOTH) {
      this.containerRef.scrollLeft = Math.round(this.containerRef.scrollLeft + location.left);
    }
  }

  get cssClasses(): string {
    const { direction } = this.props;
    return `dx-scrollview dx-scrollable dx-scrollable-${direction} dx-scrollable-native dx-scrollable-native-generic`;
  }
}
