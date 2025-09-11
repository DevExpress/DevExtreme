import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';

export interface CollectionItemProps {
  value: string;
  isSelected: boolean;
}

export class ItemComponent extends BaseInfernoComponent<CollectionItemProps> {
  render(): JSX.Element {
    const { value, isSelected } = this.props;
    const className = `dx-item ${isSelected ? ' dx-item-selected' : ''}`;

    return (
      <div className={className}>
        {value}
      </div>
    );
  }
}
