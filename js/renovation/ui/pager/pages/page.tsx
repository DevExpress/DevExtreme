import {
  Component, ComponentBindings, JSXComponent, OneWay, Event,
} from 'devextreme-generator/component_declaration/common';

import { LightButton } from '../common/light_button';
import { PAGER_PAGE_CLASS, PAGER_SELECTION_CLASS } from '../common/consts';
import { combineClasses } from '../../../utils/combine_classes';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  className, value, label, props: { onClick },
}: Page) => (
  <LightButton
    className={className}
    label={label}
    onClick={onClick}
  >
    {value}
  </LightButton>
);

/* istanbul ignore next: class has only props default */
@ComponentBindings()
export class PageProps {
  @OneWay() index = 0;

  /* istanbul ignore next: EventCallback cannot be tested */
  @Event() onClick?: EventCallback;

  @OneWay() selected = false;

  @OneWay() className?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Page extends JSXComponent<PageProps>() {
  get label(): string {
    return `Page ${this.value}`;
  }

  get value(): number {
    return this.props.index + 1;
  }

  get className(): string {
    const
      { selected } = this.props;
    return combineClasses({
      [PAGER_PAGE_CLASS]: true,
      [`${this.props.className}`]: !!this.props.className,
      [PAGER_SELECTION_CLASS]: !!selected,
    });
  }
}
