import { shallowEquals } from '@ts/core/r1/utils';
import { Component } from 'inferno';

export class PureComponent<P = {}, S = {}> extends Component<P, S> {
  shouldComponentUpdate(nextProps: P): boolean {
    return !shallowEquals(this.props, nextProps as any);
  }
}
