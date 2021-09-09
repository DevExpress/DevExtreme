import { Selector, ClientFunction } from 'testcafe';

const CLASS = {
  scrollbar: 'dx-scrollbar',
  stateInvisible: 'dx-state-invisible',
  scrollableScroll: 'dx-scrollable-scroll',
};

export default class Scrollbar {
  element: Selector;

  constructor(postfix: string) {
    this.element = Selector(`.${CLASS.scrollbar}-${postfix}`);
  }

  getScroll(): Selector {
    return this.element.find(`.${CLASS.scrollableScroll}`);
  }

  isScrollVisible(): Promise<boolean> {
    const scroll = this.getScroll();
    const invisibleStateClass = CLASS.stateInvisible;

    return ClientFunction(() => !$(scroll()).hasClass(invisibleStateClass), {
      dependencies: { scroll, invisibleStateClass },
    })();
  }
}
