import { ClientFunction, Selector } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';

const CLASS = {
  content: 'dx-overlay-content',
  wrapper: 'dx-overlay-wrapper',
  closeButton: 'dx-closebutton',
};
export default class Overlay extends Widget {
  public static className = '.dx-popup-wrapper';

  public static footerToolbarClassName = '.dx-popup-bottom';

  content: Selector;

  wrapper: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.content = this.element.find(`.${CLASS.content}`);
    this.wrapper = this.element.find(`.${CLASS.wrapper}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxOverlay'; }

  // eslint-disable-next-line class-methods-use-this
  getWrapper(): Selector {
    return Selector(`.${CLASS.wrapper}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getContent(): Selector {
    return Selector(`.${CLASS.content}`);
  }

  show(): Promise<{ top: number; left: number }> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).show(),
      { dependencies: { getInstance } },
    )();
  }

  hide(): Promise<{ top: number; left: number }> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).hide(),
      { dependencies: { getInstance } },
    )();
  }
}
