/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import Component from '../../../../component';

export default class BaseTestComponent extends Component {
  lastPassedProps: any;

  getLastPassedProps(): any {
    return this.lastPassedProps;
  }

  _init(): void {
    super._init();
    this.defaultKeyHandlers.enter = () => 'default enter handler';
    this.defaultKeyHandlers.arrowUp = () => 'default arrow up handler';
  }

  _getContentReadyOptions(): string[] {
    return [...super._getContentReadyOptions(), 'width', 'height'];
  }

  _renderWrapper(props: Record<string, unknown>): void {
    this.lastPassedProps = props;
    super._renderWrapper(props);
  }
}
