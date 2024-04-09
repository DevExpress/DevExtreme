import { ClientFunction, Selector } from 'testcafe';

const CLASS = {
  stateInvisible: 'dx-state-invisible',
  tooltipWrapper: 'dx-tooltip-wrapper',
  content: 'dx-popup-content',
};

export default class TooltipBase {
  readonly element: Selector;

  readonly content: Selector;

  readonly exists: Promise<boolean>;

  constructor(tooltipClass: string) {
    this.element = Selector(`.${tooltipClass}`);
    this.content = this.element.find(`.${CLASS.content}`);
    this.exists = this.element.exists;
  }

  isVisible(): Promise<boolean> {
    const { element: getElement } = this;
    const invisibleStateClass = CLASS.stateInvisible;

    return ClientFunction(() => {
      const element = getElement() as any;
      return element && !element.classList.contains(invisibleStateClass);
    }, {
      dependencies: {
        getElement,
        invisibleStateClass,
      },
    })();
  }
}
