import {
  Component, ComponentBindings, JSXComponent, OneWay, Event,
} from 'devextreme-generator/component_declaration/common';
import LightButton from './light-button';

const PAGER_PAGE_CLASS = 'dx-page';
const PAGER_SELECTION_CLASS = 'dx-selection';
const PAGER_PAGE_SELECTION_CLASS = `${PAGER_PAGE_CLASS} ${PAGER_SELECTION_CLASS}`;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  className, value, label, props: { key, onClick },
}: Page) => (
  <LightButton key={key} className={className} label={label} onClick={onClick}>
    {value}
  </LightButton>
);

@ComponentBindings()
export class PageProps {
  @OneWay() index = 0;

  @OneWay() key?: string;

  @Event() onClick?: () => void;

  @OneWay() selected?: boolean = false;
}

// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export default class Page extends JSXComponent<PageProps> {
  get label(): string {
    return `Page ${this.value}`;
  }

  get value(): number {
    return this.props.index + 1;
  }

  get className(): string {
    const
      { selected } = this.props;
    return selected ? PAGER_PAGE_SELECTION_CLASS : PAGER_PAGE_CLASS;
  }
}
