/* eslint-disable
 @typescript-eslint/explicit-function-return-type,
 @typescript-eslint/explicit-module-boundary-types,
 spellcheck/spell-checker
*/
import { eventHandler, eventUtils, NativeEventListener } from '@ts/grids/new/grid_core/core/events/index';
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import type { NavigationItem, NavigationStrategyBase } from './navigation_strategy/index';
import type {
  WithElementRef,
  WithKeyDown,
  WithoutTabIndex,
  WithTabIndex,
} from './types';

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

    private readonly eventListener = new NativeEventListener();

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
      this.eventListener.add(elementRef, 'focusin', this.onFocusIn.bind(this));
    }

    public componentDidUpdate(): void {
      this.props.navigationStrategy.setItem(this.props.navigationIdx, this.navigationItem);
    }

    public componentWillUnmount(): void {
      this.eventListener.unsubscribe();
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
          onKeyDown={this.onKeyDown.bind(this)}
          {...(restProps as TProps)}
        >
          {children}
        </WrappedComponent>
      );
    }

    @eventHandler
    private onKeyDown(event: KeyboardEvent): void {
      const {
        navigationStrategy, onKeyDown, onFocusMoved,
      } = this.props;

      const [eventHandled, newActiveItem] = navigationStrategy
        .getNewActiveItem(() => navigationStrategy.onKeyDown(event));

      if (eventHandled) {
        event.preventDefault();
        eventUtils.markHandled(event);
      }

      if (newActiveItem) {
        onFocusMoved?.(newActiveItem.idx, newActiveItem.element);
      }

      onKeyDown?.(event);
    }

    @eventHandler
    private onFocusIn(): void {
      const { navigationStrategy, navigationIdx, onFocusMoved } = this.props;

      const [, newActiveItem] = navigationStrategy
        .getNewActiveItem(() => navigationStrategy.setActiveItem(navigationIdx, false));

      if (newActiveItem) {
        onFocusMoved?.(newActiveItem.idx, newActiveItem.element);
      }
    }

    private getActualRef(): RefObject<HTMLElement> {
      return this.props.elementRef ?? this.elementRef;
    }
  }

  return WithKbnNavigationItem;
};
