/* eslint-disable @typescript-eslint/ban-types */
import type { MaybeSubscribable, Subscribable } from '@ts/core/reactive';
import { toSubscribable } from '@ts/core/reactive';

import type { VNode } from './rendering';
import { _render, bindToDom } from './rendering';

export abstract class Component<TProperties extends {}> {
  protected props: {
    [P in keyof TProperties]: Subscribable<TProperties[P]>;
  };

  constructor(props: {
    [P in keyof TProperties]: MaybeSubscribable<TProperties[P]>;
  }) {
    this.props = {} as {
      [P in keyof TProperties]: Subscribable<TProperties[P]>;
    };
    Object.entries(props ?? {}).forEach(([name, value]) => {
      this.props[name] = toSubscribable(value);
    });
  }
  abstract getMarkup(): VNode;

  bindToDom(root: Element): void {
    bindToDom(root, this.getMarkup());
  }

  render(): Node {
    return _render(this.getMarkup());
  }
}
