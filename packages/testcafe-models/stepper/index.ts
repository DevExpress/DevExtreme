import type { WidgetName } from '../types';
import Collection from "../internal/collection";
import CollectionItem from "../internal/collectionItem";

export default class Stepper extends Collection {
  public static className = '.dx-stepper';

  itemClassName = '.dx-step';

  ItemClass = CollectionItem;

  getName(): WidgetName { return 'dxStepper'; }
}
