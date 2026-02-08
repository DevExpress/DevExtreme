import Widget from '../internal/widget';
import CollectionItem from "./collectionItem";

export default abstract class Collection<Item extends CollectionItem = CollectionItem> extends Widget {
    protected itemClassName: string;

    protected ItemClass: new (element: Selector) => Item;

    constructor(id: string | Selector) {
        super(id);
    }

    private getItemElements() {
        return this.element.find(this.itemClassName);
    }

    private getItemElementByIndex(index = 0) {
        return this.getItemElements().nth(index);
    }

    public getItem(index = 0): Item {
        return new this.ItemClass(this.getItemElementByIndex(index));
    }
}
