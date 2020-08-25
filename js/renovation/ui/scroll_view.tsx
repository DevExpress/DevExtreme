import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
  OneWay,
  Method,
  Ref,
} from 'devextreme-generator/component_declaration/common';
import { isNumeric } from '../../core/utils/type';
import { Widget } from './common/widget';
import config from '../../core/config';

const DIRECTION_VERTICAL = 'vertical';
const DIRECTION_HORIZONTAL = 'horizontal';
const DIRECTION_BOTH = 'both';
const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';

export interface Location {
  top: number;
  left: number;
}

export const ensureLocation = (location: number | Location): Location => {
  if (isNumeric(location)) {
    return {
      left: location,
      top: location,
    } as Location;
  }
  return { ...{ top: 0, left: 0 }, ...(location as Location) } as Location;
};

export const getRelativeLocation = (element: HTMLElement): Location => {
  const result = { top: 0, left: 0 } as Location;
  let targetElement = element;
  while (!targetElement.matches(`.${SCROLLABLE_CONTENT_CLASS}`)) {
    result.top += targetElement.offsetTop;
    result.left += targetElement.offsetLeft;
    targetElement = targetElement.offsetParent as HTMLElement;
  }
  return result;
};

export const viewFunction = ({
  cssClasses, contentRef, containerRef,
  props: {
    disabled, height, width, rtlEnabled, children,
  },
}: ScrollView): JSX.Element => (
  <Widget
    classes={cssClasses}
    disabled={disabled}
    rtlEnabled={rtlEnabled}
    height={height}
    width={width}
  >
    <div className="dx-scrollable-wrapper">
      <div className="dx-scrollable-container" ref={containerRef as any}>
        <div className={SCROLLABLE_CONTENT_CLASS} ref={contentRef as any}>
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
  content(): HTMLDivElement {
    return this.contentRef;
  }

  @Method()
  scrollBy(distance: number | Location): void {
    const { direction } = this.props;
    const location = ensureLocation(distance);

    if (direction === DIRECTION_VERTICAL || direction === DIRECTION_BOTH) {
      this.containerRef.scrollTop = Math.round(this.scrollLocation.top + location.top);
    }
    if (direction === DIRECTION_HORIZONTAL || direction === DIRECTION_BOTH) {
      this.containerRef.scrollLeft = Math.round(this.scrollLocation.left + location.left);
    }
  }

  @Method()
  scrollTo(targetLocation: number | Location): void {
    const location = ensureLocation(targetLocation);
    this.scrollBy({
      left: location.left - this.scrollLocation.left,
      top: location.top - this.scrollLocation.top,
    } as Location);
  }

  @Method()
  scrollToElement(element: HTMLElement): void {
    if (element.closest(`.${SCROLLABLE_CONTENT_CLASS}`)) {
      this.scrollTo({
        top: this.getScrollTopLocation(element),
        left: this.getScrollLeftLocation(element),
      } as Location);
    }
  }

  get cssClasses(): string {
    const { direction } = this.props;
    return `dx-scrollview dx-scrollable dx-scrollable-${direction} dx-scrollable-native dx-scrollable-native-generic`;
  }

  private get scrollBarWidth(): number {
    return this.containerRef?.offsetWidth - this.containerRef?.clientWidth;
  }

  private get scrollLocation(): Location {
    return {
      left: this.containerRef?.scrollLeft,
      top: this.containerRef?.scrollTop,
    } as Location;
  }

  private getScrollTopLocation(element: HTMLElement): number {
    const offsetTop = getRelativeLocation(element).top;
    const { offsetHeight } = element;
    const containerHeight = this.containerRef.offsetHeight;
    const { top } = this.scrollLocation;

    if ((offsetHeight >= containerHeight) || (offsetTop + offsetHeight <= top)) {
      return offsetTop;
    }
    if (offsetTop + offsetHeight >= top + containerHeight) {
      return offsetTop + offsetHeight + this.scrollBarWidth - containerHeight;
    }
    return top;
  }

  private getScrollLeftLocation(element: HTMLElement): number {
    const offsetLeft = getRelativeLocation(element).left;
    const { offsetWidth } = element;
    const containerWidth = this.containerRef.offsetWidth;
    const { left } = this.scrollLocation;

    if ((offsetWidth >= containerWidth) || (offsetLeft + offsetWidth <= left)) {
      return offsetLeft;
    }
    if (offsetLeft + offsetWidth >= left + containerWidth) {
      return offsetLeft + offsetWidth + this.scrollBarWidth - containerWidth;
    }
    return left;
  }
}
