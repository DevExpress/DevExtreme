import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Slot,
  Template,
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
          {...viewModel.props.contentTemplateProps}
        />
      )}
    </td>
  );
};

@ComponentBindings()
export class CellBaseProps {
  @OneWay() className? = '';

  @OneWay() isFirstGroupCell? = false;

  @OneWay() isLastGroupCell? = false;

  @OneWay() startDate: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() allDay?: boolean = false;

  @OneWay() groups?: object;

  @OneWay() groupIndex?: number;

  @OneWay() text?: string = '';

  @OneWay() index = 0;

  @OneWay() contentTemplateProps: ContentTemplateProps = {
    data: {},
    index: 0,
  };

  @Template() contentTemplate?: JSXTemplate;

  @Slot() children?: JSX.Element;
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
