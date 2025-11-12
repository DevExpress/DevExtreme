import { computed } from '@ts/core/state_manager/index';
import { ItemsController as ItemsControllerBase } from '@ts/grids/new/grid_core/items_controller/items_controller';

export class ItemsController extends ItemsControllerBase {
  public override readonly items = computed(
    () => {
      // NOTE: We should trigger computed by search options change,
      // But all work with these options encapsulated in SearchHighlightTextProcessor
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.searchController.highlightTextOptions.value;

      return this.dataController.items.value.map(
        (item, itemIndex) => this.createCardInfo(
          item,
          this.columnsController.visibleColumns.peek(),
          itemIndex,
          this.selectedCardKeys.value,
        ),
      ).concat(
        this.additionalItems.value,
      );
    },
  );
}
