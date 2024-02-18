/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line max-classes-per-file
import { Observable } from '@ts/core/reactive';
import type { VNode } from '@ts/core/reactive_dom';
import { Component } from '@ts/core/reactive_dom';

export class Clicker extends Component {
  counter = new Observable(0);

  getMarkup(): VNode {
    /*
      once jsx is set up, will be rewritten as:

      <div class="my-app">
        <button onclick={() => this.counter.update((c) => c + 1)}>
          press me
        </button>
        counter is {c}
      </div>
    */
    return {
      type: 'tag',
      tag: 'div',
      attrs: {
        className: 'dx-clicker',
      },
      child: {
        type: 'array',
        children: [
          {
            type: 'tag',
            tag: 'button',
            attrs: {
              onclick: (): void => {
                this.counter.update((c) => c + 1);
              },
            },
            child: {
              type: 'text',
              text: 'press me',
            },
          },
          {
            type: 'tag',
            tag: 'br',
          },
          {
            type: 'text',
            text: 'counter is ',
          }, {
            type: 'text',
            text: this.counter,
          },
        ],
      },
    };
  }
}
