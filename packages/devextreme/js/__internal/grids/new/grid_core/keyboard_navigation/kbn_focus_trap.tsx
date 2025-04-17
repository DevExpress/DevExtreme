/* eslint-disable spellcheck/spell-checker */
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import { ALL_FOCUSABLE_ELEMENTS_SELECTOR } from './const';
import { markEventAsHandled } from './utils';

export type KbnFocusTrapProps = KbnFocusTrapBaseProps & {
  enabled?: boolean;
};

export type KbnFocusTrapBaseProps = Exclude<JSX.IntrinsicElements['div'], 'ref'> & {
  elementRef?: RefObject<HTMLDivElement>;
  onKeyDown?: (event: KeyboardEvent) => void;
  onTrapKeyDown?: (event: KeyboardEvent) => void;
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

  public componentDidMount(): void {
    this.firstFocusDecoyRef.current?.addEventListener('focusin', this.onFirstDecoyFocusIn);
    this.lastFocusDecoyRef.current?.addEventListener('focusin', this.onLastDecoyFocusIn);
  }

  public componentWillUnmount(): void {
    this.firstFocusDecoyRef.current?.removeEventListener('focusin', this.onFirstDecoyFocusIn);
    this.lastFocusDecoyRef.current?.removeEventListener('focusin', this.onLastDecoyFocusIn);
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
          onKeyDown={this.onKeyDown}
          {...(restProps as KbnFocusTrapProps)}
        >
          <div data-dx-focus-trap-content={true} onKeyDown={this.onContentKeyDown}>
            <div ref={this.firstFocusDecoyRef} data-dx-focus-decoy={true} tabIndex={0} />
            {children}
            <div ref={this.lastFocusDecoyRef} data-dx-focus-decoy={true} tabIndex={0} />
          </div>
        </div>
    );
  }

  private readonly onKeyDown = (
    event: KeyboardEvent,
  ): void => {
    if (event.key === 'Enter') {
      this.onLastDecoyFocusIn();
      markEventAsHandled(event);
    }

    this.props.onKeyDown?.(event);
  };

  private readonly onContentKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.getActualRef().current?.focus();
      markEventAsHandled(event);
    }

    event.stopPropagation();
    this.props.onTrapKeyDown?.(event);
  };

  private readonly onFirstDecoyFocusIn = (): void => {
    const lastFocusableElement = this.getInnerFocusableElement('last');
    lastFocusableElement?.focus();
  };

  private readonly onLastDecoyFocusIn = (): void => {
    const firstFocusableElement = this.getInnerFocusableElement('first');
    firstFocusableElement?.focus();
  };

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
