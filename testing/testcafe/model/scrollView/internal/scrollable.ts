import { ClientFunction, Selector } from 'testcafe';
import { DIRECTION_VERTICAL, DIRECTION_HORIZONTAL } from '../../../../../js/renovation/ui/scroll_view/common/consts';

import Widget from '../../internal/widget';
import Scrollbar from './scrollbar';

const CLASS = {
  scrollable: 'dx-scrollable',
  scrollableContainer: 'dx-scrollable-container',
  scrollableContent: 'dx-scrollable-content',
};
export default class Scrollable extends Widget {
  scrollbar: Scrollbar;

  vScrollbar?: Scrollbar;

  hScrollbar?: Scrollbar;

  getInstance: ClientFunction;

  name: string;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(id: string | Selector, options?: any, name = 'dxScrollable') {
    super(id);

    const direction = options.direction ?? 'vertical';

    this.element = Selector(`.${CLASS.scrollable}`);
    this.scrollbar = new Scrollbar(options.direction ?? 'vertical');

    if (!options.useNative && !options.useSimulatedScrollbar) {
      if (direction !== DIRECTION_HORIZONTAL) {
        this.vScrollbar = new Scrollbar(DIRECTION_VERTICAL);
      }
      if (direction !== DIRECTION_VERTICAL) {
        this.hScrollbar = new Scrollbar(DIRECTION_HORIZONTAL);
      }
    }

    const scrollable = this.element;

    this.name = name;
    this.getInstance = ClientFunction(
      () => $(scrollable())[`${name}`]('instance'),
      { dependencies: { scrollable, name } },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  getContainer(): Selector {
    return Selector(`.${CLASS.scrollableContainer}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getContent(): Selector {
    return Selector(`.${CLASS.scrollableContent}`);
  }

  apiScrollOffset(): Promise<{ top: number; left: number }> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).scrollOffset(),
      { dependencies: { getInstance } },
    )();
  }

  setContainerCssWidth(value: number): Promise<unknown> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        (getInstance() as any).container().css({ width: value });
        (getInstance() as any).update();
      },
      { dependencies: { getInstance, value } },
    )();
  }
}
