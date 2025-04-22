import { isCommandKeyPressed } from '@js/common/core/events/utils/index';
import type { ValueChangedEvent } from '@js/ui/check_box';
import type { CardInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import { Toolbar } from '@ts/grids/new/grid_core/inferno_wrappers/toolbar';
import { Component } from 'inferno';

import type { SelectCardOptions } from '../../types';

export const CLASSES = {
  cardHeader: 'dx-cardview-card-header',
  cardSelectCheckBox: 'dx-cardview-select-checkbox',
};

export interface CheckBoxClickEvent {
  event?: MouseEvent;
  card: CardInfo;
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
  allowUpdating?: boolean;
  allowDeleting?: boolean;
  visible?: boolean;
  captionExpr?: string;
  template?: (items: CardHeaderItem[]) => JSX.Element;
  card?: CardInfo;
  isCheckBoxesRendered?: boolean;
  selectCard?: (card: CardInfo, options: SelectCardOptions) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export class CardHeader extends Component<CardHeaderProps> {
  private getCheckBoxItem(): CardHeaderItem | null {
    const { isCheckBoxesRendered, selectCard, card } = this.props;

    if (card && isCheckBoxesRendered) {
      return {
        location: 'before',
        widget: 'dxCheckBox',
        cssClass: CLASSES.cardSelectCheckBox,
        options: {
          value: card.isSelected,
          onValueChanged: (e: ValueChangedEvent): void => {
            const event = e.event as MouseEvent;

            selectCard?.(card, {
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
      card,
      allowUpdating,
      allowDeleting,
      onEdit,
      onDelete,
    } = this.props;

    if (!visible) {
      return null;
    }

    const checkBoxItem = this.getCheckBoxItem();

    const captionItem: CardHeaderItem | null = captionExpr && card?.[captionExpr]
      ? { location: 'before', text: card[captionExpr] }
      : null;

    const updateButton: CardHeaderItem | null = allowUpdating
      ? { location: 'after', widget: 'dxButton', options: { icon: 'edit', onClick: onEdit, stylingMode: 'text' } }
      : null;

    const deleteButton: CardHeaderItem | null = allowDeleting
      ? { location: 'after', widget: 'dxButton', options: { icon: 'remove', onClick: onDelete, stylingMode: 'text' } }
      : null;

    const finalItems = [checkBoxItem, captionItem, updateButton, deleteButton, ...items]
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
