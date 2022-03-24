import {
  Component, JSXComponent, ComponentBindings, OneWay, JSXTemplate, Template,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';

import CLASSES from '../classes';

import { ColumnInternal } from '../types';

export const viewFunction = ({
  props: { column, columnIndex, headerTemplate: HeaderTemplate },
  classes,
}: HeaderCell): JSX.Element => (
  <td
    aria-selected="false"
    role="columnheader" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
    // TODO uncomment after https://trello.com/c/kVXfSWI7
    // aria-colindex={index + 1}
    id={`dx-col-${columnIndex + 1}`}
    aria-label={`ColumnInternal ${column.dataField}`}
    className={classes}
    aria-sort="none"
    tabIndex={0}
  >
    <div className={`${CLASSES.textContent} ${CLASSES.textContentAlignmentLeft}`} role="presentation">
      {HeaderTemplate ? <HeaderTemplate /> : column.dataField}
    </div>
  </td>
);

@ComponentBindings()
export class HeaderCellProps {
  @OneWay()
  column: ColumnInternal = {};

  @OneWay()
  columnIndex = 0;

  @OneWay()
  countColumn = 0;

  @Template()
  headerTemplate?: JSXTemplate;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderCell extends JSXComponent(HeaderCellProps) {
  get classes(): string {
    const { columnIndex, countColumn } = this.props;

    const classesMap = {
      [CLASSES.action]: true,
      [CLASSES.cellFocusDisabled]: true,
      [CLASSES.firstChild]: columnIndex === 0,
      [CLASSES.lastChild]: columnIndex === countColumn - 1,
    };

    if (this.props.column.headerCssClass) {
      classesMap[this.props.column.headerCssClass] = true;
    }

    return combineClasses(classesMap);
  }
}
