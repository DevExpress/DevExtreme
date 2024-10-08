/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { shallowEquals } from '@ts/core/r1/utils/index';
import { Component } from 'inferno';

export class PureComponent<P = {}, S = {}> extends Component<P, S> {
  public shouldComponentUpdate(nextProps: P): boolean {
    return !shallowEquals(this.props, nextProps as any);
  }
}
