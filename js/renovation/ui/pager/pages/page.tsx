import {
  Component, ComponentBindings, JSXComponent, OneWay, Event,
} from '@devextreme-generator/declarations';

import { LightButton } from '../common/light_button';
import { PAGER_PAGE_CLASS, PAGER_SELECTION_CLASS } from '../common/consts';
import { combineClasses } from '../../../utils/combine_classes';
import { EventCallback } from '../../common/event_callback';
import messageLocalization from '../../../../localization/message';
import { format } from '../../../../core/utils/string';

export const viewFunction = ({
  className, value, label, props: { onClick, selected },
}: Page): JSX.Element => (
  <LightButton
    className={className}
    label={label}
    onClick={onClick}
    selected={selected}
  >
    {value}
  </LightButton>
);

// for angular type inference (onClick type in angular changes to EventEmitter)
export interface PagePropsInterface {
  index: number;
  onClick?: EventCallback;
  selected: boolean;
}
/* istanbul ignore next: class has only props default */
@ComponentBindings()
export class PageProps implements PagePropsInterface {
  @OneWay() index = 0;

  /* istanbul ignore next: EventCallback cannot be tested */
  @Event() onClick?: EventCallback;

  @OneWay() selected = false;

  @OneWay() className?: string = PAGER_PAGE_CLASS;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Page extends JSXComponent<PageProps>() {
  get label(): string {
    return format(messageLocalization.getFormatter('dxPager-page'), this.value) as string;
  }

  get value(): number {
    return this.props.index + 1;
  }

  get className(): string {
    const
      { selected } = this.props;
    return combineClasses({
      [`${this.props.className}`]: !!this.props.className,
      [PAGER_SELECTION_CLASS]: !!selected,
    });
  }
}
