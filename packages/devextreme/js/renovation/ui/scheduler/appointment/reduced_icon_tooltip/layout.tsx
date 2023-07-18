import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Fragment,
} from '@devextreme-generator/declarations';
import { Tooltip } from '../../../overlays/tooltip';
import { getReducedIconTooltipText } from '../utils';

const wrapperAttr = {
  class: 'dx-scheduler-reduced-icon-tooltip',
};

export const viewFunction = ({
  text,
  props: {
    visible,
    target,
  },
}: ReducedIconTooltip): JSX.Element => (
  <Tooltip
    visible={visible}
    target={target}
    wrapperAttr={wrapperAttr}
  >
    <Fragment>
      {text}
    </Fragment>
  </Tooltip>
);

@ComponentBindings()
export class ReducedIconTooltipProps {
  @OneWay() visible = false;

  @OneWay() endDate?: Date | string;

  @OneWay() target!: HTMLDivElement;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ReducedIconTooltip extends JSXComponent<ReducedIconTooltipProps, 'target'>() {
  get text(): string {
    return getReducedIconTooltipText(this.props.endDate);
  }
}
