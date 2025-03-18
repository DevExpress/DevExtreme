/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
import type { DeferredObj } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { SubsGets } from '@ts/core/reactive/index';
import { computed, effect } from '@ts/core/reactive/index';
import { DataController } from '@ts/grids/new/grid_core/data_controller';
import Selection from '@ts/ui/selection/m_selection';

import type { DataObject, Key } from '../data_controller/types';
import { ItemsController } from '../items_controller/items_controller';
import { OptionsController } from '../options_controller/options_controller';
import type { SelectionChangedEvent, SelectionOptions } from './types';

export class SelectionController {
  public static dependencies = [OptionsController, DataController, ItemsController] as const;

  private readonly selectedCardKeys = this.options.twoWay('selectedCardKeys');

  private readonly selectionOption: SubsGets<SelectionOptions> = this.options.oneWay('selection');

  private readonly selectionHelper: SubsGets<Selection | undefined>;

  constructor(
    private readonly options: OptionsController,
    private readonly dataController: DataController,
    private readonly itemsController: ItemsController,
  ) {
    this.selectionHelper = computed(
      (
        dataSource,
        selectionOption,
      ) => {
        if (selectionOption.mode === 'none') {
          return undefined;
        }

        const selectionConfig = this.getSelectionConfig(
          dataSource,
          selectionOption,
        );

        return new Selection(selectionConfig);
      },
      [
        this.dataController.dataSource,
        this.selectionOption,
      ],
    );

    effect((selectedCardKeys, selectionOption) => {
      if (selectionOption.mode !== 'none') {
        this.itemsController.setSelectionState(selectedCardKeys);
      }
    }, [this.selectedCardKeys, this.selectionOption]);
  }

  private getSelectionConfig(dataSource, selectionOption): object {
    const selectedCardKeys = this.selectedCardKeys.unreactive_get();
    const { itemsController } = this;

    return {
      selectedKeys: selectedCardKeys,
      mode: selectionOption.mode,
      maxFilterLengthInRequest: selectionOption.maxFilterLengthInRequest,
      ignoreDisabledItems: true,
      key() {
        return dataSource.key();
      },
      keyOf(item) {
        return dataSource.store().keyOf(item);
      },
      dataFields() {
        return dataSource.select();
      },
      load(options) {
        return dataSource.load(options);
      },
      plainItems() {
        return itemsController.items.unreactive_get();
      },
      isItemSelected(item) {
        return item.isSelected;
      },
      isSelectableItem(item) {
        return !!item?.data;
      },
      getItemData(item) {
        return item?.data ?? item;
      },
      filter() {
        // TODO Salimov: Need to take combined filter
        return dataSource.filter();
      },
      totalCount: () => dataSource.totalCount(),
      getLoadOptions(loadItemIndex, focusedItemIndex, shiftItemIndex) {
        const { sort, filter } = dataSource.loadOptions();
        let minIndex = Math.min(loadItemIndex, focusedItemIndex);
        let maxIndex = Math.max(loadItemIndex, focusedItemIndex);

        if (isDefined(shiftItemIndex)) {
          minIndex = Math.min(shiftItemIndex, minIndex);
          maxIndex = Math.max(shiftItemIndex, maxIndex);
        }

        const take = maxIndex - minIndex + 1;

        return {
          skip: minIndex,
          take,
          filter,
          sort,
        };
      },
      onSelectionChanged: this.onSelectionChanged.bind(this),
    };
  }

  private onSelectionChanged(e: SelectionChangedEvent): void {
    this.selectedCardKeys.update([...e.selectedItemKeys]);
  }

  public changeCardSelection(cardIndex: number, options: { control: boolean }): void {
    const selectionHelper = this.selectionHelper?.unreactive_get();

    selectionHelper?.changeItemSelection(cardIndex, options, false);
  }

  public selectCards(keys: Key[], preserve = false): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper?.unreactive_get();

    return selectionHelper?.selectedItemKeys(keys, preserve);
  }

  public isCardSelected(key: Key): boolean {
    const selectedCardKeys = this.selectedCardKeys.unreactive_get();

    return selectedCardKeys.includes(key);
  }

  public clearSelection(): void {
    this.selectedCardKeys.update([]);
  }

  public getSelectedCardKeys(): Key[] {
    return this.selectedCardKeys.unreactive_get();
  }
}
