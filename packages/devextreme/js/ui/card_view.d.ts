import {GridBase, GridBaseOptions} from '../common/grids';
import { Item as ToolbarItem} from '@js/ui/toolbar'

export interface CardView extends GridBase {

}

export interface Properties extends GridBaseOptions<CardView> {
  toolbarItems?: (ToolbarItem | string)[];
}