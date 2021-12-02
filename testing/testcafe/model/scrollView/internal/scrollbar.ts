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

  async getScrollTranslate(): Promise<{ left: number; top: number }> {
    const scroll = this.getScroll();
    const matrix = await scroll.getStyleProperty('transform');

    return ClientFunction(
      () => {
        const regex = /matrix.*\((.+)\)/;
        const matrixValues = regex.exec(matrix);

        if (matrixValues) {
          const result = matrixValues[1].split(', ');

          return { left: Number(result[4]), top: Number(result[5]) };
        }

        return { left: 0, top: 0 };
      },
      { dependencies: { matrix } },
    )();
  }
}
