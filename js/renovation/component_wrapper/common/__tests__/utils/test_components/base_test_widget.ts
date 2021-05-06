/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import Component from '../../../component';

export default class BaseTestWidget extends Component {
  lastPassedProps: any;

  getLastPassedProps(): any {
    return this.lastPassedProps;
  }

  _getContentReadyOptions(): string[] {
    return [...super._getContentReadyOptions(), 'width', 'height'];
  }

  _renderWrapper(props: unknown): void {
    this.lastPassedProps = props;
    super._renderWrapper(props);
  }
}
