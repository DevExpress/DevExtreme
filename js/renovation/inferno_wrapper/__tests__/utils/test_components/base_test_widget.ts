/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import Component from '../../../component';

export default class BaseTestWidget extends Component {
  lastPassedProps: any;

  getLastInfernoPassedProps(): any {
    return this.lastPassedProps;
  }

  _renderInferno(props: any): void {
    this.lastPassedProps = props;
    super._renderInferno(props);
  }
}
