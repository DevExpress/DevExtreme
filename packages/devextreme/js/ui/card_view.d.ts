import { Item as ToolbarItem } from './toolbar';
import { GridBase, GridBaseOptions } from '../common/grids';

export interface CardView extends GridBase {

}

export interface CoreProperties extends GridBaseOptions<CardView> {
  toolbarItems?: (ToolbarItem | string)[];

  searchText?: string;
}

export interface Properties extends CoreProperties {
  cardTitle?: string;
}
