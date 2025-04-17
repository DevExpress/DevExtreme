/* eslint-disable
 @typescript-eslint/explicit-function-return-type,
 @typescript-eslint/explicit-module-boundary-types
*/
import { Component, createRef, type RefObject } from 'inferno';

import type { WithElementRef, WithKeyDown } from './types';
import { getKeyWithModifications, markEventAsHandled } from './utils';

export interface WithKeyDownHandlerProps {
  keyDownConfig?: Record<string, (
    event: KeyboardEvent,
    ref: RefObject<HTMLElement>,
  ) => void>;
  caughtEventPreventDefault?: boolean;
}

export const withKeyDownHandler = <
  TProps extends WithElementRef & WithKeyDown,
>(WrappedComponent: typeof Component<TProps>) => {
  class WithKeyDownHandler extends Component<TProps & WithKeyDownHandlerProps> {
    private readonly elementRef = createRef<HTMLElement>();

    public render(): JSX.Element {
      const {
        onKeyDown,
        keyDownConfig,
        children,
        ...restProps
      } = this.props;

      return (
        <WrappedComponent
          {...(restProps as TProps)}
          onKeyDown={this.onKeyDown}
        >
          { children }
        </WrappedComponent>
      );
    }

    private readonly onKeyDown = (event: KeyboardEvent): void => {
      const { keyDownConfig, onKeyDown, caughtEventPreventDefault } = this.props;
      const ref = this.getActualRef();
      const fullKeyName = getKeyWithModifications(event);
      const handler = keyDownConfig?.[fullKeyName];

      if (handler) {
        handler(event, ref);
        markEventAsHandled(event);
      }

      if (handler && caughtEventPreventDefault) {
        event.preventDefault();
      }

      onKeyDown?.(event);
    };

    private getActualRef(): RefObject<HTMLElement> {
      return this.props.elementRef ?? this.elementRef;
    }
  }

  return WithKeyDownHandler;
};
