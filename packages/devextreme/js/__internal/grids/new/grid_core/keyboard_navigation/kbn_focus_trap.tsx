/* eslint-disable spellcheck/spell-checker */
import { eventHandler, eventUtils, NativeEventListener } from '@ts/grids/new/grid_core/core/events/index';
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import { ALL_FOCUSABLE_ELEMENTS_SELECTOR } from './const';

export type KbnFocusTrapProps = KbnFocusTrapBaseProps & {
  enabled?: boolean;
};

export type KbnFocusTrapBaseProps = Exclude<JSX.IntrinsicElements['div'], 'ref'> & {
  elementRef?: RefObject<HTMLDivElement>;
  onKeyDown?: (event: KeyboardEvent) => void;
};

// NOTE: Return same DOM structure to prevent unexpected markup behavior
export const KbnFocusTrapDisabled = (
  props: KbnFocusTrapBaseProps,
): JSX.Element => {
  const { elementRef, children, ...restProps } = props;

  return (
    <div
      ref={elementRef}
      {...restProps}
    >
      <div data-dx-focus-trap-content={false}>
        <div data-dx-focus-decoy={false} />
        {children}
        <div data-dx-focus-decoy={false} />
      </div>
    </div>
  );
};

export class KbnFocusTrapEnabled extends Component<KbnFocusTrapBaseProps> {
  private readonly elementRef = createRef<HTMLDivElement>();

  private readonly firstFocusDecoyRef = createRef<HTMLDivElement>();

  private readonly lastFocusDecoyRef = createRef<HTMLDivElement>();

  private readonly eventListener = new NativeEventListener();

  public componentDidMount(): void {
    this.eventListener
      .add(this.firstFocusDecoyRef, 'focusin', this.onFirstDecoyFocusIn.bind(this))
      .add(this.lastFocusDecoyRef, 'focusin', this.onLastDecoyFocusIn.bind(this));
  }

  public componentWillUnmount(): void {
    this.eventListener.unsubscribe();
  }

  public render(): JSX.Element {
    const {
      elementRef,
      onKeyDown,
      children,
      ...restProps
    } = this.props;
    const ref = this.getActualRef();

    return (
        <div
          ref={ref}
          onKeyDown={this.onKeyDown.bind(this)}
          {...(restProps as KbnFocusTrapProps)}
        >
          <div data-dx-focus-trap-content={true} onKeyDown={this.onContentKeyDown.bind(this)}>
            <div ref={this.firstFocusDecoyRef} data-dx-focus-decoy={true} tabIndex={0} />
            {children}
            <div ref={this.lastFocusDecoyRef} data-dx-focus-decoy={true} tabIndex={0} />
          </div>
        </div>
    );
  }

  // TODO: KeyboardEvent
  @eventHandler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onKeyDown(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.focusLastChild();
      eventUtils.markHandled(event);
    }

    this.props.onKeyDown?.(event);
  }

  // TODO: KeyboardEvent
  @eventHandler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onContentKeyDown(event: any): void {
    if (event.key === 'Escape') {
      this.getActualRef().current?.focus();
      eventUtils.markHandled(event);
    }

    eventUtils.markIgnored(event);
  }

  @eventHandler
  private onFirstDecoyFocusIn(): void {
    this.focusLastChild();
  }

  @eventHandler
  private onLastDecoyFocusIn(): void {
    const firstFocusableElement = this.getInnerFocusableElement('first');
    firstFocusableElement?.focus();
  }

  private focusLastChild(): void {
    const lastFocusableElement = this.getInnerFocusableElement('last');
    lastFocusableElement?.focus();
  }

  private getActualRef(): RefObject<HTMLDivElement> {
    return this.props.elementRef ?? this.elementRef;
  }

  private getInnerFocusableElement(type: 'first' | 'last'): HTMLElement | null {
    const elementRef = this.getActualRef();
    const focusableElements = elementRef
      .current?.querySelectorAll<HTMLElement>(ALL_FOCUSABLE_ELEMENTS_SELECTOR);
    const focusableElementsCount = focusableElements?.length ?? 0;

    // NOTE: We always have two focusable decoys
    if (!focusableElements || focusableElementsCount < 3) {
      return null;
    }

    return type === 'first'
      ? focusableElements[1]
      : focusableElements[focusableElementsCount - 2];
  }
}

export const KbnFocusTrap = (
  props: KbnFocusTrapProps,
): JSX.Element => {
  const {
    enabled, ref, onKeyDown, ...restProps
  } = props;

  return enabled
    ? <KbnFocusTrapEnabled {...restProps} onKeyDown={onKeyDown} />
    : <KbnFocusTrapDisabled {...restProps} onKeyDown={onKeyDown} />;
};
