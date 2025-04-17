/* eslint-disable spellcheck/spell-checker */
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import type { NavigationStrategyBase } from './navigation_strategy/index';
import { markEventAsHandled } from './utils';

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

  public componentDidMount(): void {
    const elementRef = this.getActualRef();

    elementRef.current?.addEventListener('focusout', this.onFocusOut);
    this.firstFocusDecoyRef.current?.addEventListener('focusin', this.onDecoyFocusIn);
    this.lastFocusDecoyRef.current?.addEventListener('focusin', this.onDecoyFocusIn);
  }

  public componentDidUpdate(): void {
    this.props.navigationStrategy.normalizeActiveIdx();
  }

  public componentWillUnmount(): void {
    const elementRef = this.getActualRef();

    elementRef.current?.removeEventListener('focusout', this.onFocusOut);
    this.firstFocusDecoyRef.current?.removeEventListener('focusin', this.onDecoyFocusIn);
    this.lastFocusDecoyRef.current?.removeEventListener('focusin', this.onDecoyFocusIn);
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
        onKeyDown={this.onKeyDown}
        data-dx-focus-container={true}
      >
        <div ref={this.firstFocusDecoyRef} data-dx-focus-decoy={true} tabIndex={0} />
        { children }
        <div ref={this.lastFocusDecoyRef} data-dx-focus-decoy={true} tabIndex={0} />
      </div>
    );
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const { navigationStrategy, onKeyDown } = this.props;
    const elementRef = this.getActualRef();

    if (event.key === 'Tab') {
      navigationStrategy.setActiveItem(0, false);
      elementRef.current?.setAttribute('inert', '');
      markEventAsHandled(event);
    }

    onKeyDown?.(event);
  };

  private readonly onFocusOut = (): void => {
    const elementRef = this.getActualRef();
    elementRef.current?.removeAttribute('inert');
  };

  private readonly onDecoyFocusIn = (): void => {
    const { navigationStrategy, onFocusMoved } = this.props;
    navigationStrategy.setActiveItem(0, true);
    const nextActiveItem = navigationStrategy.getActiveItem();

    if (nextActiveItem) {
      onFocusMoved?.(nextActiveItem.idx, nextActiveItem.element);
    }
  };

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
