import '@js/ui/validation_summary';
import '@js/ui/validation_group';

import type { EditorStyle } from '@js/common';
import type {
  RequestCallbacks,
  SmartPasteCommandParams,
  SmartPasteCommandResult,
  SmartPasteResultFieldType,
} from '@js/common/ai-integration';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { triggerResizeEvent, triggerShownEvent } from '@js/common/core/events/visibility_change';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import config from '@js/core/config';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import resizeObserverSingleton from '@js/core/resize_observer';
import { ensureDefined } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  isDefined, isEmptyObject, isObject, isString,
} from '@js/core/utils/type';
// @ts-expect-error ts-error
import { defaultScreenFactorFunc, getCurrentScreenFactor, hasWindow } from '@js/core/utils/window';
import type { ChangedOptionInfo, EventInfo } from '@js/events';
import type {
  FieldDataChangedEvent,
  FormItemType,
  GroupItem,
  Item,
  LabelLocation,
  Properties,
  SimpleItemTemplateData,
  SmartPastedEvent,
  SmartPastingEvent,
  TabbedItem,
} from '@js/ui/form';
import { current, isMaterial, isMaterialBased } from '@js/ui/themes';
import type { ValidationResult } from '@js/ui/validation_group';
import errors from '@js/ui/widget/ui.errors';
import { invokeConditionally } from '@ts/core/utils/conditional_invoke';
import { logger } from '@ts/core/utils/m_console';
import type { Component } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeyHandler } from '@ts/core/widget/widget';
import Widget, { FOCUSED_STATE_CLASS } from '@ts/core/widget/widget';
import type { Button } from '@ts/ui/button/button';
import { DROP_DOWN_EDITOR_CLASS } from '@ts/ui/drop_down_editor/m_drop_down_editor';
import Editor from '@ts/ui/editor/editor';
import { setLabelWidthByMaxLabelWidth } from '@ts/ui/form/components/label';
import {
  FIELD_ITEM_CLASS,
  FIELD_ITEM_CONTENT_CLASS,
  FIELD_ITEM_CONTENT_HAS_GROUP_CLASS,
  FIELD_ITEM_CONTENT_HAS_TABS_CLASS,
  FIELD_ITEM_TAB_CLASS,
  FORM_CLASS,
  FORM_FIELD_ITEM_COL_CLASS,
  FORM_GROUP_CAPTION_CLASS,
  FORM_GROUP_CLASS,
  FORM_GROUP_CONTENT_CLASS,
  FORM_GROUP_CUSTOM_CAPTION_CLASS,
  FORM_GROUP_WITH_CAPTION_CLASS,
  FORM_UNDERLINED_CLASS, FORM_VALIDATION_SUMMARY,
  GROUP_COL_COUNT_ATTR,
  GROUP_COL_COUNT_CLASS,
  ROOT_SIMPLE_ITEM_CLASS,
} from '@ts/ui/form/constants';
import {
  getFieldType,
  getItemFormatInfo,
} from '@ts/ui/form/form.ai.utils';
import type { ItemOptionActionType } from '@ts/ui/form/form.item_options_actions';
import tryCreateItemOptionAction from '@ts/ui/form/form.item_options_actions';
import type {
  FormItemRuntimeInfo,
  PreparedGroupedItem,
  PreparedItem,
  PreparedTabItem,
  TabItem,
} from '@ts/ui/form/form.items_runtime_info';
import FormItemsRunTimeInfo from '@ts/ui/form/form.items_runtime_info';
import type { ExtendedLayoutManagerProperties, LayoutManagerProperties } from '@ts/ui/form/form.layout_manager';
import LayoutManager from '@ts/ui/form/form.layout_manager';
import { FormLoadPanel } from '@ts/ui/form/form.load_panel';
import {
  concatPaths,
  convertToLayoutManagerOptions,
  createItemPathByIndex,
  getFullOptionName,
  getItemPath,
  getOptionNameFromFullName,
  getTextWithoutSpaces,
  isEqualToDataFieldOrNameOrTitleOrCaption,
  isFullPathContainsTabs,
  tryGetTabPath,
} from '@ts/ui/form/form.utils';
import type { LoadPanelProperties } from '@ts/ui/load_panel';
import LoadPanel from '@ts/ui/load_panel';
import ValidationEngine from '@ts/ui/m_validation_engine';
import ValidationSummary from '@ts/ui/m_validation_summary';
import type { ScreenSizeQualifier } from '@ts/ui/responsive_box';
import Scrollable from '@ts/ui/scroll_view/scrollable';
import type { TabPanelProperties } from '@ts/ui/tab_panel/tab_panel';
import TabPanel from '@ts/ui/tab_panel/tab_panel';
import { TEXTEDITOR_CLASS, TEXTEDITOR_INPUT_CLASS } from '@ts/ui/text_box/text_editor.base';
import { TOOLBAR_CLASS } from '@ts/ui/toolbar/constants';

export type FormAICommandName = 'smartPaste';
export interface AICommandParamsMap {
  smartPaste: SmartPasteCommandParams;
}

export interface AICommandResultMap {
  smartPaste: SmartPasteCommandResult;
}

interface AICommandWithParams<T extends FormAICommandName> {
  command: T;
  params: AICommandParamsMap[T];
  callbacks: RequestCallbacks<AICommandResultMap[T]>;
}

const ITEM_OPTIONS_FOR_VALIDATION_UPDATING = ['items', 'isRequired', 'validationRules', 'visible'];

export interface FormProperties extends Properties {
  alignRootItemLabels?: boolean;

  stylingMode?: EditorStyle;

  formID?: string;

  templatesRenderAsynchronously?: boolean;
}

class Form extends Widget<FormProperties> {
  private _abort?: () => void;

  private _currentAICommand?: AICommandWithParams<FormAICommandName> = undefined;

  _targetScreenFactor?: ScreenSizeQualifier;

  _lastMarkupScreenFactor!: ScreenSizeQualifier;

  _scrollable?: Scrollable;

  _dirtyFields!: Set<unknown>;

  _cachedColCountOptions!: {
    colCountByScreen: Record<ScreenSizeQualifier, number>;
  }[];

  _itemsRunTimeInfo!: FormItemsRunTimeInfo;

  _groupsColCount!: number[];

  // eslint-disable-next-line no-restricted-globals
  autoColCountChangedTimeoutId?: ReturnType<typeof setTimeout>;

  _rootLayoutManager!: LayoutManager;

  _cachedLayoutManagers!: LayoutManager[];

  _validationSummary?: ValidationSummary;

  _isDataUpdating?: boolean;

  _isDimensionChangeRefresh?: boolean;

  _$validationSummary?: dxElementWrapper;

  _loadPanel?: FormLoadPanel;

  _smartPastingAction?: (e: Partial<SmartPastingEvent>) => void;

  _smartPastedAction?: (e: Partial<SmartPastedEvent>) => void;

  _init(): void {
    super._init();

    this._dirtyFields = new Set();
    this._cachedColCountOptions = [];
    this._itemsRunTimeInfo = new FormItemsRunTimeInfo();
    this._groupsColCount = [];

    this._attachSyncSubscriptions();
    this._createSmartPastingAction();
    this._createSmartPastedAction();
  }

