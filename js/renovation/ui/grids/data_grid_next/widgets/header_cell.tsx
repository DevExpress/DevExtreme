import {
  Component, JSXComponent, ComponentBindings, OneWay, JSXTemplate, Template,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';

import CLASSES from '../classes';

import { ColumnInternal } from '../types';

export const viewFunction = ({
  props: { column, columnIndex, headerTemplate: HeaderTemplate },
  classes,
  contentClasses,
}: HeaderCell): JSX.Element => (
  <td
    aria-selected="false"
    role="columnheader" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
    // TODO uncomment after https://trello.com/c/kVXfSWI7
    // aria-colindex={index + 1}
    id={`dx-col-${columnIndex + 1}`}
    aria-label={`Column ${column.caption}`}
    className={classes}
    aria-sort="none"
    tabIndex={0}
    style={{ textAlign: column.alignment }}
  >
    <div className={contentClasses} role="presentation">
      {HeaderTemplate ? <HeaderTemplate /> : column.caption}
    </div>
  </td>
);

@ComponentBindings()
export class HeaderCellProps {
  @OneWay()
  column!: ColumnInternal;

  @OneWay()
  columnIndex = 0;

  @Template()
  headerTemplate?: JSXTemplate;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderCell extends JSXComponent<HeaderCellProps, 'column'>(HeaderCellProps) {
  get classes(): string {
    const classesMap = {
      [CLASSES.action]: true,
      [CLASSES.cellFocusDisabled]: true,
      [this.props.column.cssClass ?? '']: true,
      [this.props.column.headerCssClass ?? '']: true,
    };

    return combineClasses(classesMap);
  }

  get contentClasses(): string {
    const { alignment } = this.props.column;

    const classesMap = {
      [CLASSES.textContent]: true,
      [CLASSES.textContentAlignmentLeft]: alignment !== 'right',
      [CLASSES.textContentAlignmentRight]: alignment !== 'left',
    };

    return combineClasses(classesMap);
  }
}
