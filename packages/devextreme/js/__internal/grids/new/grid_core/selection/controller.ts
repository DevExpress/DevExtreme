/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import type { DeferredObj } from '@js/core/utils/deferred';
import messageLocalization from '@js/localization/message';
import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed, effect, signal } from '@ts/core/state_manager/index';
import { DataController } from '@ts/grids/new/grid_core/data_controller/index';
import { OptionsValidationController } from '@ts/grids/new/grid_core/options_validation/index';
import { ShowCheckBoxesMode } from '@ts/grids/new/grid_core/selection/const';
import Selection from '@ts/ui/selection/selection';

import type { CardInfo } from '../columns_controller/types';
import type { DataObject, Key } from '../data_controller/types';
import { ItemsController } from '../items_controller/items_controller';
import { OptionsController } from '../options_controller/options_controller';
import { ToolbarController } from '../toolbar/controller';
import { SelectionMode } from './const';
import type {
  SelectedCardKeys, SelectionEventInfo, SelectionOptions,
} from './types';

export class SelectionController {
  public static dependencies = [
    OptionsController,
    DataController,
    ItemsController,
    ToolbarController,
    OptionsValidationController,
  ] as const;

  private readonly selectedCardKeys = this.options.twoWay('selectedCardKeys');

  // Note: moved option validation logic to computed to make it execute before other effects
  private readonly normalizedSelectedCardKeys = computed(() => {
    const selectedCardKeys = this.selectedCardKeys.value;
    const isSelectionEnabled = this.selectionOption.value.mode !== SelectionMode.None;

    if (isSelectionEnabled && Array.isArray(selectedCardKeys) && selectedCardKeys.length) {
      this.optionsValidationController.validateKeyExpr();
    }

    return this.selectedCardKeys.value;
  });

  private readonly selectionOption: ReadonlySignal<SelectionOptions> = this.options.oneWay('selection');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly selectionHelper: ReadonlySignal<Selection<any, any, false> | undefined>;

  private readonly _isCheckBoxesRendered = signal<boolean>(false);

  private readonly onSelectionChanging = this.options.action('onSelectionChanging');

  private readonly onSelectionChanged = this.options.action('onSelectionChanged');

  public readonly isCheckBoxesRendered = computed(() => {
    const selectionMode = this.options.oneWay('selection.mode').value;
    const showCheckBoxesMode = this.options.oneWay('selection.showCheckBoxesMode').value;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _isCheckBoxesRendered = this._isCheckBoxesRendered.value;
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
  });

  public readonly _isCheckBoxesVisible = signal<boolean>(false);

  public readonly isCheckBoxesVisible = computed(() => {
    const { mode, showCheckBoxesMode } = this.selectionOption.value;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _isCheckBoxesVisible = this._isCheckBoxesVisible.value;

    if (mode === SelectionMode.Multiple) {
      return showCheckBoxesMode !== ShowCheckBoxesMode.OnClick || _isCheckBoxesVisible;
    }

    return false;
  });

  public readonly needToHiddenCheckBoxes = computed(() => {
    const { mode, showCheckBoxesMode } = this.selectionOption.value;
    const isCheckBoxesVisible = this.isCheckBoxesVisible.value;

    if (mode === SelectionMode.Multiple && showCheckBoxesMode === ShowCheckBoxesMode.OnClick) {
      return !isCheckBoxesVisible;
    }

    return false;
  });

  public readonly allowSelectOnClick = computed(() => {
    const { mode, showCheckBoxesMode } = this.selectionOption.value;

    return mode !== SelectionMode.Multiple || showCheckBoxesMode !== ShowCheckBoxesMode.Always;
  });

  public readonly needToAddSelectionButtons = computed(() => {
    const selectionMode = this.options.oneWay('selection.mode').value;
    const allowSelectAll = this.options.oneWay('selection.allowSelectAll').value;
    return selectionMode === SelectionMode.Multiple && allowSelectAll;
  });

