import { isCommandKeyPressed } from '@js/common/core/events/utils/index';
import type { ValueChangedEvent } from '@js/ui/check_box';
import type * as dxToolbar from '@js/ui/toolbar';
import { isDefined } from '@ts/core/utils/m_type';
import type { CardInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import { Toolbar } from '@ts/grids/new/grid_core/inferno_wrappers/toolbar';
import type { ComponentType } from 'inferno';
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

export interface CardHeaderProps {
  items?: (string | dxToolbar.Item)[];
  allowUpdating?: boolean;
  allowDeleting?: boolean;
  visible?: boolean;
  captionExpr?: string;
  template?: ComponentType<{ card: CardInfo }>;
  card: CardInfo;
  isCheckBoxesRendered?: boolean;
  selectCard?: (card: CardInfo, options: SelectCardOptions) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export class CardHeader extends Component<CardHeaderProps> {
  private getCheckBoxItem(): dxToolbar.Item | null {
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
      visible: visibleProp,
      items = [],
      captionExpr,
      template: Template,
      card,
      allowUpdating,
      allowDeleting,
      onEdit,
      onDelete,
    } = this.props;

    const checkBoxItem = this.getCheckBoxItem();

    const captionItem: dxToolbar.Item | null = captionExpr && card?.[captionExpr]
      ? { location: 'before', text: card[captionExpr] }
      : null;

    const updateButton: dxToolbar.Item | null = allowUpdating
      ? { location: 'after', widget: 'dxButton', options: { icon: 'edit', onClick: onEdit, stylingMode: 'text' } }
      : null;

    const deleteButton: dxToolbar.Item | null = allowDeleting
      ? { location: 'after', widget: 'dxButton', options: { icon: 'remove', onClick: onDelete, stylingMode: 'text' } }
      : null;

    const finalItems = [checkBoxItem, captionItem, updateButton, deleteButton, ...items]
      .filter((item): item is dxToolbar.Item => !!item);

    const visible = isDefined(visibleProp)
      ? visibleProp
      : !!finalItems.length;

    if (!visible) {
      return <></>;
    }

    return (
      <div className={CLASSES.cardHeader}>
        {Template
          ? <Template card={card}/>
          : <Toolbar items={finalItems} />
        }
      </div>
    );
  }
}
