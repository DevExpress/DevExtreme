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
import BaseWidgetProps from '../utils/base_props';

const DIRECTION_VERTICAL = 'vertical';
const DIRECTION_HORIZONTAL = 'horizontal';
const DIRECTION_BOTH = 'both';
const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';

export interface Location {
  top: number;
  left: number;
}

export interface ScrollOffset {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export type ScrollViewDirection = 'both' | 'horizontal' | 'vertical';

export const ensureLocation = (location: number | Partial<Location>): Location => {
  if (isNumeric(location)) {
    return {
      left: location,
      top: location,
    };
  }
  return { top: 0, left: 0, ...location };
};

export const getRelativeLocation = (element: HTMLElement): Location => {
  const result = { top: 0, left: 0 };
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
  restAttributes,
}: ScrollView): JSX.Element => (
  <Widget
    classes={cssClasses}
    disabled={disabled}
    rtlEnabled={rtlEnabled}
    height={height}
    width={width}
    {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
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

/* istanbul ignore next: class has only props default */
@ComponentBindings()
export class ScrollViewProps {
  @Slot() children?: any;

  @OneWay() direction: ScrollViewDirection = 'vertical';

  @OneWay() height?: string | number | (() => (string | number));

  @OneWay() width?: string | number | (() => (string | number));
}
type ScrollViewPropsType = ScrollViewProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled'>;

@Component({
  view: viewFunction,
})
export default class ScrollView extends JSXComponent<ScrollViewPropsType>() {
  @Ref() contentRef!: HTMLDivElement;

  @Ref() containerRef!: HTMLDivElement;

  @Method()
  content(): HTMLDivElement {
    return this.contentRef;
  }

  @Method()
  scrollBy(distance: number | Partial<Location>): void {
    const { direction } = this.props;
    const location = ensureLocation(distance);

    if (direction === DIRECTION_VERTICAL || direction === DIRECTION_BOTH) {
      this.containerRef.scrollTop = Math.round(this.getScrollLocation().top + location.top);
    }
    if (direction === DIRECTION_HORIZONTAL || direction === DIRECTION_BOTH) {
      this.containerRef.scrollLeft = Math.round(this.getScrollLocation().left + location.left);
    }
  }

  @Method()
  scrollTo(targetLocation: number | Partial<Location>): void {
    const location = ensureLocation(targetLocation);
    this.scrollBy({
      left: location.left - this.getScrollLocation().left,
      top: location.top - this.getScrollLocation().top,
    });
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: ScrollOffset): void {
    if (element.closest(`.${SCROLLABLE_CONTENT_CLASS}`)) {
      const scrollOffset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...offset,
      };
      this.scrollTo({
        top: this.getScrollTopLocation(element, scrollOffset),
        left: this.getScrollLeftLocation(element, scrollOffset),
      });
    }
  }

  get cssClasses(): string {
    const { direction } = this.props;
    return `dx-scrollview dx-scrollable dx-scrollable-${direction} dx-scrollable-native dx-scrollable-native-generic`;
  }

  private getScrollBarWidth(): number {
    return this.containerRef.offsetWidth - this.containerRef.clientWidth;
  }

  private getScrollLocation(): Location {
    return {
      left: this.containerRef.scrollLeft,
      top: this.containerRef.scrollTop,
    };
  }

  private getScrollTopLocation(element: HTMLElement, scrollOffset?: ScrollOffset): number {
    const offsetTop = getRelativeLocation(element).top;
    const { offsetHeight } = element;
    const getScrollOffset = (name): number => (scrollOffset ? scrollOffset[name] : 0);
    const containerHeight = this.containerRef.offsetHeight - getScrollOffset('top') - getScrollOffset('bottom');
    const { top } = this.getScrollLocation();

    if (offsetTop < top + getScrollOffset('top')) {
      if (offsetHeight < containerHeight) {
        return offsetTop - getScrollOffset('top');
      }
      return offsetTop + offsetHeight - this.containerRef.offsetHeight + getScrollOffset('bottom') + this.getScrollBarWidth();
    }

    if (offsetTop + offsetHeight >= top + containerHeight + getScrollOffset('top')) {
      if (offsetHeight < containerHeight) {
        return offsetTop + offsetHeight + this.getScrollBarWidth() - containerHeight - getScrollOffset('top');
      }
      return offsetTop - getScrollOffset('top');
    }

    return top;
  }

  private getScrollLeftLocation(element: HTMLElement, scrollOffset?: ScrollOffset): number {
    const offsetLeft = getRelativeLocation(element).left;
    const { offsetWidth } = element;
    const getScrollOffset = (name): number => (scrollOffset ? scrollOffset[name] : 0);
    const containerWidth = this.containerRef.offsetWidth - getScrollOffset('left') - getScrollOffset('right');
    const { left } = this.getScrollLocation();

    if (offsetLeft < left + getScrollOffset('left')) {
      if (offsetWidth < containerWidth) {
        return offsetLeft - getScrollOffset('left');
      }
      return offsetLeft + offsetWidth - this.containerRef.offsetWidth + getScrollOffset('right') + this.getScrollBarWidth();
    }

    if (offsetLeft + offsetWidth >= left + containerWidth + getScrollOffset('left')) {
      if (offsetWidth < containerWidth) {
        return offsetLeft + offsetWidth + this.getScrollBarWidth() - containerWidth - getScrollOffset('left');
      }
      return offsetLeft - getScrollOffset('left');
    }

    return left;
  }
}