  _getDefaultOptions(): FormProperties {
    return {
      ...super._getDefaultOptions(),
      formID: `dx-${new Guid()}`,
      formData: {},
      colCount: 1,
      screenByWidth: defaultScreenFactorFunc,
      labelLocation: 'left',
      readOnly: false,
      // @ts-expect-error ts-error
      onFieldDataChanged: null,
      // @ts-expect-error ts-error
      customizeItem: null,
      // @ts-expect-error ts-error
      onEditorEnterKey: null,
      minColWidth: 200,
      alignItemLabels: true,
      alignItemLabelsInAllGroups: true,
      alignRootItemLabels: true,
      showColonAfterLabel: true,
      showRequiredMark: true,
      showOptionalMark: false,
      requiredMark: '*',
      optionalMark: messageLocalization.format('dxForm-optionalMark'),
      // @ts-expect-error ts-error
      requiredMessage: messageLocalization.getFormatter('dxForm-requiredMessage'),
      showValidationSummary: false,
      scrollingEnabled: false,
      stylingMode: config().editorStylingMode,
      labelMode: 'outside',
      isDirty: false,
      // @ts-expect-error ts-error
      onSmartPasting: null,
      // @ts-expect-error ts-error
      onSmartPasted: null,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<FormProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return isMaterialBased(current());
        },
        options: {
          labelLocation: 'top',
        },
      },
      {
        device(): boolean {
          return isMaterial(current());
        },
        options: {
          showColonAfterLabel: false,
        },
      },
    ]);
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      formData: true,
      validationGroup: true,
    });
  }

  _getGroupColCount($element: dxElementWrapper): number {
    return parseInt($element.attr(GROUP_COL_COUNT_ATTR) ?? '1', 10);
  }

  _applyLabelsWidthByCol(
    $container: dxElementWrapper,
    index: number,
    options: {
      excludeTabbed?: boolean;
      inOneColumn?: boolean;
    } = {},
  ): void {
    const fieldItemClass = options?.inOneColumn
      ? FIELD_ITEM_CLASS
      : FORM_FIELD_ITEM_COL_CLASS + index;
    const cssExcludeTabbedSelector = options?.excludeTabbed
      ? `:not(.${FIELD_ITEM_TAB_CLASS})`
      : '';

    setLabelWidthByMaxLabelWidth(
      $container,
      `.${fieldItemClass}${cssExcludeTabbedSelector}`,
    );
  }

  _applyLabelsWidth(
    $container: dxElementWrapper,
    excludeTabbed: boolean,
    inOneColumn: boolean,
    colCount: number | undefined,
  ): void {
    const applyLabelsOptions = {
      excludeTabbed,
      inOneColumn,
    };

    const columnsCount = inOneColumn
      ? 1
      : colCount ?? this._getGroupColCount($container);

    for (let i = 0; i < columnsCount; i += 1) {
      this._applyLabelsWidthByCol(
        $container,
        i,
        applyLabelsOptions,
      );
    }
  }

  _getGroupElementsInColumn(
    $container: dxElementWrapper,
    columnIndex: number,
    colCount?: number,
  ): dxElementWrapper {
    const cssColCountSelector = isDefined(colCount) ? `.${GROUP_COL_COUNT_CLASS}${colCount}` : '';
    const groupSelector = `.${FORM_FIELD_ITEM_COL_CLASS}${columnIndex} > .${FIELD_ITEM_CONTENT_CLASS} > .${FORM_GROUP_CLASS}${cssColCountSelector}`;

    return $container.find(groupSelector);
  }

  _applyLabelsWidthWithGroups(
    $container: dxElementWrapper,
    colCount: number,
    excludeTabbed: boolean,
  ): void {
    const { alignRootItemLabels } = this.option();
    if (alignRootItemLabels === true) { // TODO: private option
      const $rootSimpleItems = $container.find(`.${ROOT_SIMPLE_ITEM_CLASS}`);
      for (let colIndex = 0; colIndex < colCount; colIndex += 1) {
        // TODO: root items are aligned with root items only
        // this code doesn't align root items with grouped items in the same column
        // (see T942517)
        this._applyLabelsWidthByCol(
          $rootSimpleItems,
          colIndex,
        );
      }
    }

    const alignItemLabelsInAllGroups = this.option('alignItemLabelsInAllGroups');
    if (alignItemLabelsInAllGroups) {
      this._applyLabelsWidthWithNestedGroups(
        $container,
        colCount,
        excludeTabbed,
      );
    } else {
      const $groups = this.$element().find(`.${FORM_GROUP_CLASS}`);
      for (let i = 0; i < $groups.length; i += 1) {
        this._applyLabelsWidth(
          $groups.eq(i),
          excludeTabbed,
          false,
          undefined,
        );
      }
    }
  }

  _applyLabelsWidthWithNestedGroups(
    $container: dxElementWrapper,
    colCount: number,
    excludeTabbed: boolean,
  ): void {
    const applyLabelsOptions = { excludeTabbed };

    for (let colIndex = 0; colIndex < colCount; colIndex += 1) {
      const $baseGroups = this._getGroupElementsInColumn($container, colIndex);
      this._applyLabelsWidthByCol(
        $baseGroups,
        0,
        applyLabelsOptions,
      );

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (
        let groupsColIndex = 0;
        groupsColIndex < this._groupsColCount.length;
        groupsColIndex += 1
      ) {
        const $groupsByCol = this._getGroupElementsInColumn(
          $container,
          colIndex,
          this._groupsColCount[groupsColIndex],
        );
        const groupColCount = this._getGroupColCount($groupsByCol);

        for (let groupColIndex = 1; groupColIndex < groupColCount; groupColIndex += 1) {
          this._applyLabelsWidthByCol(
            $groupsByCol,
            groupColIndex,
            applyLabelsOptions,
          );
        }
      }
    }
  }

  _labelLocation(): LabelLocation | undefined {
    const { labelLocation } = this.option();

    return labelLocation;
  }

  _alignLabelsInColumn(options: {
    layoutManager: LayoutManager;
    inOneColumn: boolean;
    $container: dxElementWrapper;
    excludeTabbed: boolean;
    items: Item[] | undefined;
  }): void {
    const {
      layoutManager,
      inOneColumn,
      $container,
      excludeTabbed,
      items,
    } = options;

    if (!hasWindow() || this._labelLocation() === 'top') {
      // TODO: label location can be changed to 'left/right' for some labels
      // but this condition disables alignment for such items
      return;
    }

    if (inOneColumn) {
      this._applyLabelsWidth(
        $container,
        excludeTabbed,
        true,
        undefined,
      );
    } else if (this._checkGrouping(items)) {
      this._applyLabelsWidthWithGroups(
        $container,
        layoutManager._getColCount(),
        excludeTabbed,
      );
    } else {
      this._applyLabelsWidth(
        $container,
        excludeTabbed,
        false,
        layoutManager._getColCount(),
      );
    }
  }

  _prepareFormData(): void {
    if (!isDefined(this.option('formData'))) {
      this.option('formData', {});
    }
  }

  _setStylingModeClass(): void {
    const { stylingMode } = this.option();
    if (stylingMode === 'underlined') {
      this.$element().addClass(FORM_UNDERLINED_CLASS);
    }
  }

  _initMarkup(): void {
    ValidationEngine.addGroup(this._getValidationGroup(), false);
    this._clearCachedInstances();
    this._prepareFormData();
    this.$element().addClass(FORM_CLASS);
    this._setStylingModeClass();

    super._initMarkup();

    this.setAria('role', 'form', this.$element());

    const { scrollingEnabled } = this.option();

    if (scrollingEnabled) {
      this._renderScrollable();
    }

    this._renderLayout();
    this._renderValidationSummary();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._lastMarkupScreenFactor = this._targetScreenFactor || this._getCurrentScreenFactor();

    this._attachResizeObserverSubscription();
  }

  _attachResizeObserverSubscription(): void {
    if (hasWindow()) {
      const formRootElement = this.$element().get(0);

      resizeObserverSingleton.unobserve(formRootElement);
      resizeObserverSingleton.observe(formRootElement, () => { this._resizeHandler(); });
    }
  }

  _resizeHandler(): void {
    if (this._cachedLayoutManagers.length) {
      each(this._cachedLayoutManagers, (_, layoutManager: LayoutManager) => {
        const { onLayoutChanged } = layoutManager.option();

        onLayoutChanged?.(layoutManager.isSingleColumnMode());
      });
    }
  }

  _getCurrentScreenFactor(): ScreenSizeQualifier {
    const { screenByWidth } = this.option();

    if (hasWindow()) {
      const currentScreenFactor: ScreenSizeQualifier = getCurrentScreenFactor(screenByWidth);

      return currentScreenFactor;
    }

    return 'lg';
  }

  _clearCachedInstances(): void {
    this._itemsRunTimeInfo.clear();
    this._cachedLayoutManagers = [];
  }

  _alignLabels(
    layoutManager: LayoutManager,
    inOneColumn: boolean,
  ): void {
    const { items } = this.option();

    this._alignLabelsInColumn({
      $container: this.$element(),
      layoutManager,
      excludeTabbed: true,
      items,
      inOneColumn,
    });

    triggerResizeEvent(this.$element().find(`.${TOOLBAR_CLASS}`));
  }

  _clean(): void {
    this._clearValidationSummary();

    super._clean();

    this._groupsColCount = [];
    this._cachedColCountOptions = [];
    // @ts-expect-error ts-error
    this._lastMarkupScreenFactor = undefined;

    resizeObserverSingleton.unobserve(this.$element().get(0));
  }

  _renderScrollable(): void {
    const useNativeScrolling = this.option('useNativeScrolling');
    // @ts-expect-error ts-error
    this._scrollable = new Scrollable(this.$element(), {
      useNative: !!useNativeScrolling,
      useSimulatedScrollbar: !useNativeScrolling,
      useKeyboard: false,
      direction: 'both',
      bounceEnabled: false,
    });
  }

  _getContent(): dxElementWrapper {
    const { scrollingEnabled } = this.option();
    return scrollingEnabled
      ? $(this.getScrollable()?.content())
      : this.$element();
  }

  _clearValidationSummary(): void {
    this._$validationSummary?.remove();
    this._$validationSummary = undefined;
    this._validationSummary = undefined;
  }

  _renderValidationSummary(): void {
    this._clearValidationSummary();

    const { showValidationSummary } = this.option();

    if (showValidationSummary) {
      this._$validationSummary = $('<div>')
        .addClass(FORM_VALIDATION_SUMMARY)
        .appendTo(this._getContent());

      this._validationSummary = super._createComponent(
        this._$validationSummary,
        ValidationSummary,
        {
          validationGroup: this._getValidationGroup(),
        },
      );
    }
  }

  _prepareItems(
    items: Item[] | TabbedItem['tabs'] | undefined,
    parentIsTabbedItem?: boolean,
    currentPath?: string,
    isTabs?: boolean,
  ): PreparedItem[] | PreparedItem<TabbedItem['tabs']> | undefined {
    if (items) {
      const result: PreparedItem[] | PreparedItem<TabbedItem['tabs']> = [];
      for (let i = 0; i < items.length; i += 1) {
        let item = items[i];
        const path = concatPaths(currentPath, createItemPathByIndex(i, isTabs));
        const itemRunTimeInfo: FormItemRuntimeInfo = { item, itemIndex: i, path };
        const guid = this._itemsRunTimeInfo.add(itemRunTimeInfo);

        if (isString(item)) {
          item = { dataField: item };
        }

        if (isObject(item)) {
          const preparedItem: PreparedItem = { ...item };
          itemRunTimeInfo.preparedItem = preparedItem;
          preparedItem.guid = guid;
          this._tryPrepareGroupItemCaption(preparedItem);
          this._tryPrepareGroupItem(preparedItem);
          this._tryPrepareTabbedItem(preparedItem, path);
          this._tryPrepareItemTemplate(preparedItem);

          // eslint-disable-next-line max-depth
          if (parentIsTabbedItem) {
            preparedItem.cssItemClass = FIELD_ITEM_TAB_CLASS;
          }

          // eslint-disable-next-line max-depth
          if (preparedItem.items) {
            preparedItem.items = this._prepareItems(preparedItem.items, parentIsTabbedItem, path);
          }
          result.push(preparedItem);
        } else {
          result.push(item);
        }
      }

      return result;
    }

    return items;
  }

  _isGroupItem(item: PreparedItem): item is PreparedItem<PreparedGroupedItem> {
    return item.itemType === 'group';
  }

  _tryPrepareGroupItemCaption(item: PreparedItem): void {
    if (this._isGroupItem(item)) {
      item._prepareGroupCaptionTemplate = (captionTemplate): void => {
        if (item.captionTemplate) {
          item.groupCaptionTemplate = this._getTemplate(captionTemplate);
        }

        item.captionTemplate = this._itemGroupTemplate.bind(this, item);
      };
      item._prepareGroupCaptionTemplate(item.captionTemplate);
    }
  }

  _tryPrepareGroupItem(item: PreparedItem): void {
    if (this._isGroupItem(item)) {
      item.alignItemLabels = ensureDefined(item.alignItemLabels, true);
      item._prepareGroupItemTemplate = (itemTemplate): void => {
        if (item.template) {
          item.groupContentTemplate = this._getTemplate(itemTemplate);
        }

        item.template = this._itemGroupTemplate.bind(this, item);
      };
      item._prepareGroupItemTemplate(item.template);
    }
  }

  _isTabbedItem(item: PreparedItem): item is PreparedItem<TabbedItem> {
    return item.itemType === 'tabbed';
  }

  _tryPrepareTabbedItem(item: PreparedItem, path: string | undefined): void {
    if (this._isTabbedItem(item)) {
      item.template = this._itemTabbedTemplate.bind(this, item);
      item.tabs = this._prepareItems(item.tabs, true, path, true);
    }
  }

  _tryPrepareItemTemplate(
    item: PreparedItem,
  ): void {
    if (item.template) {
      item.template = this._getTemplate(item.template);
    }
  }

  _checkGrouping(items: Item[] | undefined): boolean {
    if (items) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (item.itemType === 'group') {
          return true;
        }
      }
    }
    return false;
  }

  _renderLayout(): void {
    const {
      items,
    } = this.option();
    const $content = this._getContent();

    // TODO: Introduce this.preparedItems and use it for partial rerender???
    // Compare new preparedItems with old preparedItems to detect what should be rerendered?
    const preparedItems = this._prepareItems(items);

    // #DEBUG
    // @ts-expect-error ts-error
    this._testResultItems = preparedItems;
    // #ENDDEBUG

    const {
      colCount,
      alignItemLabels,
      screenByWidth,
      colCountByScreen,
    } = this.option();

    this._rootLayoutManager = this._renderLayoutManager(
      $content,
      this._createLayoutManagerOptions(
        preparedItems,
        {
          isRoot: true,
          colCount,
          alignItemLabels,
          screenByWidth,
          colCountByScreen,
          onLayoutChanged: (inOneColumn: boolean): void => {
            this._alignLabels.bind(this)(this._rootLayoutManager, inOneColumn);
          },
          onContentReady: (e: EventInfo<LayoutManager>): void => {
            this._alignLabels(e.component, e.component.isSingleColumnMode());
          },
        },
      ),
    );
  }

  _tryGetItemsForTemplate(
    item: PreparedItem<PreparedTabItem>,
  ): PreparedItem<PreparedTabItem>[] {
    return item.items ?? [];
  }

  _itemTabbedTemplate(
    tabbedItem: PreparedItem<TabbedItem>,
    data: SimpleItemTemplateData,
    $itemContainer: dxElementWrapper,
  ): void {
    const $tabPanel = $('<div>').appendTo($itemContainer);
    const tabPanelOptions: TabPanelProperties = {
      ...tabbedItem.tabPanelOptions,
      dataSource: tabbedItem.tabs,
      onItemRendered: (args) => {
        tabbedItem.tabPanelOptions?.onItemRendered?.(args);

        triggerShownEvent(args.itemElement);
      },
      itemTemplate: (
        itemData: PreparedItem<PreparedTabItem>,
        e,
        container,
      ) => {
        const { screenByWidth } = this.option();
        const $container = $(container);
        const alignItemLabels = ensureDefined(itemData.alignItemLabels, true);
        const layoutManager = this._renderLayoutManager(
          $container,
          this._createLayoutManagerOptions(
            this._tryGetItemsForTemplate(itemData),
            {
              colCount: itemData.colCount,
              alignItemLabels,
              screenByWidth,
              colCountByScreen: itemData.colCountByScreen,
              cssItemClass: itemData.cssItemClass,
              onLayoutChanged: (inOneColumn: boolean): void => {
                this._alignLabelsInColumn({
                  $container: $(container),
                  layoutManager,
                  items: itemData.items,
                  inOneColumn,
                  excludeTabbed: false,
                });
              },
            },
          ),
        );

        if (this._itemsRunTimeInfo) {
          this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(itemData.guid ?? '', { layoutManager });
        }

        if (alignItemLabels) {
          this._alignLabelsInColumn({
            $container,
            layoutManager,
            items: itemData.items,
            inOneColumn: layoutManager.isSingleColumnMode(),
            excludeTabbed: false,
          });
        }
      },
    };
    const tryUpdateTabPanelInstance = (items: PreparedTabItem[], instance: TabPanel): void => {
      if (Array.isArray(items)) {
        items.forEach((item) => this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(
          item.guid ?? '',
          {
            widgetInstance: instance,
          },
        ));
      }
    };
    const tabPanel = this._createComponent($tabPanel, TabPanel, tabPanelOptions);

    $($itemContainer).parent().addClass(FIELD_ITEM_CONTENT_HAS_TABS_CLASS);

    tabPanel.on('optionChanged', (
      eventArgs: EventInfo<TabPanel> & ChangedOptionInfo,
    ): void => {
      const {
        fullName,
        value,
        component,
      } = eventArgs;

      if (fullName === 'dataSource') {
        tryUpdateTabPanelInstance(value, component);
      }
    });

    tryUpdateTabPanelInstance([{ guid: tabbedItem.guid }, ...tabbedItem.tabs ?? []], tabPanel);
  }

  _itemGroupCaptionTemplate(
    item: PreparedGroupedItem,
    $group: dxElementWrapper,
    id: string,
  ): void {
    if (item.groupCaptionTemplate) {
      const $captionTemplate = $('<div>')
        .addClass(FORM_GROUP_CUSTOM_CAPTION_CLASS)
        .attr('id', id)
        .appendTo($group);

      item._renderGroupCaptionTemplate = (): void => {
        const data = {
          component: this,
          caption: item.caption,
          name: item.name,
        };
        item.groupCaptionTemplate?.render({
          model: data,
          container: getPublicElement($captionTemplate),
        });
      };
      item._renderGroupCaptionTemplate();

      return;
    }

    if (item.caption) {
      $('<span>')
        .addClass(FORM_GROUP_CAPTION_CLASS)
        .text(item.caption)
        .attr('id', id)
        .appendTo($group);
    }
  }

  _itemGroupContentTemplate(
    item: PreparedGroupedItem,
    $group: dxElementWrapper,
  ): void {
    const $groupContent = $('<div>')
      .addClass(FORM_GROUP_CONTENT_CLASS)
      .appendTo($group);

    if (item.groupContentTemplate) {
      item._renderGroupContentTemplate = (): void => {
        $groupContent.empty();
        const data = {
          formData: this.option('formData'),
          component: this,
        };
        item.groupContentTemplate?.render({
          model: data,
          container: getPublicElement($groupContent),
        });
      };
      item._renderGroupContentTemplate();
    } else {
      const layoutManager = this._renderLayoutManager(
        $groupContent,
        this._createLayoutManagerOptions(
          this._tryGetItemsForTemplate(item),
          {
            colCount: item.colCount,
            colCountByScreen: item.colCountByScreen,
            alignItemLabels: item.alignItemLabels,
            cssItemClass: item.cssItemClass,
          },
        ),
      );

      this._itemsRunTimeInfo?.extendRunTimeItemInfoByKey(item.guid ?? '', { layoutManager });

      const colCount = layoutManager._getColCount();
      this._applyGroupColCount($group, colCount);
    }
  }

  _itemGroupTemplate(
    item: GroupItem,
    options: SimpleItemTemplateData,
    $container: dxElementWrapper,
  ): void {
    const { id } = options.editorOptions.inputAttr;
    const $group = $('<div>')
      .toggleClass(FORM_GROUP_WITH_CAPTION_CLASS, !!item.caption?.length)
      .addClass(FORM_GROUP_CLASS)
      .appendTo($container);

    const groupAria = {
      role: 'group',
      // eslint-disable-next-line spellcheck/spell-checker
      labelledby: id,
    };
    this.setAria(groupAria, $group);

    $($container).parent().addClass(FIELD_ITEM_CONTENT_HAS_GROUP_CLASS);

    this._itemGroupCaptionTemplate(item, $group, id);
    this._itemGroupContentTemplate(item, $group);
  }

  _createLayoutManagerOptions(
    items: PreparedItem[] | PreparedItem<TabbedItem['tabs']> | undefined,
    extendedLayoutManagerOptions: ExtendedLayoutManagerProperties,
  ): LayoutManagerProperties {
    return convertToLayoutManagerOptions({
      form: this,
      formOptions: this.option(),
      $formElement: this.$element(),
      items,
      validationGroup: this._getValidationGroup(),
      extendedLayoutManagerOptions,
      onFieldDataChanged: (args: FieldDataChangedEvent) => {
        if (!this._isDataUpdating) {
          this._triggerOnFieldDataChanged(args);
        }
      },
      onContentReady: (args: EventInfo<LayoutManager>) => {
        this._itemsRunTimeInfo.addItemsOrExtendFrom(args.component._itemsRunTimeInfo);
        extendedLayoutManagerOptions.onContentReady?.(args);
      },
      onDisposing: (e: EventInfo<LayoutManager>) => {
        const { component } = e;
        const nestedItemsRunTimeInfo = component.getItemsRunTimeInfo();
        this._itemsRunTimeInfo.removeItemsByItems(nestedItemsRunTimeInfo);
      },
      onFieldItemRendered: () => {
        this._validationSummary?.refreshValidationGroup();
      },
    });
  }

  _renderLayoutManager(
    $parent: dxElementWrapper,
    layoutManagerOptions: LayoutManagerProperties,
  ): LayoutManager {
    const baseColCountByScreen = {
      lg: layoutManagerOptions.colCount,
      md: layoutManagerOptions.colCount,
      sm: layoutManagerOptions.colCount,
      xs: 1,
    };

    this._cachedColCountOptions.push({
      colCountByScreen: extend(baseColCountByScreen, layoutManagerOptions.colCountByScreen),
    });

    const $element = $('<div>');
    $element.appendTo($parent);
    const instance = this._createComponent($element, LayoutManager, layoutManagerOptions);

    instance.on(
      'autoColCountChanged',
      () => {
        this._clearAutoColCountChangedTimeout();
        // eslint-disable-next-line no-restricted-globals
        this.autoColCountChangedTimeoutId = setTimeout(
          () => {
            if (!this._disposed) {
              this._isDimensionChangeRefresh = true;
              this._refresh();
              this._isDimensionChangeRefresh = false;
            }
          },
          0,
        );
      },
    );

    this._cachedLayoutManagers.push(instance);

    return instance;
  }

  _getValidationGroup(): string | undefined {
    const { validationGroup } = this.option();
    // @ts-expect-error ts-error
    return validationGroup ?? this;
  }

  _createComponent<TTComponent, IProperties = Record<string, unknown>>(
    element: string | HTMLElement | dxElementWrapper,
    component: string | (new (...args) => TTComponent),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentConfiguration: TTComponent extends Component<any, infer TTProperties>
      ? TTProperties
      : IProperties,
  ): TTComponent {
    const { readOnly } = this.option();

    this._extendConfig(componentConfiguration ?? {}, {
      readOnly,
    });

    return super._createComponent(element, component, componentConfiguration);
  }

  _attachSyncSubscriptions(): void {
    this.on('optionChanged', (args: OptionChanged<FormProperties>): void => {
      const { fullName, name } = args;

      if (fullName === 'formData') {
        if (!isDefined(args.value)) {
          this._options.silent('formData', args.value = {});
        }
        this._triggerOnFieldDataChangedByDataSet(args.value);
      }

      if (this._cachedLayoutManagers.length) {
        each(this._cachedLayoutManagers, (
          _index: number,
          layoutManager: LayoutManager,
        ): void => {
          if (fullName === 'formData') {
            this._isDataUpdating = true;
            layoutManager.option('layoutData', args.value);
            this._isDataUpdating = false;
          }

          if (name === 'readOnly' || name === 'disabled') {
            layoutManager.option(fullName, args.value);
          }
        });
      }
    });
  }

  _createSmartPastingAction(): void {
    this._smartPastingAction = this._createActionByOption(
      'onSmartPasting',
      { excludeValidators: ['disabled'] },
    );
  }

  _createSmartPastedAction(): void {
    this._smartPastedAction = this._createActionByOption(
      'onSmartPasted',
      { excludeValidators: ['disabled'] },
    );
  }

  _optionChanged(args: OptionChanged<FormProperties>): void {
    const { fullName } = args;
    const splitFullName = fullName.split('.');

    // search() is used because the string can be
    // ['items', ' items ', ' items .', 'items[0]', 'items[ 10 ] .', ...]
    if ((splitFullName.length > 1)
      && (splitFullName[0].search('items') !== -1)
      && this._itemsOptionChangedHandler(args)) {
      return;
    }

    if ((splitFullName.length > 1)
        && (splitFullName[0].search('formData') !== -1)
        && this._formDataOptionChangedHandler(args)) {
      return;
    }

    this._defaultOptionChangedHandler(args);
  }

  _defaultOptionChangedHandler(args: OptionChanged<FormProperties>): void {
    switch (args.name) {
      case 'formData':
        if (!this.option('items')) {
          this._invalidate();
        } else if (isEmptyObject(args.value)) {
          this._clear();
        }
        break;
      case 'onFieldDataChanged':
        break;
      case 'items':
      case 'colCount':
      case 'onEditorEnterKey':
      case 'labelLocation':
      case 'labelMode':
      case 'alignItemLabels':
      case 'showColonAfterLabel':
      case 'customizeItem':
      case 'alignItemLabelsInAllGroups':
      case 'showRequiredMark':
      case 'showOptionalMark':
      case 'requiredMark':
      case 'optionalMark':
      case 'requiredMessage':
      case 'scrollingEnabled':
      case 'formID':
      case 'colCountByScreen':
      case 'screenByWidth':
      case 'stylingMode':
        this._invalidate();
        break;
      case 'showValidationSummary':
        this._renderValidationSummary();
        break;
      case 'minColWidth': {
        const { colCount } = this.option();
        if (colCount === 'auto') {
          this._invalidate();
        }
        break;
      }
      case 'alignRootItemLabels':
      case 'readOnly':
      case 'isDirty':
        break;
      case 'width':
        super._optionChanged(args);
        this._rootLayoutManager.option(args.name, args.value);
        this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());
        break;
      case 'validationGroup':
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        ValidationEngine.removeGroup(args.previousValue || this);
        this._invalidate();
        break;
      case 'aiIntegration':
        this._processAIIntegrationUpdate();
        break;
      case 'onSmartPasting':
        this._createSmartPastingAction();
        break;
      case 'onSmartPasted':
        this._createSmartPastedAction();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _itemsOptionChangedHandler(args: OptionChanged<FormProperties>): boolean {
    const { value, fullName } = args;
    const nameParts = fullName.split('.');

    const itemPath = this._getItemPath(nameParts);
    const item = this.option(itemPath);
    const optionNameWithoutPath = fullName.replace(`${itemPath}.`, '');
    const simpleOptionName = optionNameWithoutPath.split('.')[0].replace(/\[\d+]/, '');
    const itemAction = this._tryCreateItemOptionAction(
      simpleOptionName,
      item,
      item[simpleOptionName],
      args.previousValue,
      itemPath,
    );

    let result = this._tryExecuteItemOptionAction(itemAction)
      ?? this._tryChangeLayoutManagerItemOption(fullName, value);

    if (!result && item) {
      this._changeItemOption(item, optionNameWithoutPath, value);
      const { items } = this.option();

      const generatedItems = this._generateItemsFromData(items);
      this.option('items', generatedItems);
      result = true;
    }

    return result;
  }

  _formDataOptionChangedHandler(args: OptionChanged<FormProperties>): boolean {
    const nameParts = args.fullName.split('.');
    const { value } = args;
    const dataField = nameParts.slice(1).join('.');
    const editor = this.getEditor(dataField);
    if (editor) {
      editor.option('value', value);
    } else {
      this._triggerOnFieldDataChanged({ dataField, value });
    }
    return true;
  }

  _tryCreateItemOptionAction(
    optionName: string | undefined,
    item: Item,
    value: unknown,
    previousValue: unknown,
    itemPath: string,
  ): ItemOptionActionType {
    let currentValue = value;

    if (optionName === 'tabs') {
      this._itemsRunTimeInfo.removeItemsByPathStartWith(`${itemPath}.tabs`);
      // preprocess user value as in _tryPrepareTabbedItem
      currentValue = this._prepareItems(currentValue as TabbedItem['tabs'], true, itemPath, true);
    }
    return tryCreateItemOptionAction(optionName, {
      item,
      value: currentValue,
      previousValue,
      itemsRunTimeInfo: this._itemsRunTimeInfo,
    });
  }

  _tryExecuteItemOptionAction(action: ItemOptionActionType): boolean | undefined {
    return action?.tryExecute();
  }

  _updateValidationGroupAndSummaryIfNeeded(fullName: string): void {
    const optionName = getOptionNameFromFullName(fullName);
    if (ITEM_OPTIONS_FOR_VALIDATION_UPDATING.includes(optionName)) {
      ValidationEngine.addGroup(this._getValidationGroup(), false);
      if (this.option('showValidationSummary')) {
        this._validationSummary?.refreshValidationGroup();
      }
    }
  }

  _setLayoutManagerItemOption(
    layoutManager: LayoutManager,
    optionName: string,
    value: unknown,
    path: string,
  ): void {
    if (this._updateLockCount > 0) {
      if (!layoutManager._updateLockCount) {
        layoutManager.beginUpdate();
      }
      const key = this._itemsRunTimeInfo.findKeyByPath(path);
      // @ts-expect-error ts-error
      this.postponedOperations.add(key, () => {
        if (!layoutManager._disposed) {
          layoutManager.endUpdate();
        }
        return Deferred().resolve();
      });
    }
    const contentReadyHandler = (e): void => {
      e.component.off('contentReady', contentReadyHandler);
      if (isFullPathContainsTabs(path)) {
        const tabPath = tryGetTabPath(path);
        const tabLayoutManager = this._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(tabPath);
        if (tabLayoutManager) {
          const { items } = tabLayoutManager.option();
          this._alignLabelsInColumn({
            items,
            layoutManager: tabLayoutManager,
            $container: tabLayoutManager.$element(),
            inOneColumn: tabLayoutManager.isSingleColumnMode(),
            excludeTabbed: false,
          });
        }
      } else {
        this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());
      }
    };
    layoutManager.on('contentReady', contentReadyHandler);
    layoutManager.option(optionName, value);
    this._updateValidationGroupAndSummaryIfNeeded(optionName);
  }

  _tryChangeLayoutManagerItemOption(
    fullName: string,
    value: Item[] | TabbedItem['tabs'] | undefined,
  ): boolean {
    const nameParts = fullName.split('.');
    const optionName = getOptionNameFromFullName(fullName);

    if (optionName === 'items' && nameParts.length > 1) {
      const itemPath = this._getItemPath(nameParts);
      const layoutManager = this._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(itemPath);

      if (layoutManager) {
        this._itemsRunTimeInfo.removeItemsByItems(layoutManager.getItemsRunTimeInfo());
        const items = this._prepareItems(value, false, itemPath);
        this._setLayoutManagerItemOption(layoutManager, optionName, items, itemPath);
        return true;
      }
    } else if (nameParts.length > 2) {
      const endPartIndex = nameParts.length - 2;
      const itemPath = this._getItemPath(nameParts.slice(0, endPartIndex));
      const layoutManager = this._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(itemPath);

      if (layoutManager) {
        const fullOptionName = getFullOptionName(nameParts[endPartIndex], optionName);
        if (optionName === 'editorType') { // T903774
          // eslint-disable-next-line max-depth
          if (layoutManager.option(fullOptionName) !== value) {
            return false;
          }
        }
        if (optionName === 'visible') { // T874843
          const formItems: FormProperties['items'] = this.option(getFullOptionName(itemPath, 'items')) as FormProperties['items'];

          // eslint-disable-next-line max-depth
          if (formItems?.length) {
            const { items: layoutManagerItems } = layoutManager.option();

            formItems.forEach((item, index) => {
              // @ts-expect-error ts-error
              const layoutItem = layoutManagerItems[index];
              layoutItem.visibleIndex = item.visibleIndex;
            });
          }
        }

        this._setLayoutManagerItemOption(layoutManager, fullOptionName, value, itemPath);
        return true;
      }
    }
    return false;
  }

  _tryChangeLayoutManagerItemOptions(itemPath: string, options: unknown): boolean {
    let result = false;
    this.beginUpdate();

    each(options, (optionName, optionValue): boolean | undefined => {
      result = this._tryChangeLayoutManagerItemOption(
        getFullOptionName(itemPath, optionName),
        optionValue,
      );
      if (!result) {
        return false;
      }
      return true;
    });
    this.endUpdate();
    return result;
  }

  _getItemPath(nameParts: string[]): string {
    let itemPath = nameParts[0];

    for (let i = 1; i < nameParts.length; i += 1) {
      if (nameParts[i].search(/items\[\d+]|tabs\[\d+]/) !== -1) {
        itemPath += `.${nameParts[i]}`;
      } else {
        break;
      }
    }

    return itemPath;
  }

  _triggerOnFieldDataChanged(args: Partial<FieldDataChangedEvent>): void {
    this._updateIsDirty(args.dataField ?? '');
    this._createActionByOption('onFieldDataChanged')(args);
  }

  _triggerOnFieldDataChangedByDataSet(data: FormProperties['formData']): void {
    if (data && isObject(data)) {
      Object.keys(data).forEach((key) => {
        this._triggerOnFieldDataChanged({ dataField: key, value: data[key] });
      });
    }
  }

  _updateFieldValue(dataField: string, value: unknown): void {
    const { formData } = this.option();

    if (isDefined(formData)) {
      const editor = this.getEditor(dataField);

      this.option(`formData.${dataField}`, value);

      if (editor) {
        const editorValue = editor.option('value');

        if (editorValue !== value) {
          editor.option('value', value);
        }
      }
    }
  }

  _generateItemsFromData(items: Item[] | undefined): Item[] {
    const { formData } = this.option();
    const result: Item[] = [];

    if (!items && isDefined(formData)) {
      each(formData, (dataField: string): void => {
        result.push({
          dataField,
        });
      });
    }

    if (items) {
      each(items, (_index: number, item: Item) => {
        if (isObject(item)) {
          result.push(item);
        } else {
          result.push({
            dataField: item,
          });
        }
      });
    }

    return result;
  }

  _getItemByField(field: string | {
    fieldName: string;
    fieldPath: string[];
  }, items: PreparedItem[]): PreparedItem | null {
    const fieldParts = isObject(field) ? field : this._getFieldParts(field);
    const { fieldName } = fieldParts;
    const { fieldPath } = fieldParts;
    let resultItem: PreparedItem | null = null;

    if (items.length) {
      each(items, (_index: number, item: PreparedItem): boolean => {
        const { itemType } = item;

        if (fieldPath.length) {
          const path = fieldPath.slice();
          // @ts-expect-error ts-error
          // eslint-disable-next-line no-param-reassign
          item = this._getItemByFieldPath(path, fieldName, item);
        } else if ((
          this._isGroupItem(item) && !(item.caption || item.name)
        ) || (
          itemType === 'tabbed' && !item.name
        )) {
          const subItemsField = this._getSubItemField(itemType);
          item.items = this._generateItemsFromData(item.items);
          // @ts-expect-error ts-error
          // eslint-disable-next-line no-param-reassign
          item = this._getItemByField({ fieldName, fieldPath }, item[subItemsField]);
        }

        if (isEqualToDataFieldOrNameOrTitleOrCaption(item, fieldName)) {
          resultItem = item;
          return false;
        }

        return true;
      });
    }

    return resultItem;
  }

  _getFieldParts(field: string): {
    fieldName: string;
    fieldPath: string[];
  } {
    const [fieldName, ...fieldPath] = field.split('.').reverse();

    return {
      fieldName,
      fieldPath,
    };
  }

  _getItemByFieldPath(
    path: string[],
    fieldName: string,
    item: Item,
  ): Item | null {
    const { itemType } = item;
    const subItemsField = this._getSubItemField(itemType);

    const isItemWithSubItems = itemType === 'group' || itemType === 'tabbed' || (item as TabItem).title;
    let result: Item | null = null;

    do {
      if (isItemWithSubItems) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const name = item.name || (item as GroupItem).caption || (item as TabItem).title;
        const isGroupWithName = isDefined(name);
        const nameWithoutSpaces = getTextWithoutSpaces(name);
        let pathNode: string | undefined = '';

        item[subItemsField] = this._generateItemsFromData(item[subItemsField]);

        if (isGroupWithName) {
          pathNode = path.pop();
        }

        if (!path.length && nameWithoutSpaces === pathNode) {
          result = this._getItemByField(fieldName, item[subItemsField]);

          // eslint-disable-next-line max-depth
          if (result) {
            break;
          }
        }

        const isGroupPathNodeOrUnnamed = !isGroupWithName
          || (isGroupWithName && nameWithoutSpaces === pathNode);

        if (isGroupPathNodeOrUnnamed && path.length) {
          result = this._searchItemInEverySubItem(path, fieldName, item[subItemsField]);

          // eslint-disable-next-line max-depth
          if (!result) {
            break;
          }
        }
      } else {
        break;
      }
    } while (path.length && !isDefined(result));

    return result;
  }

  _getSubItemField(itemType: FormItemType | undefined): 'tabs' | 'items' {
    return itemType === 'tabbed' ? 'tabs' : 'items';
  }

  _searchItemInEverySubItem(
    path: string[],
    fieldName: string,
    items: Item[],
  ): Item | null {
    let result: Item | null = null;
    each(items, (_index: number, groupItem: GroupItem): boolean => {
      result = this._getItemByFieldPath(path.slice(), fieldName, groupItem);

      if (result) {
        return false;
      }
      return true;
    });

    return result;
  }

  _changeItemOption(item: Item, option: string, value: unknown): void {
    if (isObject(item)) {
      item[option] = value;
    }
  }

  _dimensionChanged(): void {
    const currentScreenFactor = this._getCurrentScreenFactor();

    if (this._lastMarkupScreenFactor !== currentScreenFactor) {
      if (this._isColCountChanged(this._lastMarkupScreenFactor, currentScreenFactor)) {
        this._targetScreenFactor = currentScreenFactor;
        this._isDimensionChangeRefresh = true;
        this._refresh();
        this._isDimensionChangeRefresh = false;
        this._targetScreenFactor = undefined;
      }

      this._lastMarkupScreenFactor = currentScreenFactor;
    }
  }

  _isColCountChanged(
    oldScreenSize: ScreenSizeQualifier,
    newScreenSize: ScreenSizeQualifier,
  ): boolean {
    let isChanged = false;

    each(this._cachedColCountOptions, (_index: number, item: Form['_cachedColCountOptions'][number]): boolean => {
      if (item.colCountByScreen[oldScreenSize] !== item.colCountByScreen[newScreenSize]) {
        isChanged = true;
        return false;
      }
      return true;
    });

    return isChanged;
  }

  _refresh(): void {
    const editorSelector = `.${TEXTEDITOR_CLASS}.${FOCUSED_STATE_CLASS}:not(.${DROP_DOWN_EDITOR_CLASS}) .${TEXTEDITOR_INPUT_CLASS}`;
    // @ts-expect-error ts-error
    eventsEngine.trigger(this.$element().find(editorSelector), 'change');

    if (this._isDimensionChangeRefresh) {
      this._updateLayoutsOnDimensionChange();
      return;
    }

    super._refresh();
  }

  _updateLayoutsOnDimensionChange(): void {
    this._cachedLayoutManagers.forEach((layoutManager: LayoutManager) => {
      layoutManager.updateResponsiveBoxLayout();
    });

    this._updateGroupsColCount();
    this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());
  }

  _applyGroupColCount(
    $group: dxElementWrapper,
    colCount: number,
  ): void {
    const oldColCount = $group.attr(GROUP_COL_COUNT_ATTR);

    if (oldColCount) {
      $group.removeClass(`${GROUP_COL_COUNT_CLASS}${oldColCount}`);
    }

    if (!this._groupsColCount.includes(colCount)) {
      this._groupsColCount.push(colCount);
    }

    $group
      .addClass(`${GROUP_COL_COUNT_CLASS}${colCount}`)
      .attr(GROUP_COL_COUNT_ATTR, colCount);
  }

  _updateGroupsColCount(): void {
    this._groupsColCount = [];

    this._cachedLayoutManagers.forEach((layoutManager: LayoutManager) => {
      if (layoutManager === this._rootLayoutManager) {
        return;
      }

      const $group = layoutManager.$element().closest(`.${FORM_GROUP_CLASS}`);
      if (!$group.length) {
        return;
      }

      const newColCount = layoutManager._getColCount();
      this._applyGroupColCount($group, newColCount);
    });
  }

  _updateIsDirty(dataField: string): void {
    const editor = this.getEditor(dataField);
    if (!editor) return;

    if (editor.option('isDirty')) {
      this._dirtyFields.add(dataField);
    } else {
      this._dirtyFields.delete(dataField);
    }

    this.option('isDirty', !!this._dirtyFields.size);
  }

  updateRunTimeInfoForEachEditor(editorAction: (editor: Editor) => void): void {
    this._itemsRunTimeInfo.each((_, itemRunTimeInfo) => {
      const { widgetInstance } = itemRunTimeInfo;

      if (isDefined(widgetInstance) && Editor.isEditor(widgetInstance)) {
        editorAction(widgetInstance);
      }
    });
  }

  _clear(): void {
    this.updateRunTimeInfoForEachEditor((editor: Editor): void => {
      editor.clear();
      editor.option('isValid', true);
    });

    ValidationEngine.resetGroup(this._getValidationGroup());
  }

  _updateData(data: string, value: unknown, isComplexData?: boolean): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _data = isComplexData ? value : data;

    if (isObject(_data)) {
      each(_data, (dataField: string, fieldValue): void => {
        this._updateData(
          isComplexData ? `${data}.${dataField}` : dataField,
          fieldValue,
          isObject(fieldValue),
        );
      });
    } else if (isString(data)) {
      this._updateFieldValue(data, value);
    }
  }

  registerKeyHandler(key: string, handler: SupportedKeyHandler): void {
    super.registerKeyHandler(key, handler);
    this._itemsRunTimeInfo.each((_, itemRunTimeInfo) => {
      if (isDefined(itemRunTimeInfo.widgetInstance)) {
        itemRunTimeInfo.widgetInstance.registerKeyHandler(key, handler);
      }
    });
  }

  _focusTarget(): dxElementWrapper {
    return this.$element().find(`.${FIELD_ITEM_CONTENT_CLASS} [tabindex]`).first();
  }

  _visibilityChanged(): void {
    this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());
  }

  _clearAutoColCountChangedTimeout(): void {
    if (this.autoColCountChangedTimeoutId) {
      clearTimeout(this.autoColCountChangedTimeoutId);
      this.autoColCountChangedTimeoutId = undefined;
    }
  }

  private _ensureLoadPanel(): void {
    if (!this._loadPanel) {
      this._loadPanel = new FormLoadPanel({
        $container: this.$element(),
        onLoadPanelCreate: (
          $element: dxElementWrapper,
          options: LoadPanelProperties,
        ): LoadPanel => this._createComponent($element, LoadPanel, options),
      });
    }
  }

  private _showLoadPanel(): void {
    this._ensureLoadPanel();
    this.option('disabled', true);
    this._loadPanel?.show();
  }

  private _hideLoadPanel(): void {
    this._loadPanel?.hide();
    this.option('disabled', false);
  }

  _dispose(): void {
    this._clearAutoColCountChangedTimeout();
    this._processCommandCompletion();
    this._loadPanel?.dispose();
    ValidationEngine.removeGroup(this._getValidationGroup());
    super._dispose();
  }

  clear(): void {
    this._clear();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reset(editorsData?: Record<string, any>): void {
    this.updateRunTimeInfoForEachEditor((editor) => {
      const { name = '' } = editor.option();
      if (editorsData && name in editorsData) {
        editor.reset(editorsData[name]);
        this._updateIsDirty(name);
      } else {
        editor.reset();
      }
    });

    this._renderValidationSummary();
  }

  updateData(data: string, value: unknown): void {
    this._updateData(data, value);
  }

  getEditor(dataField: string): Editor | undefined {
    return this._itemsRunTimeInfo.findWidgetInstanceByDataField(dataField)
      ?? this._itemsRunTimeInfo.findWidgetInstanceByName<Editor>(dataField);
  }

  getButton(name: string): Button | undefined {
    return this._itemsRunTimeInfo.findWidgetInstanceByName<Button>(name);
  }

  getScrollable(): Scrollable | undefined {
    const { scrollingEnabled } = this.option();
    return scrollingEnabled ? this._scrollable : undefined;
  }

  updateDimensions(): Promise<unknown> {
    const deferred = Deferred<Form>();
    const scrollable = this.getScrollable();

    if (scrollable) {
      scrollable.update().done(() => {
        // @ts-expect-error ts-error
        deferred.resolveWith(this);
      });
    } else {
      // @ts-expect-error ts-error
      deferred.resolveWith(this);
    }

    return deferred.promise();
  }

  itemOption(id: string): Item | undefined;
  itemOption(id: string, option: string, value: Item[] | TabbedItem['tabs'] | undefined): void;
  itemOption(
    id: string,
    option?: string,
    value?: Item[] | TabbedItem['tabs'] | undefined,
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ): Item | void {
    const { items } = this.option();

    const generatedItems = this._generateItemsFromData(items);
    const item = this._getItemByField(id, generatedItems);
    const path = getItemPath(generatedItems, item);

    if (!item) {
      return undefined;
    }

    if (arguments.length === 1) {
      return item;
    }

    switch (arguments.length) {
      case 3: {
        const itemAction: ItemOptionActionType = this._tryCreateItemOptionAction(
          option,
          item,
          value,
          item[option ?? ''],
          path,
        );
        this._changeItemOption(item, option ?? '', value);
        const fullName = getFullOptionName(path, option);
        if (!this._tryExecuteItemOptionAction(itemAction)
          && !this._tryChangeLayoutManagerItemOption(fullName, value)) {
          this.option('items', generatedItems);
        }
        break;
      }
      default: {
        if (isObject(option)) {
          if (!this._tryChangeLayoutManagerItemOptions(path, option)) {
            let allowUpdateItems = false;
            each(option, (optionName: string, optionValue: unknown): void => {
              const itemAction = this._tryCreateItemOptionAction(
                optionName,
                item,
                optionValue,
                item[optionName],
                path,
              );
              this._changeItemOption(item, optionName, optionValue);
              if (!allowUpdateItems && !this._tryExecuteItemOptionAction(itemAction)) {
                allowUpdateItems = true;
              }
            });
            // eslint-disable-next-line max-depth
            if (allowUpdateItems) {
              this.option('items', generatedItems);
            }
          }
        }
        break;
      }
    }

    return undefined;
  }

  validate(): ValidationResult {
    return ValidationEngine.validateGroup(this._getValidationGroup());
  }

  getItemID(name: string): string {
    const { formID } = this.option();
    return `dx_${formID}_${name || new Guid()}`;
  }

  getTargetScreenFactor(): ScreenSizeQualifier | undefined {
    return this._targetScreenFactor;
  }

  private _processCommandCompletion(): void {
    this._abort?.();
    this._abort = undefined;
    this._currentAICommand = undefined;
  }

  private _processAIIntegrationUpdate(): void {
    if (this._currentAICommand) {
      const { command, params, callbacks } = this._currentAICommand;
      const { aiIntegration } = this.option();

      this._processCommandCompletion();

      if (!aiIntegration) {
        this._hideLoadPanel();
        throw errors.Error('E1063');
      } else {
        this._executeAICommand(command, params, callbacks);
      }
    }
  }

  private _executeAICommand<T extends FormAICommandName>(
    command: T,
    params: AICommandParamsMap[T],
    callbacks: RequestCallbacks<AICommandResultMap[T]>,
  ): void {
    const { aiIntegration } = this.option();

    if (!aiIntegration) {
      this._hideLoadPanel();
      throw errors.Error('E1063');
    }

    this._currentAICommand = {
      command,
      params,
      callbacks,
    };
    this._abort = aiIntegration[command](params, callbacks);
  }

  private _updateFieldWithSmartPasteValue(
    dataField: string,
    value: SmartPasteResultFieldType,
  ): void {
    const { formData } = this.option();

    if (isDefined(formData)) {
      this._updateFieldValue(dataField, value);
    }
  }

  private _getSmartPasteCommandCallbacks(): RequestCallbacks<SmartPasteCommandResult> {
    return {
      onComplete: (fieldsData: SmartPasteCommandResult): void => {
        const aiResult = Object.fromEntries(fieldsData.map((field) => [field.name, field.value]));

        const smartPastingArgs: Pick<SmartPastingEvent, 'aiResult' | 'cancel'> = {
          aiResult,
          cancel: false,
        };
        this._smartPastingAction?.(smartPastingArgs);

        invokeConditionally(
          smartPastingArgs.cancel,
          (): void => {
            this._hideLoadPanel();
            this.beginUpdate();

            fieldsData.forEach(({ name, value }: SmartPasteCommandResult[number]) => {
              try {
                this._updateFieldWithSmartPasteValue(name, value);
              } catch (error) {
                logger.error(error);
              }
            });
            this.endUpdate();

            this._smartPastedAction?.({ aiResult });
          },
          (): void => {
            this._hideLoadPanel();
          },
        );

        this._processCommandCompletion();
      },
      onError: (error): void => {
        logger.error(error);
        this._hideLoadPanel();
        this._processCommandCompletion();
      },
    };
  }

  async smartPaste(text?: string): Promise<void> {
    if (this._currentAICommand?.command === 'smartPaste') {
      this._processCommandCompletion();
    }

    const { aiIntegration } = this.option();
    if (!aiIntegration) {
      throw errors.Error('E1063');
    }

    const smartPasteText = text ?? await navigator.clipboard.readText();
    if (!isDefined(text) && !smartPasteText) {
      return;
    }

    this._showLoadPanel();

    const dataItems = this._itemsRunTimeInfo.getItemsForDataExtraction();
    const fields = dataItems.map((item) => ({
      name: item.dataField,
      format: getItemFormatInfo(item),
      type: getFieldType(item.editorType),
      instruction: item.aiOptions?.instruction,
    }));

    const smartPasteParams = {
      text: smartPasteText,
      fields,
    };
    const smartPasteCallbacks = this._getSmartPasteCommandCallbacks();

    this._executeAICommand('smartPaste', smartPasteParams, smartPasteCallbacks);
  }
}

registerComponent('dxForm', Form);

export default Form;
