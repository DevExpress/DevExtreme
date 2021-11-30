import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
} from '@devextreme-generator/declarations';
import { getGroupCellClasses } from '../utils';
import { ContentTemplateProps } from '../types';

export const viewFunction = (viewModel: CellBase): JSX.Element => (
  <td
    className={viewModel.classes}
    aria-label={viewModel.props.ariaLabel}
  >
    {viewModel.props.children}
  </td>
);

@ComponentBindings()
export class CellBaseProps {
  @OneWay() className = '';

  @OneWay() isFirstGroupCell? = false;

  @OneWay() isLastGroupCell? = false;

  @OneWay() startDate = new Date();

  @OneWay() endDate = new Date();

  @OneWay() allDay?: boolean = false;

  @OneWay() groups?: Record<string, unknown>;

  @OneWay() groupIndex?: number;

  @OneWay() text?: string = '';

  @OneWay() index = 0;

  @OneWay() contentTemplateProps: ContentTemplateProps = {
    data: {},
    index: 0,
  };

  @OneWay() ariaLabel?: string;

  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class CellBase extends JSXComponent(CellBaseProps) {
  get classes(): string {
    const { isFirstGroupCell, isLastGroupCell, className } = this.props;

    return getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className);
  }
}
