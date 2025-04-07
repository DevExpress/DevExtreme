import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { Toolbar } from '@ts/grids/new/grid_core/inferno_wrappers/toolbar';
import { Component } from 'inferno';

export const CLASSES = {
  cardHeader: 'dx-cardview-card-header',
};

export interface CardHeaderItem {
  location: 'before' | 'after';
  widget?: string;
  text?: string;
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
  row?: DataRow;
  onEdit?: () => void;
  onDelete?: () => void;
}

export class CardHeader extends Component<CardHeaderProps> {
  render(): JSX.Element | null {
    const {
      visible = true,
      items = [],
      captionExpr,
      template,
      row,
      allowUpdating,
      onEdit,
      onDelete,
    } = this.props;

    if (!visible) {
      return null;
    }

    const captionItem: CardHeaderItem | null = captionExpr && row?.[captionExpr]
      ? { location: 'before', text: row[captionExpr] }
      : null;

    const updateButton: CardHeaderItem | null = allowUpdating
      ? { location: 'after', widget: 'dxButton', options: { icon: 'edit', onClick: onEdit } }
      : null;

    const deleteButton: CardHeaderItem | null = allowUpdating
      ? { location: 'after', widget: 'dxButton', options: { icon: 'remove', onClick: onDelete } }
      : null;

    const finalItems = [captionItem, updateButton, deleteButton, ...items]
      .filter((item): item is CardHeaderItem => !!item);

    if (template) {
      return template(finalItems);
    }

    return (
      <div className={CLASSES.cardHeader}>
        <Toolbar items={finalItems} />
      </div>
    );
  }
}
