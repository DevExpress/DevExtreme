/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-plusplus */

import { Component } from 'inferno';

let contextId = 0;
export const createContext = function<T>(defaultValue: T) {
  const id = contextId++;

  return {
    id,
    defaultValue,
    Provider: class extends Component<{ value: T }> {
      getChildContext() {
        return {
          ...this.context,
          [id]: this.props.value || (defaultValue as unknown as T),
        };
      }

      render() {
        return this.props.children;
      }
    },

  };
};
