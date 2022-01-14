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
    const { element } = this;
    const invisibleStateClass = CLASS.stateInvisible;

    return ClientFunction(() => !(element() as any).classList.contains(invisibleStateClass), {
      dependencies: { element, invisibleStateClass },
    })();
  }
}
