import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Template,
} from 'devextreme-generator/component_declaration/common';
import { getGroupCellClasses } from '../utils';
import { ContentTemplateProps } from '../types.d';

export const viewFunction = (viewModel: CellBase): JSX.Element => {
  const ContentTemplate = viewModel.props.contentTemplate;

  return (
    <td
    // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
      className={viewModel.classes}
    >
      {!ContentTemplate && viewModel.props.children}
      {ContentTemplate && (
        <ContentTemplate
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...viewModel.props.contentTemplateProps!}
        />
      )}
    </td>
  );
};

@ComponentBindings()
export class CellBaseProps {
  @OneWay() className? = '';

  @OneWay() isFirstCell? = false;

  @OneWay() isLastCell? = false;

  @OneWay() startDate?: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() allDay?: boolean = false;

  @OneWay() groups?: object;

  @OneWay() groupIndex?: number;

  @OneWay() text?: string = '';

  @OneWay() index = 0;

  @OneWay() contentTemplateProps?: ContentTemplateProps;

  @Template() contentTemplate?: any;

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class CellBase extends JSXComponent(CellBaseProps) {
  get classes(): string {
    return getGroupCellClasses(this.props.isFirstCell, this.props.isLastCell, this.props.className);
  }
}
