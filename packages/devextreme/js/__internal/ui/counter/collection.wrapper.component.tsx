import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';
import { ItemComponent } from '@ts/ui/counter/collection.item.component';

export interface CollectionProps {
  items: string[];
  selectedIndex?: number;
}

export class CollectionComponent extends BaseInfernoComponent<CollectionProps> {
  isSelected = (index: number): boolean => index === this.props.selectedIndex;

  render(): JSX.Element {
    // @ts-expect-error ts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.props.children?.({
      ...this.props,
      isSelected: this.isSelected,
    });
  }

/*  render(): JSX.Element {
    const { items, selectedIndex } = this.props;

    return (
      <div className="dx-collection">
         {items.map((item, index) => (
          <ItemComponent
            value={item}
            isSelected={selectedIndex === index}
          />
         ))}
      </div>
    );
  } */
}
