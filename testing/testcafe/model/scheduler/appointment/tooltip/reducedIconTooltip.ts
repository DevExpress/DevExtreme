import TooltipBase from './base';

const CLASS = {
  reducedIconTooltip: 'dx-scheduler-reduced-icon-tooltip',
};

export default class ReducedIconTooltip extends TooltipBase {
  readonly text: Promise<string>;

  constructor() {
    super(CLASS.reducedIconTooltip);

    this.text = this.content.innerText;
  }
}
