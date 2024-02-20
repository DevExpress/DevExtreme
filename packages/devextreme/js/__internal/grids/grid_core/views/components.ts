/* eslint-disable class-methods-use-this */
import type { VNode } from '@ts/core/reactive_dom';
import { $$, Component } from '@ts/core/reactive_dom';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableProperties {
  className: string;
}

export class Table extends Component<TableProperties> {
  getMarkup(): VNode {
    return $$('table')
      .attr('className', this.props.className);
  }
}
