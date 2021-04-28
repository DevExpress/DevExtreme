import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../../../utils/combine_classes';
import { HeaderCell } from '../../header_cell';
import { GroupPanelCellProps } from '../cell_props';

export const viewFunction = ({
  classes,
  props: {
    cellTemplate: CellTemplate,
    data,
    id,
    color,
    text,
    index,
    colSpan,
  },
}: GroupPanelHorizontalCell): JSX.Element => (
  <HeaderCell
    className={classes}
    colSpan={colSpan}
  >
    <div className="dx-scheduler-group-header-content">
      {!!CellTemplate && (
        <CellTemplate
          data={{
            data, id, color, text,
          }}
          index={index}
        />
      )}
      {!CellTemplate && (
        <div>
          {text}
        </div>
      )}
    </div>
  </HeaderCell>
);

@ComponentBindings()
export class GroupPanelHorizontalCellProps extends GroupPanelCellProps {
  @OneWay() isFirstGroupCell = false;

  @OneWay() isLastGroupCell = false;

  @OneWay() colSpan = 1;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelHorizontalCell extends JSXComponent(GroupPanelHorizontalCellProps) {
  get classes(): string {
    const { isFirstGroupCell, isLastGroupCell, className } = this.props;

    return combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-first-group-cell': isFirstGroupCell,
      'dx-scheduler-last-group-cell': isLastGroupCell,
      [className]: !!className,
    });
  }
}
