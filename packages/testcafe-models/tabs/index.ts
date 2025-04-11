import type { WidgetName } from '../types';
import TabItem from './item';
import Collection from "../internal/collection";

export default class Tabs extends Collection<TabItem> {
  public static className = '.dx-tabs';

  itemClassName = '.dx-tab';

  ItemClass = TabItem;

  getName(): WidgetName { return 'dxTabs'; }
}