  constructor(
    private readonly options: OptionsController,
    private readonly dataController: DataController,
    private readonly itemsController: ItemsController,
    private readonly toolbarController: ToolbarController,
    private readonly optionsValidationController: OptionsValidationController,
  ) {
    this.selectionHelper = computed(() => {
      const dataSource = this.dataController.dataSource.value;
      const selectionOption = this.selectionOption.value;

      if (selectionOption.mode === SelectionMode.None) {
        return undefined;
      }

      const selectionConfig = this.getSelectionConfig(
        dataSource,
        selectionOption,
      );

      return new Selection(selectionConfig);
    });

    effect(() => {
      const selectedCardKeys = this.normalizedSelectedCardKeys.value;
      const selectionOption = this.selectionOption.value;
      if (selectionOption.mode !== SelectionMode.None) {
        this.itemsController.setSelectionState(selectedCardKeys);

        if (selectedCardKeys.length > 1) {
          this._isCheckBoxesVisible.value = true;
        } else if (selectedCardKeys.length === 0) {
          this._isCheckBoxesVisible.value = false;
        }
      }
    });

    effect(() => {
      /*
      TODO: subscription to selectionHelper to update keys if it is reinitialized.
      Need to get rid of `selectionHelper.peek()` inside of selectCards()
      and pass selectionHelper from here
      */
      const selectionHelper = this.selectionHelper.value;
      const isLoaded = this.dataController.isLoaded.value;
      if (isLoaded) {
        const keys = this.selectedCardKeys.value;
        const hasExactSelectedItems = selectionHelper?.hasExactSelectedItems(keys);

        if (!hasExactSelectedItems) {
          this.selectCards(keys);
        }
      }
    });

    effect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.dataController.items.value;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.dataController.isLoaded.value;
      this.updateSelectionToolbarButtons(this.normalizedSelectedCardKeys.value);
    });
  }

  private getSelectionConfig(dataSource, selectionOption): object {
    const selectedCardKeys = this.selectedCardKeys.peek();
    const { dataController } = this;

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
        return dataSource.store().load(options);
      },
      plainItems() {
        return dataSource.items();
      },
      filter() {
        return dataController.getCombinedFilter();
      },
      totalCount: () => dataSource.totalCount(),
      onSelectionChanging: this.selectionChanging.bind(this),
      onSelectionChanged: this.selectionChanged.bind(this),
    };
  }

  private getSelectionEventArgs(e): SelectionEventInfo {
    return {
      currentSelectedCardKeys: [...e.addedItemKeys],
      currentDeselectedCardKeys: [...e.removedItemKeys],
      selectedCardKeys: [...e.selectedItemKeys],
      selectedCardsData: [...e.selectedItems],
      isSelectAll: false,
      isDeselectAll: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private selectionChanging(e: any): void {
    if (e.addedItemKeys.length || e.removedItemKeys.length) {
      const onSelectionChanging = this.onSelectionChanging.peek();
      const eventArgs = {
        ...this.getSelectionEventArgs(e),
        cancel: false,
      };

      // @ts-expect-error
      onSelectionChanging?.(eventArgs);
      e.cancel = eventArgs.cancel;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private selectionChanged(e: any): void {
    if (e.addedItemKeys.length || e.removedItemKeys.length) {
      this.optionsValidationController.validateKeyExpr();

      const onSelectionChanged = this.onSelectionChanged.peek();
      const eventArgs = this.getSelectionEventArgs(e);

      this.selectedCardKeys.value = [...e.selectedItemKeys];

      // @ts-expect-error
      onSelectionChanged?.(eventArgs);
    }
  }

  private isOnePageSelectAll(): boolean {
    const selectionOption = this.selectionOption.peek();

    return selectionOption?.selectAllMode === 'page';
  }

  private isSelectAll(): boolean | undefined {
    const selectionHelper = this.selectionHelper.peek();

    return selectionHelper?.getSelectAllState(this.isOnePageSelectAll());
  }

  private updateSelectionToolbarButtons(
    selectedCardKeys: SelectedCardKeys,
  ) {
    const isSelectAll = this.isSelectAll();
    const isOnePageSelectAll = this.isOnePageSelectAll();

    this.toolbarController.addDefaultItem(signal({
      name: 'selectAllButton',
      widget: 'dxButton',
      options: {
        icon: 'selectall',
        onClick: () => {
          this.selectAll();
        },
        disabled: !!isSelectAll,
        text: messageLocalization.format('dxCardView-selectAll'),
      },
      location: 'before',
      locateInMenu: 'auto',
    }), this.needToAddSelectionButtons);
    this.toolbarController.addDefaultItem(signal({
      name: 'clearSelectionButton',
      widget: 'dxButton',
      options: {
        icon: 'close',
        onClick: () => {
          this.deselectAll();
        },
        disabled: isOnePageSelectAll ? isSelectAll === false : selectedCardKeys.length === 0,
        text: messageLocalization.format('dxCardView-clearSelection'),
      },
      location: 'before',
      locateInMenu: 'auto',
    }), this.needToAddSelectionButtons);
  }

  private getItemKeysByIndexes(indexes: number[]): Key[] {
    const items = this.itemsController.items.peek();

    return indexes
      .map((index) => items[index]?.key)
      .filter((key) => key !== undefined);
  }

  public changeCardSelection(
    cardIndex: number,
    options?: { control?: boolean; shift?: boolean },
  ): void {
    const selectionHelper = this.selectionHelper?.peek();
    const isCheckBoxesVisible = this.isCheckBoxesVisible.peek();
    const keys = options ?? {};

    if (isCheckBoxesVisible) {
      keys.control = isCheckBoxesVisible;
    }

    selectionHelper?.changeItemSelection(cardIndex, keys, false);
  }

  public selectCards(keys: Key[], preserve = false): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper?.peek();

    return selectionHelper?.selectedItemKeys(keys, preserve);
  }

  public selectCardsByIndexes(indexes: number[]): DeferredObj<unknown> | undefined {
    const keys = this.getItemKeysByIndexes(indexes);

    return this.selectCards(keys);
  }

  public deselectCards(keys: Key[]): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper?.peek();

    return selectionHelper?.selectedItemKeys(keys, true, true);
  }

  public deselectCardsByIndexes(indexes: number[]): DeferredObj<unknown> | undefined {
    const keys = this.getItemKeysByIndexes(indexes);

    return this.deselectCards(keys);
  }

  public isCardSelected(key: Key): boolean {
    const selectedCardKeys = this.normalizedSelectedCardKeys.peek();

    return selectedCardKeys.includes(key);
  }

  public selectAll(): DeferredObj<unknown> | undefined {
    const { mode } = this.selectionOption.peek();

    if (mode !== SelectionMode.Multiple) {
      return undefined;
    }

    const selectionHelper = this.selectionHelper.peek();

    return selectionHelper?.selectAll(this.isOnePageSelectAll());
  }

  public deselectAll(): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper.peek();

    return selectionHelper?.deselectAll(this.isOnePageSelectAll());
  }

  public clearSelection(): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper.peek();

    return selectionHelper?.clearSelection();
  }

  public getSelectedCardsData(): DataObject[] {
    // @ts-expect-error undefined is not assignable to DataObject[]
    return this.selectionHelper?.peek()?.getSelectedItems();
  }

  public getSelectedCardKeys(): Key[] {
    return this.normalizedSelectedCardKeys.peek();
  }

  private toggleSelectionCheckBoxes(): void {
    const isCheckBoxesRendered = this._isCheckBoxesRendered.peek();

    this._isCheckBoxesRendered.value = !isCheckBoxesRendered;
  }

  public updateSelectionCheckBoxesVisible(value: boolean): void {
    this._isCheckBoxesVisible.value = value;
  }

  public processLongTap(card: CardInfo): void {
    const { mode, showCheckBoxesMode } = this.selectionOption.peek();

    if (mode !== SelectionMode.None) {
      if (showCheckBoxesMode === ShowCheckBoxesMode.OnLongTap) {
        this.toggleSelectionCheckBoxes();
      } else {
        if (showCheckBoxesMode === ShowCheckBoxesMode.OnClick) {
          this._isCheckBoxesVisible.value = true;
        }
        if (showCheckBoxesMode !== ShowCheckBoxesMode.Always) {
          this.changeCardSelection(card.index, { control: true });
        }
      }
    }
  }
}
