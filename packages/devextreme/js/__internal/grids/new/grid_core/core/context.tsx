/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

let i = 0;

export function createContext<T>(defaultValue?: T) {
  const key = i;
  i += 1;

  class Provider extends Component<{ value: T }> {
    public render(): InfernoNode {
      return this.props.children;
    }

    public getChildContext(): Record<string, unknown> {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...this.context,
        [key]: this.props.value,
      };
    }
  }

  function get(context: Record<string, undefined>): T {
    const value = context[key];

    if (value) {
      return value;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw new Error('context value is not provided');
  }

  return { Provider, get };
}
