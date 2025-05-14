/* eslint-disable spellcheck/spell-checker */
import { eventHandler, eventUtils, NativeEventListener } from '@ts/grids/new/grid_core/core/events/index';
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import type { NavigationStrategyBase } from './navigation_strategy/index';

export type KbnNavigationContainerProps = KbnNavigationContainerBaseProps & {
  enabled?: boolean;
};

export type KbnNavigationContainerBaseProps = Exclude<JSX.IntrinsicElements['div'], 'ref'> & {
  navigationStrategy: NavigationStrategyBase;
  elementRef?: RefObject<HTMLDivElement>;
  onKeyDown?: (event: KeyboardEvent) => void;
  onFocusMoved?: (idx: number, element: HTMLElement) => void;
};

export const KbnNavigationContainerDisabled = (
  props: KbnNavigationContainerBaseProps,
): JSX.Element => {
  const {
    elementRef,
    navigationStrategy,
    children,
    ...restProps
  } = props;

  return (
    <div
      ref={elementRef}
      { ...restProps }
      data-dx-focus-container={false}
    >
      <div data-dx-focus-decoy={false} />
      { children }
      <div data-dx-focus-decoy={false} />
    </div>
  );
};

export class KbnNavigationContainerEnabled extends Component<KbnNavigationContainerProps> {
  private readonly elementRef = createRef<HTMLDivElement>();

  private readonly firstFocusDecoyRef = createRef<HTMLDivElement>();

  private readonly lastFocusDecoyRef = createRef<HTMLDivElement>();

  private readonly eventListener = new NativeEventListener();

  public componentDidMount(): void {
    const elementRef = this.getActualRef();

    this.eventListener
      .add(elementRef, 'focusout', this.onFocusOut.bind(this))
      .add(this.firstFocusDecoyRef, 'focusin', this.onDecoyFocusIn.bind(this))
      .add(this.lastFocusDecoyRef, 'focusin', this.onDecoyFocusIn.bind(this));
  }

  public componentDidUpdate(): void {
    this.props.navigationStrategy.normalizeActiveIdx();
  }

  public componentWillUnmount(): void {
    this.eventListener.unsubscribe();
  }

  public render(): JSX.Element {
    const {
      navigationStrategy,
      elementRef,
      children,
      ...restProps
    } = this.props;
    const ref = this.getActualRef();

    navigationStrategy.clear();

    return (
      <div
        {...restProps}
        ref={ref}
        onKeyDown={this.onKeyDown.bind(this)}
        data-dx-focus-container={true}
      >
        <div ref={this.firstFocusDecoyRef} data-dx-focus-decoy={true} tabIndex={0} />
        { children }
        <div ref={this.lastFocusDecoyRef} data-dx-focus-decoy={true} tabIndex={0} />
      </div>
    );
  }

  // TODO: KeyboardEvent
  @eventHandler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onKeyDown(event: any): void {
    const { navigationStrategy, onKeyDown } = this.props;
    const elementRef = this.getActualRef();

    if (event.key === 'Tab') {
      navigationStrategy.setActiveItem(0, false);
      elementRef.current?.setAttribute('inert', '');
      eventUtils.markHandled(event);
    }

    onKeyDown?.(event);
  }

  @eventHandler
  private onFocusOut(): void {
    const elementRef = this.getActualRef();
    elementRef.current?.removeAttribute('inert');
  }

  @eventHandler
  private onDecoyFocusIn(): void {
    const { navigationStrategy, onFocusMoved } = this.props;
    navigationStrategy.setActiveItem(0, true);
    const nextActiveItem = navigationStrategy.getActiveItem();

    if (nextActiveItem) {
      onFocusMoved?.(nextActiveItem.idx, nextActiveItem.element);
    }
  }

  private getActualRef(): RefObject<HTMLDivElement> {
    return this.props.elementRef ?? this.elementRef;
  }
}

export const KbnNavigationContainer = (
  props: KbnNavigationContainerProps,
): JSX.Element => {
  const { enabled, ref, ...restProps } = props;

  return enabled
    ? <KbnNavigationContainerEnabled {...restProps} />
    : <KbnNavigationContainerDisabled {...restProps} />;
};
