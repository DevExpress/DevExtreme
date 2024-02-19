/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line max-classes-per-file
import dxButton from '@js/ui/button';
import { computed, Observable } from '@ts/core/reactive';
import type { VNode } from '@ts/core/reactive_dom';
import { Component } from '@ts/core/reactive_dom';

import { $$ } from './core/reactive_jquery';

interface FancyButtonOptions {
  text: string;

  onclick: () => void;
}

class FancyButton extends Component<FancyButtonOptions> {
  getMarkup(): VNode {
    return $$('button')
      .addClass('my-fancy-button')
      .text(this.props.text)
      .attr('onclick', this.props.onclick);
  }
}

export class Clicker extends Component<{}> {
  counter = new Observable(0);

  doubledContuner = computed((c: number) => c * 2, [this.counter]);

  useDxWidget = new Observable(false);

  getMarkup(): VNode {
    // return this.getMarkup_vnode();
    // return this.getMarkup_jsx();
    return this.getMarkup_jquery();
  }

  private getMarkup_jquery(): VNode {
    return $$('div')
      .addClass('my-app')
      .append(
        $$.component(FancyButton, {
          text: 'switch buttons',
          onclick: () => this.useDxWidget.update((u) => !u),
        }),
        $$('br'),
        $$.iff(this.useDxWidget)
          .then(
            $$.widget(dxButton, {
              text: 'press me too',
              onClick: () => this.counter.update((c) => c + 1),
            }),
          ).elsee(
            $$.component(FancyButton, {
              text: 'press me',
              onclick: () => this.counter.update((c) => c + 1),
            }),
          ),
        $$('br'),
        $$.text('counter is '),
        $$.text(this.counter),
        $$('br'),
        $$.text('double counter is '),
        $$.text(this.doubledContuner),
      );
  }

  /*
  private getMarkup_jsx(): VNode {
    return
      <div class='my-app'>
        <button onclick={() => this.counter.update((c) => c + 1)}>
          press me
        </button>
        <br/>
        counter is {this.counter}
      </div>
  }
  */

  private getMarkup_vnode(): VNode {
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
