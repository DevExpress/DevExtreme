import type { PagerBase } from '@js/ui/pagination';
import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

import { Pager } from '../inferno_wrappers/pager';

export type PagerProps = PagerBase & { visible: boolean };

export class PagerView extends Component<PagerProps> {
  public render(): InfernoNode {
    return (
      this.props.visible && <Pager {...this.props}></Pager>
    );
  }
}
