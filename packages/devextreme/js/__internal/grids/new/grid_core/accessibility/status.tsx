import { Component } from 'inferno';

import { CLASSES as BASE_CLASSES } from '../const';

const CLASSES = {
  ...BASE_CLASSES,
  container: 'dx-screen-reader-only',
};

export interface A11yStatusContainerComponentProps {
  statusText?: string;
}

export class A11yStatusContainer extends Component<A11yStatusContainerComponentProps> {
  public render(): JSX.Element {
    return (
        <div
            className={`${CLASSES.container} ${CLASSES.excludeFlexBox}`}
            role={'status'}
        >
            {this.props.statusText ?? ''}
        </div>
    );
  }
}
