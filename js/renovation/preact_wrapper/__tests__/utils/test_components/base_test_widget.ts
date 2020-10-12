/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import Component from '../../../component';

export default class BaseTestWidget extends Component {
  lastPassedProps: any;

  getLastPreactPassedProps(): any {
    return this.lastPassedProps;
  }

  _renderPreact(props: any): void {
    this.lastPassedProps = props;
    super._renderPreact(props);
  }
}
