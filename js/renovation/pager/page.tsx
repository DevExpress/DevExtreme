import {
  Component, ComponentBindings, JSXComponent, OneWay, Event,
} from 'devextreme-generator/component_declaration/common';

import { LightButton } from './light-button';
import { PAGER_PAGE_CLASS, PAGER_SELECTION_CLASS } from './consts';

const PAGER_PAGE_SELECTION_CLASS = `${PAGER_PAGE_CLASS} ${PAGER_SELECTION_CLASS}`;
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

@ComponentBindings()
export class PageProps {
  @OneWay() index = 0;

  @Event() onClick?: () => void;

  @OneWay() selected? = false;

  @OneWay() className?: string;
}

// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Page extends JSXComponent(PageProps) {
  get label(): string {
    return `Page ${this.value}`;
  }

  get value(): number {
    return this.props.index + 1;
  }

  get className(): string {
    const
      { selected } = this.props;
    return ([selected ? PAGER_PAGE_SELECTION_CLASS : PAGER_PAGE_CLASS, this.props.className].join(' ')).trim();
  }
}
