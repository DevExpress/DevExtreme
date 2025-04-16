import { isCommandKeyPressed } from '@js/common/core/events/utils/index';
import type { ValueChangedEvent } from '@js/ui/check_box';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { Toolbar } from '@ts/grids/new/grid_core/inferno_wrappers/toolbar';
import { Component } from 'inferno';

import type { SelectCardOptions } from '../../types';

export const CLASSES = {
  cardHeader: 'dx-cardview-card-header',
  cardSelectCheckBox: 'dx-cardview-select-checkbox',
};

export interface CheckBoxClickEvent {
  event?: MouseEvent;
  row: DataRow;
}

export interface CardHeaderItem {
  location: 'before' | 'after';
  widget?: string;
  text?: string;
  cssClass?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
}

export interface CardHeaderProps {
  items?: CardHeaderItem[];
  visible?: boolean;
  captionExpr?: string;
  template?: (items: CardHeaderItem[]) => JSX.Element;
  row?: DataRow;
  isCheckBoxesRendered?: boolean;
  selectCard?: (row: DataRow, options: SelectCardOptions) => void;
}

export class CardHeader extends Component<CardHeaderProps> {
  private getCheckBoxItem(): CardHeaderItem | null {
    const { isCheckBoxesRendered, selectCard, row } = this.props;

    if (row && isCheckBoxesRendered) {
      return {
        location: 'before',
        widget: 'dxCheckBox',
        cssClass: CLASSES.cardSelectCheckBox,
        options: {
          value: row.isSelected,
          onValueChanged: (e: ValueChangedEvent): void => {
            const event = e.event as MouseEvent;

            selectCard?.(row, {
              control: isCommandKeyPressed(event),
              shift: event.shiftKey,
              needToUpdateCheckboxes: true,
            });
            event.stopPropagation();
          },
        },
      };
    }

    return null;
  }

  render(): JSX.Element | null {
    const {
      visible = true,
      items = [],
      captionExpr,
      template,
      row,
    } = this.props;

    if (!visible) {
      return null;
    }

    const checkBoxItem = this.getCheckBoxItem();

    const captionItem: CardHeaderItem | null = captionExpr && row?.[captionExpr]
      ? { location: 'before', text: row[captionExpr] }
      : null;

    const finalItems = [checkBoxItem, captionItem, ...items]
      .filter((item): item is CardHeaderItem => !!item);

    if (template) {
      return template(finalItems);
    }

    if (!finalItems.length) {
      return <></>;
    }

    return (
      <div className={CLASSES.cardHeader}>
        <Toolbar items={finalItems} />
      </div>
    );
  }
}
