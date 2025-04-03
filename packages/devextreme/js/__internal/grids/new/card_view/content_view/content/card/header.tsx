import type { dxToolbarItem } from '@js/ui/toolbar';
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
  options?: dxToolbarItem;
}

export interface CardHeaderProps {
  items?: CardHeaderItem[];
  visible?: boolean;
  captionExpr?: string;
  template?: (items: CardHeaderItem[]) => JSX.Element;
  row?: DataRow;
}

export class CardHeader extends Component<CardHeaderProps> {
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

    const captionItem: CardHeaderItem | null = captionExpr && row?.[captionExpr]
      ? { location: 'before', text: row[captionExpr] }
      : null;

    const finalItems = captionItem ? [captionItem, ...items] : items;

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
