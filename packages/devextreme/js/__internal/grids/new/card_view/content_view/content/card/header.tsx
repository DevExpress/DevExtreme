import { isCommandKeyPressed } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/localization/message';
import type { ValueChangedEvent } from '@js/ui/check_box';
import type * as dxToolbar from '@js/ui/toolbar';
import { isDefined } from '@ts/core/utils/m_type';
import type { SelectCardOptions } from '@ts/grids/new/card_view/content_view/types';
import type { CardInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import { Toolbar } from '@ts/grids/new/grid_core/inferno_wrappers/toolbar';
import type { DefaultToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';
import { normalizeToolbarItems } from '@ts/grids/new/grid_core/toolbar/utils';
import type { ComponentType } from 'inferno';
import { Component } from 'inferno';

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
  private getCheckBoxItem(): dxToolbar.Item & { name: string } | null {
    const { isCheckBoxesRendered, selectCard, card } = this.props;

    if (card && isCheckBoxesRendered) {
      return {
        location: 'before',
        name: 'selectionCheckBox',
        widget: 'dxCheckBox',
        cssClass: CLASSES.cardSelectCheckBox,
        options: {
          elementAttr: {
            'aria-label': messageLocalization.format('dxCardView-ariaSelectCard'),
          },
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

  getDefaultToolbarItems(): DefaultToolbarItem[] {
    const {
      captionExpr,
      card,
      allowUpdating,
      allowDeleting,
      onEdit,
      onDelete,
    } = this.props;

    const checkBoxItem = this.getCheckBoxItem();

    const captionItem = !!captionExpr && card?.[captionExpr] && {
      name: 'caption',
      location: 'before',
      text: card[captionExpr],
    } satisfies dxToolbar.Item & { name: string };

    const updateButton = allowUpdating && {
      name: 'updateButton',
      location: 'after',
      widget: 'dxButton',
      options: { icon: 'edit', onClick: onEdit, stylingMode: 'text' },
    } satisfies dxToolbar.Item & { name: string };

    const deleteButton = allowDeleting && {
      name: 'deleteButton',
      location: 'after',
      widget: 'dxButton',
      options: { icon: 'trash', onClick: onDelete, stylingMode: 'text' },
    } satisfies dxToolbar.Item & { name: string };

    const items = [checkBoxItem, captionItem, updateButton, deleteButton]
      .filter((item): item is dxToolbar.Item => !!item);

    // TODO: fix typings
    return items as DefaultToolbarItem[];
  }

  render(): JSX.Element | null {
    const {
      visible: visibleProp,
      items: userToolbarItems,
      template: Template,
      card,
    } = this.props;

    const toolbarItems = normalizeToolbarItems(
      this.getDefaultToolbarItems(),
      userToolbarItems,
      ['caption', 'selectionCheckBox', 'updateButton', 'deleteButton'],
    );

    const visible = isDefined(visibleProp)
      ? visibleProp
      : !!toolbarItems.length;

    if (!visible) {
      return <></>;
    }

    return (
      <div className={CLASSES.cardHeader}>
        {Template
          ? <Template card={card}/>
          : <Toolbar items={toolbarItems} />
        }
      </div>
    );
  }
}
