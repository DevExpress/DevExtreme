/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Subscribable } from '@ts/core/reactive/index';
import type { InfernoNode } from 'inferno';

import { View } from './core/view';

export class MainView extends View {
  public vdom: InfernoNode | Subscribable<InfernoNode>;

  public static dependencies = [] as const;

  constructor() {
    super();

    this.vdom = <>Please override 'Main View' in your component</>;
  }
}
