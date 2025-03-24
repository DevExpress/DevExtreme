/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
import type { DeferredObj } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { SubsGets } from '@ts/core/reactive/index';
import { computed, effect, state } from '@ts/core/reactive/index';
import { DataController } from '@ts/grids/new/grid_core/data_controller';
import { ShowCheckBoxesMode } from '@ts/grids/new/grid_core/selection/const';
import Selection from '@ts/ui/selection/m_selection';

import type { DataRow } from '../columns_controller/types';
import type { Key } from '../data_controller/types';
import { ItemsController } from '../items_controller/items_controller';
import { OptionsController } from '../options_controller/options_controller';
import { SelectionMode } from './const';
import type { SelectionChangedEvent, SelectionOptions } from './types';

export class SelectionController {
  public static dependencies = [OptionsController, DataController, ItemsController] as const;

  private readonly selectedCardKeys = this.options.twoWay('selectedCardKeys');

  private readonly selectionOption: SubsGets<SelectionOptions> = this.options.oneWay('selection');

  private readonly selectionHelper: SubsGets<Selection | undefined>;

  private readonly _isCheckBoxesRendered = state<boolean>(false);

  public readonly isCheckBoxesRendered = computed(
    (selectionMode, showCheckBoxesMode, _isCheckBoxesRendered) => {
      if (selectionMode === SelectionMode.Multiple) {
        switch (showCheckBoxesMode) {
          case ShowCheckBoxesMode.Always:
          case ShowCheckBoxesMode.OnClick:
            return true;
          case ShowCheckBoxesMode.OnLongTap:
            return _isCheckBoxesRendered;
          default:
            return false;
        }
      }

      return false;
    },
    [
      this.options.oneWay('selection.mode'),
      this.options.oneWay('selection.showCheckBoxesMode'),
      this._isCheckBoxesRendered,
    ],
  );

  public readonly _isCheckBoxesVisible = state<boolean>(false);

  public readonly isCheckBoxesVisible = computed(
    (isCheckBoxesRendered, _isCheckBoxesVisible) => {
      if (isCheckBoxesRendered) {
        const { showCheckBoxesMode } = this.selectionOption.unreactive_get();

        return showCheckBoxesMode !== ShowCheckBoxesMode.OnClick || _isCheckBoxesVisible;
      }

      return false;
    },
    [
      this.isCheckBoxesRendered,
      this._isCheckBoxesVisible,
    ],
  );

  public readonly needToHiddenCheckBoxes = computed(
    (isCheckBoxesVisible) => {
      const { showCheckBoxesMode } = this.selectionOption.unreactive_get();
      const isCheckBoxesRendered = this.isCheckBoxesRendered.unreactive_get();

      if (isCheckBoxesRendered && showCheckBoxesMode === ShowCheckBoxesMode.OnClick) {
        return !isCheckBoxesVisible;
      }

      return false;
    },
    [
      this.isCheckBoxesVisible,
    ],
  );

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
        if (selectionOption.mode === SelectionMode.None) {
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
      if (selectionOption.mode !== SelectionMode.None) {
        this.itemsController.setSelectionState(selectedCardKeys);

        if (selectedCardKeys.length > 1) {
          this._isCheckBoxesVisible.update(true);
        } else if (selectedCardKeys.length === 0) {
          this._isCheckBoxesVisible.update(false);
        }
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
      alwaysSelectByShift: false,
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

  public changeCardSelection(
    cardIndex: number,
    options?: { control?: boolean; shift?: boolean },
  ): void {
    const selectionHelper = this.selectionHelper?.unreactive_get();
    const isCheckBoxesVisible = this.isCheckBoxesVisible.unreactive_get();
    const keys = options ?? {};

    if (isCheckBoxesVisible) {
      keys.control = isCheckBoxesVisible;
    }

    selectionHelper?.changeItemSelection(cardIndex, keys, false);
  }

  public selectCards(keys: Key[], preserve = false): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper?.unreactive_get();

    return selectionHelper?.selectedItemKeys(keys, preserve);
  }

  public deselectCards(keys: Key[]): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper?.unreactive_get();

    return selectionHelper?.selectedItemKeys(keys, true, true);
  }

  public isCardSelected(key: Key): boolean {
    const selectedCardKeys = this.selectedCardKeys.unreactive_get();

    return selectedCardKeys.includes(key);
  }

  public clearSelection(): void {
    this.selectedCardKeys.update([]);
  }

  public getSelectedCards(): DataRow[] {
    const selectedCardKey = this.getSelectedCardKeys();

    return selectedCardKey
      .map((key) => this.itemsController.getRowByKey(key))
      .filter((item): item is DataRow => !!item);
  }

  public getSelectedCardKeys(): Key[] {
    return this.selectedCardKeys.unreactive_get();
  }

  private toggleSelectionCheckBoxes(): void {
    const isCheckBoxesRendered = this._isCheckBoxesRendered.unreactive_get();

    this._isCheckBoxesRendered.update(!isCheckBoxesRendered);
  }

  public updateSelectionCheckBoxesVisible(value: boolean): void {
    this._isCheckBoxesVisible.update(value);
  }

  public allowSelectOnClick(): boolean {
    const { mode, showCheckBoxesMode } = this.selectionOption.unreactive_get();

    return mode !== SelectionMode.Multiple || showCheckBoxesMode !== ShowCheckBoxesMode.Always;
  }

  public processLongTap(row: DataRow): void {
    const { mode, showCheckBoxesMode } = this.selectionOption.unreactive_get();

    if (mode !== SelectionMode.None) {
      if (showCheckBoxesMode === ShowCheckBoxesMode.OnLongTap) {
        this.toggleSelectionCheckBoxes();
      } else {
        if (showCheckBoxesMode === ShowCheckBoxesMode.OnClick) {
          this._isCheckBoxesVisible.update(true);
        }
        if (showCheckBoxesMode !== ShowCheckBoxesMode.Always) {
          this.changeCardSelection(row.index, { control: true });
        }
      }
    }
  }
}
