/* eslint-disable
 @typescript-eslint/explicit-function-return-type,
 @typescript-eslint/explicit-module-boundary-types,
 spellcheck/spell-checker
*/
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import type { NavigationItem, NavigationStrategyBase } from './navigation_strategy/index';
import type {
  WithElementRef,
  WithKeyDown,
  WithoutTabIndex,
  WithTabIndex,
} from './types';
import { markEventAsHandled } from './utils';

interface WithKbnNavigationItemProps {
  navigationIdx: number;
  navigationStrategy: NavigationStrategyBase;
  onFocusMoved?: (idx: number, element: HTMLElement) => void;
}

export const withKbnNavigationItem = <
  TProps extends WithElementRef & WithTabIndex & WithKeyDown,
>(WrappedComponent: typeof Component<TProps>) => {
  class WithKbnNavigationItem extends Component<
    WithoutTabIndex<TProps> & WithKbnNavigationItemProps
  > {
    private readonly elementRef = createRef<HTMLElement>();

    private readonly navigationItem: NavigationItem = {
      focus: () => {
        this.getActualRef().current?.focus();
      },
      getElement: () => this.getActualRef().current,
    };

    public componentDidMount(): void {
      const elementRef = this.getActualRef();
      const { navigationStrategy, navigationIdx } = this.props;

      navigationStrategy.setItem(navigationIdx, this.navigationItem);
      elementRef.current?.addEventListener('focusin', this.onFocusIn);
    }

    public componentDidUpdate(): void {
      this.props.navigationStrategy.setItem(this.props.navigationIdx, this.navigationItem);
    }

    public componentWillUnmount(): void {
      const elementRef = this.getActualRef();

      elementRef.current?.removeEventListener('focusin', this.onFocusIn);
    }

    public render(): JSX.Element {
      const {
        elementRef,
        tabIndex,
        onKeyDown,
        children,
        ...restProps
      } = this.props;
      const ref = this.getActualRef();

      return (
        <WrappedComponent
          elementRef={ref}
          tabIndex={0}
          onKeyDown={this.onKeyDown}
          {...(restProps as TProps)}
        >
          {children}
        </WrappedComponent>
      );
    }

    private readonly onKeyDown = (event: KeyboardEvent): void => {
      const {
        navigationStrategy, onKeyDown, onFocusMoved,
      } = this.props;

      const prevActiveItem = navigationStrategy.getActiveItem();
      const eventHandled = navigationStrategy.onKeyDown(event);
      const nextActiveItem = navigationStrategy.getActiveItem();

      if (eventHandled) {
        event.preventDefault();
        markEventAsHandled(event);
      }

      if (!!nextActiveItem && prevActiveItem?.element !== nextActiveItem?.element) {
        onFocusMoved?.(nextActiveItem.idx, nextActiveItem.element);
      }

      onKeyDown?.(event);
    };

    private readonly onFocusIn = (): void => {
      const { navigationStrategy, navigationIdx, onFocusMoved } = this.props;

      const prevActiveItem = navigationStrategy.getActiveItem();
      navigationStrategy.setActiveItem(navigationIdx, false);
      const nextActiveItem = navigationStrategy.getActiveItem();

      if (!!nextActiveItem && prevActiveItem?.element !== nextActiveItem?.element) {
        onFocusMoved?.(nextActiveItem.idx, nextActiveItem.element);
      }
    };

    private getActualRef(): RefObject<HTMLElement> {
      return this.props.elementRef ?? this.elementRef;
    }
  }

  return WithKbnNavigationItem;
};
