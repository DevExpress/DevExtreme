import CollectionItem from "../internal/collectionItem";

const CLASS = {
  focused: 'dx-state-focused',
};

export default class TabItem extends CollectionItem{
  isFocused: Promise<boolean>;

  constructor(element: Selector) {
    super(element);

    this.isFocused = element.hasClass(CLASS.focused);
  }
}
