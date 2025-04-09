/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
import type { DeferredObj } from '@js/core/utils/deferred';
import messageLocalization from '@js/localization/message';
import type { SubsGets } from '@ts/core/reactive/index';
import { computed, effect, state } from '@ts/core/reactive/index';
import { DataController } from '@ts/grids/new/grid_core/data_controller/index';
import { ShowCheckBoxesMode } from '@ts/grids/new/grid_core/selection/const';
import Selection from '@ts/ui/selection/m_selection';

import type { DataRow } from '../columns_controller/types';
import type { Key } from '../data_controller/types';
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
  ] as const;

  private readonly selectedCardKeys = this.options.twoWay('selectedCardKeys');

  private readonly selectionOption: SubsGets<SelectionOptions> = this.options.oneWay('selection');

  private readonly selectionHelper: SubsGets<Selection | undefined>;

  private readonly _isCheckBoxesRendered = state<boolean>(false);

  private readonly onSelectionChanging = this.options.action('onSelectionChanging');

  private readonly onSelectionChanged = this.options.action('onSelectionChanged');

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
    (selectionOption, _isCheckBoxesVisible) => {
      const { mode, showCheckBoxesMode } = selectionOption;

      if (mode === SelectionMode.Multiple) {
        return showCheckBoxesMode !== ShowCheckBoxesMode.OnClick || _isCheckBoxesVisible;
      }

      return false;
    },
    [
      this.selectionOption,
      this._isCheckBoxesVisible,
    ],
  );

  public readonly needToHiddenCheckBoxes = computed(
    (isCheckBoxesVisible, selectionOption) => {
      const { mode, showCheckBoxesMode } = selectionOption;

      if (mode === SelectionMode.Multiple && showCheckBoxesMode === ShowCheckBoxesMode.OnClick) {
        return !isCheckBoxesVisible;
      }

      return false;
    },
    [
      this.isCheckBoxesVisible,
      this.selectionOption,
    ],
  );

  public readonly allowSelectOnClick = computed(
    (selectionOption) => {
      const { mode, showCheckBoxesMode } = selectionOption;

      return mode !== SelectionMode.Multiple || showCheckBoxesMode !== ShowCheckBoxesMode.Always;
    },
    [this.selectionOption],
  );

  public readonly needToAddSelectionButtons = computed(
    (selectionMode, allowSelectAll) => selectionMode === SelectionMode.Multiple && allowSelectAll,
    [
      this.options.oneWay('selection.mode'),
      this.options.oneWay('selection.allowSelectAll'),
    ],
  );

  constructor(
    private readonly options: OptionsController,
    private readonly dataController: DataController,
    private readonly itemsController: ItemsController,
    private readonly toolbarController: ToolbarController,
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

    effect((isLoaded) => {
      if (isLoaded) {
        const selectedCardKeys = this.selectedCardKeys.unreactive_get();

        this.selectCards(selectedCardKeys);
      }
    }, [this.dataController.isLoaded]);

    effect((selectedCardKeys) => {
      this.updateSelectionToolbarButtons(selectedCardKeys);
    }, [this.selectedCardKeys, this.dataController.items]);
  }

  private getSelectionConfig(dataSource, selectionOption): object {
    const selectedCardKeys = this.selectedCardKeys.unreactive_get();

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
        // TODO Salimov: Need to take combined filter
        return dataSource.filter();
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
      const onSelectionChanging = this.onSelectionChanging.unreactive_get();
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
      const onSelectionChanged = this.onSelectionChanged.unreactive_get();
      const eventArgs = this.getSelectionEventArgs(e);

      this.selectedCardKeys.update([...e.selectedItemKeys]);
      // @ts-expect-error
      onSelectionChanged?.(eventArgs);
    }
  }

  private isOnePageSelectAll(): boolean {
    const selectionOption = this.selectionOption.unreactive_get();

    return selectionOption?.selectAllMode === 'page';
  }

  private isSelectAll(): boolean | undefined {
    const selectionHelper = this.selectionHelper.unreactive_get();

    return selectionHelper?.getSelectAllState(this.isOnePageSelectAll());
  }

  private updateSelectionToolbarButtons(
    selectedCardKeys: SelectedCardKeys,
  ) {
    const isSelectAll = this.isSelectAll();
    const isOnePageSelectAll = this.isOnePageSelectAll();

    this.toolbarController.addDefaultItem({
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
    }, this.needToAddSelectionButtons);
    this.toolbarController.addDefaultItem({
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
    }, this.needToAddSelectionButtons);
  }

  private getItemKeysByIndexes(indexes: number[]): Key[] {
    const items = this.itemsController.items.unreactive_get();

    return indexes
      .map((index) => items[index]?.key)
      .filter((key) => key !== undefined);
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

  public selectCardsByIndexes(indexes: number[]): DeferredObj<unknown> | undefined {
    const keys = this.getItemKeysByIndexes(indexes);

    return this.selectCards(keys);
  }

  public deselectCards(keys: Key[]): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper?.unreactive_get();

    return selectionHelper?.selectedItemKeys(keys, true, true);
  }

  public deselectCardsByIndexes(indexes: number[]): DeferredObj<unknown> | undefined {
    const keys = this.getItemKeysByIndexes(indexes);

    return this.deselectCards(keys);
  }

  public isCardSelected(key: Key): boolean {
    const selectedCardKeys = this.selectedCardKeys.unreactive_get();

    return selectedCardKeys.includes(key);
  }

  public selectAll(): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper.unreactive_get();

    return selectionHelper?.selectAll(this.isOnePageSelectAll());
  }

  public deselectAll(): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper.unreactive_get();

    return selectionHelper?.deselectAll(this.isOnePageSelectAll());
  }

  public clearSelection(): DeferredObj<unknown> | undefined {
    const selectionHelper = this.selectionHelper.unreactive_get();

    return selectionHelper?.clearSelection();
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
