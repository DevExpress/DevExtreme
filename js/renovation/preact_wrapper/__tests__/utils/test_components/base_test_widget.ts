/* eslint-disable */
import Component from '../../../component';

export default class BaseTestWidget extends Component {
  _renderPreact(props) {
    this.lastPassedProps = props;
    super._renderPreact(props);
  }

  getLastPreactPassedProps() {
    return this.lastPassedProps;
  }
}
