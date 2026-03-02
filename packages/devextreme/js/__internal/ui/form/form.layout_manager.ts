import '@js/ui/text_box';
import '@js/ui/number_box';
import '@js/ui/check_box';
import '@js/ui/date_box';

import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { normalizeIndexes } from '@js/core/utils/array';
import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getWidth } from '@js/core/utils/size';
import {
  isDefined, isEmptyObject, isFunction, isObject, isString, type,
} from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';
// @ts-expect-error ts-error
import { getCurrentScreenFactor, hasWindow } from '@js/core/utils/window';
import type { EventInfo } from '@js/events';
import type { Properties as ButtonProperties, Properties } from '@js/ui/button';
import type {
  ButtonItem,
  FieldDataChangedEvent,
  FormItemComponent, Item, SimpleItem, TabbedItem,
} from '@js/ui/form';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import Button from '@ts/ui/button/wrapper';
import type Editor from '@ts/ui/editor/editor';
import type { EditorProperties } from '@ts/ui/editor/editor';
import { renderButtonItem } from '@ts/ui/form/components/button_item';
import { renderEmptyItem } from '@ts/ui/form/components/empty_item';
import { renderFieldItem } from '@ts/ui/form/components/field_item';
import {
  FIELD_ITEM_CLASS,
  FORM_LAYOUT_MANAGER_CLASS,
  LAYOUT_MANAGER_ONE_COLUMN,
  ROOT_SIMPLE_ITEM_CLASS,
  SIMPLE_ITEM_TYPE,
  SINGLE_COLUMN_ITEM_CONTENT,
} from '@ts/ui/form/constants';
import type { FormProperties } from '@ts/ui/form/form';
import type Form from '@ts/ui/form/form';
import type { FormItemRuntimeInfo, PreparedItem } from '@ts/ui/form/form.items_runtime_info';
import FormItemsRunTimeInfo from '@ts/ui/form/form.items_runtime_info';
import type { LabelMarkOptions } from '@ts/ui/form/form.layout_manager.utils';
import { convertToRenderFieldItemOptions } from '@ts/ui/form/form.layout_manager.utils';
import type { LocationItem, ResponsiveBoxItem, ResponsiveBoxProperties } from '@ts/ui/responsive_box';
import ResponsiveBox from '@ts/ui/responsive_box';

const FORM_EDITOR_BY_DEFAULT = 'dxTextBox';

export const LAYOUT_MANAGER_FIRST_ROW_CLASS = 'dx-first-row';
export const LAYOUT_MANAGER_LAST_ROW_CLASS = 'dx-last-row';
export const LAYOUT_MANAGER_FIRST_COL_CLASS = 'dx-first-col';
export const LAYOUT_MANAGER_LAST_COL_CLASS = 'dx-last-col';
export const LAYOUT_MANAGER_COL_PREFIX = 'dx-col-';

const MIN_COLUMN_WIDTH = 200;

type ExtendedItem = Item & {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  alignItemLabels?: boolean;
  merged?: boolean;
  disabled?: boolean;
  allowIndeterminateState?: boolean;
};

type Location = Required<Omit<LocationItem, 'screen'>>;

interface LocationBoundaryFlags {
  isFirstCol: boolean;
  isLastCol: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
}

export interface TemplatesInfo {
  itemType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  $parent: dxElementWrapper;
  rootElementCssClassList: string[];
}

export interface ExtendedLayoutManagerProperties extends Omit<
  FormProperties, 'onFieldDataChanged' | 'onContentReady' | 'onDisposing'
> {
  isRoot?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layoutData?: any;
  cssItemClass?: string;
  form?: Form;
  validationBoundary?: EditorProperties['validationBoundary'];
  onFieldItemRendered?: () => void;
  onLayoutChanged?: (inOneColumn: boolean) => void;
  onFieldDataChanged?: (e: EventInfo<LayoutManager> & {
    dataField: string;
    value: unknown;
  }) => void;
  onContentReady?: (e: EventInfo<LayoutManager>) => void;
  onDisposing?: (e: EventInfo<LayoutManager>) => void;
}
export interface ConvertToLayoutManagerOptionsParams {
  form: Form;
  $formElement: dxElementWrapper;
  formOptions: FormProperties;
  items?: PreparedItem[] | PreparedItem<TabbedItem['tabs']> | undefined;
  validationGroup?: string;
  extendedLayoutManagerOptions: ExtendedLayoutManagerProperties;
  onFieldDataChanged?: (e: FieldDataChangedEvent) => void;
  onContentReady?: (e: EventInfo<LayoutManager>) => void;
  onDisposing?: (e: EventInfo<LayoutManager>) => void;
  onFieldItemRendered?: () => void;
}

export interface LayoutManagerProperties extends ExtendedLayoutManagerProperties {

}

class LayoutManager extends Widget<LayoutManagerProperties> {
  _itemsRunTimeInfo!: FormItemsRunTimeInfo;

  _itemWatchers!: unknown[];

  _responsiveBox!: ResponsiveBox;

  _disableEditorValueChangedHandler?: boolean;

  _items?: ExtendedItem[];

  _watch?: unknown;

  _labelTemplateRenderedCallCount?: number;

  _cashedColCount?: number | null;

  _getDefaultOptions(): ExtendedLayoutManagerProperties {
    return {
      ...super._getDefaultOptions(),
      layoutData: {},
      readOnly: false,
      colCount: 1,
      labelLocation: 'left',
      // @ts-expect-error ts-error
      onFieldDataChanged: null,
      // @ts-expect-error ts-error
      onEditorEnterKey: null,
      // @ts-expect-error ts-error
      customizeItem: null,
      alignItemLabels: true,
      minColWidth: MIN_COLUMN_WIDTH,
      showRequiredMark: true,
      // @ts-expect-error ts-error
      screenByWidth: null,
      showOptionalMark: false,
      requiredMark: '*',
      labelMode: 'outside',
      optionalMark: messageLocalization.format('dxForm-optionalMark'),
      // @ts-expect-error ts-error
      requiredMessage: messageLocalization.getFormatter('dxForm-requiredMessage'),
    };
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      layoutData: true,
      validationGroup: true,
    });
  }

  _init(): void {
    const { layoutData } = this.option();

    super._init();
    this._itemWatchers = [];
    this._itemsRunTimeInfo = new FormItemsRunTimeInfo();
    this._updateReferencedOptions(layoutData);
    this._initDataAndItems(layoutData);
  }

  _dispose(): void {
    super._dispose();

    this._cleanItemWatchers();
  }

  _initDataAndItems(initialData: unknown): void {
    this._syncDataWithItems();
    this._updateItems(initialData);
  }

  _syncDataWithItems(): void {
    const { layoutData, items } = this.option();

    if (isDefined(items)) {
      items.forEach((item: PreparedItem<SimpleItem>): void => {
        if (item.dataField && this._getDataByField(item.dataField) === undefined) {
          const value = item.editorOptions?.value;

          if (isDefined(value) || item.dataField in layoutData) {
            this._updateFieldValue(item.dataField, value);
          }
        }
      });
    }
  }

  _getDataByField(dataField: string | undefined): unknown | null {
    return dataField ? this.option(`layoutData.${dataField}`) : null;
  }

  _isCheckboxUndefinedStateEnabled(
    allowIndeterminateState: boolean | undefined,
    editorType: FormItemComponent | undefined,
    dataField: string,
  ): boolean {
    if (allowIndeterminateState && editorType === 'dxCheckBox') {
      const nameParts = ['layoutData', ...dataField.split('.')];
      const propertyName = nameParts.pop();
      const layoutData = this.option(nameParts.join('.'));

      if (!propertyName) return false;

      return layoutData && (propertyName in layoutData);
    }

    return false;
  }

  _updateFieldValue(
    dataField: string | undefined,
    value: unknown,
  ): void {
    const { layoutData } = this.option();
    let newValue = value;
    // @ts-expect-error ts-error
    if (!variableWrapper.isWrapped(layoutData[dataField]) && isDefined(dataField)) {
      this.option(`layoutData.${dataField}`, newValue);
      // @ts-expect-error ts-error
    } else if (variableWrapper.isWritableWrapped(layoutData[dataField])) {
      newValue = isFunction(newValue) ? newValue() : newValue;
      // @ts-expect-error ts-error
      layoutData[dataField](newValue);
    }

    this._triggerOnFieldDataChanged({ dataField, value: newValue });
  }

  _triggerOnFieldDataChanged(args: Partial<FieldDataChangedEvent>): void {
    this._createActionByOption('onFieldDataChanged')(args);
  }

  _updateItems(layoutData: unknown): void {
    const { items: userItems } = this.option();
    const isUserItemsExist = isDefined(userItems);
    const { customizeItem } = this.option();

    const items = isUserItemsExist ? userItems : this._generateItemsByData(layoutData);
    if (isDefined(items)) {
      const processedItems: ExtendedItem[] = [];

      each(items, (_index: number, item: ExtendedItem): void => {
        if (this._isAcceptableItem(item)) {
          // eslint-disable-next-line no-param-reassign
          item = this._processItem(item);

          customizeItem?.(item);

          if (isObject(item) && variableWrapper.unwrap(item.visible) !== false) {
            processedItems.push(item);
          }
        }
      });

      if (!this._itemWatchers.length || !isUserItemsExist) {
        this._updateItemWatchers(items);
      }

      this._setItems(processedItems);
      this._sortItems();
    }
  }

  _cleanItemWatchers(): void {
    this._itemWatchers.forEach((dispose) => {
      // @ts-expect-error ts-error
      dispose();
    });
    this._itemWatchers = [];
  }

  _updateItemWatchers(items: Item[]): void {
    const watch = this._getWatch();

    items.forEach((item) => {
      if (isObject(item) && isDefined(item.visible) && isFunction(watch)) {
        this._itemWatchers.push(
          watch(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            () => variableWrapper.unwrap(item.visible),
            (): void => {
              const { layoutData } = this.option();
              this._updateItems(layoutData);
              this.repaint();
            },
            { skipImmediate: true },
          ),
        );
      }
    });
  }

  _generateItemsByData(layoutData: unknown): Item[] {
    const result: Item[] = [];

    if (isDefined(layoutData)) {
      each(layoutData, (dataField: string): void => {
        result.push({
          dataField,
        });
      });
    }

    return result;
  }

  _isAcceptableItem(item: SimpleItem | string): boolean {
    const itemField = isString(item) ? item : item.dataField;

    const itemData = this._getDataByField(itemField);

    return !(isFunction(itemData) && !variableWrapper.isWrapped(itemData));
  }

  _processItem(item: SimpleItem | string): ExtendedItem {
    if (typeof item === 'string') {
      // eslint-disable-next-line no-param-reassign
      item = { dataField: item };
    }

    if (typeof item === 'object' && !item.itemType) {
      item.itemType = SIMPLE_ITEM_TYPE;
    }

    if (!isDefined(item.editorType) && isDefined(item.dataField)) {
      const value = this._getDataByField(item.dataField);

      item.editorType = isDefined(value)
        ? this._getEditorTypeByDataType(type(value))
        : FORM_EDITOR_BY_DEFAULT;
    }

    if (item.editorType === 'dxCheckBox') {
      // @ts-expect-error ts-error
      item.allowIndeterminateState = item.allowIndeterminateState ?? true;
    }

    return item as ExtendedItem;
  }

  _getEditorTypeByDataType(dataType: string): 'dxNumberBox' | 'dxDateBox' | 'dxCheckBox' | 'dxTextBox' {
    switch (dataType) {
      case 'number':
        return 'dxNumberBox';
      case 'date':
        return 'dxDateBox';
      case 'boolean':
        return 'dxCheckBox';
      default:
        return 'dxTextBox';
    }
  }

  _sortItems(): void {
    normalizeIndexes(this._items, 'visibleIndex');
    this._sortIndexes();
  }

  _sortIndexes(): void {
    this._items?.sort((itemA, itemB): number => {
      const indexA = itemA.visibleIndex;
      const indexB = itemB.visibleIndex;

      // @ts-expect-error ts-error
      if (indexA > indexB) {
        return 1;
        // @ts-expect-error ts-error
      } if (indexA < indexB) {
        return -1;
      }
      return 0;
    });
  }

  _initMarkup(): void {
    this._itemsRunTimeInfo.clear();
    this.$element().addClass(FORM_LAYOUT_MANAGER_CLASS);

    super._initMarkup();
    this._renderResponsiveBox();
  }

  _renderResponsiveBox(): void {
    const templatesInfo: TemplatesInfo[] = [];

    if (this._items?.length) {
      const colCount = this._getColCount();
      const $container = $('<div>').appendTo(this.$element());

      this._prepareItemsWithMerging(colCount);

      const layoutItems = this._generateLayoutItems();
      this._responsiveBox = super._createComponent(
        $container,
        ResponsiveBox,
        this._getResponsiveBoxConfig(layoutItems, colCount, templatesInfo),
      );
      if (!hasWindow()) {
        this._renderTemplates(templatesInfo);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _itemStateChangedHandler(args: {
    name: string;
    state: unknown;
    oldState: unknown;
  }): void {
    this._refresh();
  }

  _renderTemplates(templatesInfo: TemplatesInfo[]): void {
    let itemsWithLabelTemplateCount = 0;

    templatesInfo.forEach(({ item }) => {
      if (item?.label?.template) {
        itemsWithLabelTemplateCount += 1;
      }
    });

    each(templatesInfo, (_index: number, info: TemplatesInfo) => {
      switch (info.itemType) {
        case 'empty':
          renderEmptyItem(info);
          break;
        case 'button':
          this._renderButtonItem(info);
          break;
        default: {
          this._renderFieldItem(info, itemsWithLabelTemplateCount);
        }
      }
    });
  }

  _getResponsiveBoxConfig(
    layoutItems: ResponsiveBoxItem[],
    colCount: number,
    templatesInfo: TemplatesInfo[],
  ): ResponsiveBoxProperties {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const { colCountByScreen, screenByWidth } = this.option();

    const xsColCount = colCountByScreen?.xs;

    return {
      onItemStateChanged: this._itemStateChangedHandler.bind(this),
      onLayoutChanged: (): void => {
        const { onLayoutChanged } = this.option();
        const isSingleColumnMode = this.isSingleColumnMode();

        if (onLayoutChanged) {
          this.$element().toggleClass(LAYOUT_MANAGER_ONE_COLUMN, isSingleColumnMode);
          onLayoutChanged(isSingleColumnMode);
        }
      },
      onContentReady: (e: EventInfo<ResponsiveBox>): void => {
        if (hasWindow()) {
          this._renderTemplates(templatesInfo);
        }

        const { onLayoutChanged } = this.option();

        if (onLayoutChanged) {
          this.$element()
            .toggleClass(LAYOUT_MANAGER_ONE_COLUMN, this.isSingleColumnMode(e.component));
        }
      },
      itemTemplate(
        itemData: ResponsiveBoxItem<Required<LocationItem>>,
        _index: number,
        itemElement: Element,
      ): void {
        const { location } = itemData;

        if (!location) {
          return;
        }
        const $itemElement = $(itemElement);

        const item = that._getLayoutManagerItemByLocation(location);
        if (!item) {
          return;
        }

        const { isRoot } = that.option();

        if (item.itemType === SIMPLE_ITEM_TYPE && isRoot) {
          $itemElement.addClass(ROOT_SIMPLE_ITEM_CLASS);
        }

        $itemElement.toggleClass(SINGLE_COLUMN_ITEM_CONTENT, that.isSingleColumnMode(this));

        const itemCssClassList: string[] = [item.cssClass ?? ''];
        itemCssClassList.push(...that._getLocationCssClasses(location));

        if (item.itemType !== 'empty') {
          itemCssClassList.push(FIELD_ITEM_CLASS);

          const { cssItemClass = '' } = that.option();

          itemCssClassList.push(cssItemClass);

          if (isDefined(item.col)) {
            itemCssClassList.push(`${LAYOUT_MANAGER_COL_PREFIX}${item.col}`);
          }
        }

        templatesInfo.push({
          itemType: item.itemType,
          item,
          $parent: $itemElement,
          rootElementCssClassList: itemCssClassList,
        });
      },
      cols: this._generateRatio(colCount),
      rows: this._generateRatio(this._getRowsCount(), true),
      dataSource: layoutItems,
      screenByWidth,
      // @ts-expect-error ts-error
      singleColumnScreen: xsColCount ? false : 'xs',
    };
  }

  _getColCount(): number {
    let { colCount } = this.option();
    const colCountByScreen = this.option('colCountByScreen');

    if (colCountByScreen) {
      const { form } = this.option();
      let screenFactor = form?.getTargetScreenFactor();
      if (!screenFactor) {
        screenFactor = hasWindow() ? getCurrentScreenFactor(this.option('screenByWidth')) : 'lg';
      }
      // @ts-expect-error ts-error
      colCount = colCountByScreen[screenFactor] || colCount;
    }

    if (colCount === 'auto') {
      if (this._cashedColCount) {
        return this._cashedColCount;
      }

      colCount = this._getMaxColCount();
      this._cashedColCount = colCount;
    }
    // @ts-expect-error ts-error
    return colCount < 1 ? 1 : colCount;
  }

  _getMaxColCount(): number {
    if (!hasWindow()) {
      return 1;
    }

    const { minColWidth = MIN_COLUMN_WIDTH } = this.option();
    const width = getWidth(this.$element());
    // @ts-expect-error ts-error
    const itemsCount = this._items.length;

    const maxColCount = Math.floor(width / minColWidth) || 1;

    return itemsCount < maxColCount
      ? itemsCount
      : maxColCount;
  }

  isCachedColCountObsolete(): boolean {
    return !!this._cashedColCount && this._getMaxColCount() !== this._cashedColCount;
  }

  _prepareItemsWithMerging(colCount: number): void {
    const items = (this._items ?? []).slice(0);
    let result: ExtendedItem[] = [];

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      result.push(item);

      const { alignItemLabels } = this.option();

      if (alignItemLabels || item.alignItemLabels || item.colSpan) {
        item.col = this._getColByIndex(result.length - 1, colCount);
      }
      if (item.colSpan > 1 && (item.col + item.colSpan <= colCount)) {
        const itemsMergedByCol: ExtendedItem[] = [];
        for (let j = 0; j < item.colSpan - 1; j += 1) {
          itemsMergedByCol.push({ merged: true } as ExtendedItem);
        }
        result = result.concat(itemsMergedByCol);
      } else {
        // @ts-expect-error ts-error
        delete item.colSpan;
      }
    }
    this._setItems(result);
  }

  _getColByIndex(index: number, colCount: number): number {
    return index % colCount;
  }

  _setItems(items: ExtendedItem[]): void {
    this._items = items;
    this._cashedColCount = null; // T923489
  }

  _generateLayoutItems(): ResponsiveBoxItem[] {
    const items = this._items ?? [];
    const colCount = this._getColCount();
    const result: ResponsiveBoxItem[] = [];

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (!item.merged) {
        const location: LocationItem = {
          row: parseInt(String(i / colCount), 10),
          col: this._getColByIndex(i, colCount),
        };

        if (isDefined(item.colSpan)) {
          location.colspan = item.colSpan;
        }
        if (isDefined(item.rowSpan)) {
          location.rowspan = item.rowSpan;
        }

        const generatedItem: ResponsiveBoxItem<LocationItem> = {
          location,
        };
        if (isDefined(item.disabled)) {
          generatedItem.disabled = item.disabled;
        }
        if (isDefined(item.visible)) {
          generatedItem.visible = item.visible;
        }

        result.push(generatedItem);
      }
    }

    return result;
  }

  private _handleSmartPasteClick(): void {
    const form = this._getFormOrThis();
    // @ts-expect-error
    form?.smartPaste();
  }

  private _handleResetClick(): void {
    const form = this._getFormOrThis();
    // @ts-expect-error
    form?.reset();
  }

  private _configureDefaultButton(item: ButtonItem): void {
    if (!item.name) {
      return;
    }

    const buttonConfigs = {
      smartPaste: {
        icon: 'clipboardpastesparkle',
        text: messageLocalization.format('dxForm-smartPasteButtonText'),
        stylingMode: 'outlined',
        type: 'normal',
        onClick: (): void => {
          this._handleSmartPasteClick();
        },
      },
      reset: {
        text: messageLocalization.format('dxForm-resetButtonText'),
        stylingMode: 'outlined',
        type: 'normal',
        onClick: (): void => {
          this._handleResetClick();
        },
      },
      submit: {
        text: messageLocalization.format('dxForm-submitButtonText'),
        stylingMode: 'contained',
        type: 'default',
        useSubmitBehavior: true,
      },
    };

    const config = buttonConfigs[item.name];
    if (config) {
      item.buttonOptions = {
        ...config,
        ...item.buttonOptions ?? {},
      };
    }
  }

  _renderButtonItem(info: TemplatesInfo): void {
    const { item, $parent, rootElementCssClassList } = info;
    const { validationGroup } = this.option();

    this._configureDefaultButton(item);

    const { $rootElement, buttonInstance } = renderButtonItem({
      item,
      $parent,
      rootElementCssClassList,
      validationGroup,
      createComponentCallback: (
        $element: dxElementWrapper,
        options: Properties,
      ) => super._createComponent<Button, ButtonProperties>($element, Button, options),
    });

    // TODO: try to remove '_itemsRunTimeInfo' from 'render' function
    this._itemsRunTimeInfo.add({
      item,
      widgetInstance: buttonInstance, // TODO: try to remove 'widgetInstance'
      guid: item.guid,
      $itemContainer: $rootElement,
    });
  }

  _renderFieldItem(
    info: TemplatesInfo,
    itemsWithLabelTemplateCount: number,
  ): void {
    const { item, $parent, rootElementCssClassList } = info;
    const editorValue = this._getDataByField(item.dataField);
    let canAssignUndefinedValueToEditor = false;
    if (editorValue === undefined) {
      const { allowIndeterminateState, editorType, dataField } = item;
      canAssignUndefinedValueToEditor = this._isCheckboxUndefinedStateEnabled(
        allowIndeterminateState,
        editorType,
        dataField,
      );
    }

    const name = item.dataField || item.name;
    const formOrLayoutManager = this._getFormOrThis();

    const onLabelTemplateRendered = (): void => {
      this._incTemplateRenderedCallCount();

      if (this._shouldAlignLabelsOnTemplateRendered(
        formOrLayoutManager,
        itemsWithLabelTemplateCount,
      )) {
        // @ts-expect-error ts-error
        formOrLayoutManager._alignLabels(this, this.isSingleColumnMode(formOrLayoutManager));
      }
    };

    const {
      form,
      labelLocation,
      requiredMessage,
      validationGroup,
      validationBoundary,
      showColonAfterLabel,
      labelMode,
    } = this.option();

    const fieldItemOptions = convertToRenderFieldItemOptions({
      $parent,
      rootElementCssClassList,
      item,
      name,
      editorValue,
      canAssignUndefinedValueToEditor,
      formOrLayoutManager: this._getFormOrThis(),
      createComponentCallback: this._createComponent.bind(this),
      formLabelLocation: labelLocation,
      // @ts-expect-error ts-error
      requiredMessageTemplate: requiredMessage,
      validationGroup,
      editorValidationBoundary: validationBoundary,
      // @ts-expect-error ts-error
      editorStylingMode: form?.option('stylingMode'),
      showColonAfterLabel: Boolean(showColonAfterLabel),
      managerLabelLocation: labelLocation,
      template: item.template ? this._getTemplate(item.template) : null,
      labelTemplate: item.label?.template ? this._getTemplate(item.label.template) : null,
      // @ts-expect-error ts-error
      itemId: form?.getItemID(name),
      managerMarkOptions: this._getMarkOptions(),
      labelMode,
      onLabelTemplateRendered,
    });

    const {
      $fieldEditorContainer,
      widgetInstance,
      $rootElement,
    } = renderFieldItem(fieldItemOptions);

    const { onFieldItemRendered } = this.option();
    onFieldItemRendered?.();

    if (widgetInstance && item.dataField) {
      // TODO: move to renderFieldItem ?
      this._bindDataField(widgetInstance, item.dataField, $fieldEditorContainer);
    }
    this._itemsRunTimeInfo.add({
      item,
      widgetInstance,
      guid: item.guid,
      $itemContainer: $rootElement,
    });
  }

  _incTemplateRenderedCallCount(): void {
    this._labelTemplateRenderedCallCount = (this._labelTemplateRenderedCallCount ?? 0) + 1;
  }

  _shouldAlignLabelsOnTemplateRendered(
    formOrLayoutManager: Form | LayoutManager,
    totalItemsWithLabelTemplate: number,
  ): boolean {
    const { templatesRenderAsynchronously } = formOrLayoutManager.option();

    return !!templatesRenderAsynchronously
      && this._labelTemplateRenderedCallCount === totalItemsWithLabelTemplate;
  }

  _getMarkOptions(): LabelMarkOptions {
    const {
      showRequiredMark,
      requiredMark,
      showOptionalMark,
      optionalMark,
    } = this.option();

    return {
      showRequiredMark,
      requiredMark,
      showOptionalMark,
      optionalMark,
    };
  }

  _getFormOrThis(): Form | LayoutManager {
    const { form } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return form || this;
  }

  _bindDataField(
    editorInstance: Editor,
    dataField: string,
    $container: dxElementWrapper,
  ): void {
    const formOrThis = this._getFormOrThis();

    editorInstance.on('enterKey', (args) => {
      formOrThis._createActionByOption('onEditorEnterKey')(extend(args, { dataField }));
    });

    this._createWatcher(editorInstance, $container, dataField);
    this.linkEditorToDataField(editorInstance, dataField);
  }

  _createWatcher(
    editorInstance: Editor,
    $container: dxElementWrapper,
    dataField: string,
  ): void {
    function compareArrays(array1: unknown, array2: unknown): boolean {
      if (!Array.isArray(array1) || !Array.isArray(array2) || (array1.length !== array2.length)) {
        return false;
      }
      for (let i = 0; i < array1.length; i += 1) {
        if (array1[i] !== array2[i]) {
          return false;
        }
      }
      return true;
    }

    const watch = this._getWatch();

    if (!isFunction(watch)) {
      return;
    }

    const dispose = watch(
      () => this._getDataByField(dataField),
      () => {
        const fieldValue = this._getDataByField(dataField);
        if (editorInstance.NAME === 'dxTagBox') {
          const editorValue = editorInstance.option('value');
          if ((fieldValue !== editorValue) && compareArrays(fieldValue, editorValue)) {
            // handle array only, it can be wrapped into Proxy (T1020953)
            return;
          }
        }
        editorInstance.option('value', fieldValue);
      },
      {
        deep: true,
        skipImmediate: true,
      },
      /// #DEBUG
      { createWatcherDataField: dataField },
      /// #ENDDEBUG
    );

    eventsEngine.on($container, removeEvent, dispose);
  }

  _getWatch(): unknown {
    if (!isDefined(this._watch)) {
      const { form: formInstance } = this.option();

      this._watch = formInstance?.option('integrationOptions.watchMethod');
    }

    return this._watch;
  }

  // @ts-expect-error ts-error
  _createComponent(
    $editor: dxElementWrapper,
    component: string,
    editorOptions: EditorProperties,
  ): Editor {
    const { readOnly: readOnlyState } = this.option();
    // @ts-expect-error ts-error
    let hasEditorReadOnly = Object.hasOwn(editorOptions, 'readOnly');
    const instance = super._createComponent<Editor>($editor, component, {
      ...editorOptions,
      readOnly: !hasEditorReadOnly ? readOnlyState : editorOptions.readOnly,
    });

    let isChangeByForm = false;
    instance.on('optionChanged', (args: OptionChanged<EditorProperties>) => {
      if (args.name === 'readOnly' && !isChangeByForm) {
        hasEditorReadOnly = true;
      }
    });

    this.on('optionChanged', (args: OptionChanged<FormProperties>) => {
      if (args.name === 'readOnly' && !hasEditorReadOnly) {
        isChangeByForm = true;
        instance.option(args.name, args.value);
        isChangeByForm = false;
      }
    });

    return instance;
  }

  _generateRatio(count: number, isAutoSize?: boolean): ResponsiveBoxItem[] {
    const result: ResponsiveBoxItem[] = [];

    for (let i = 0; i < count; i += 1) {
      const ratio: ResponsiveBoxItem = { ratio: 1 };
      if (isAutoSize) {
        ratio.baseSize = 'auto';
      }
      result.push(ratio);
    }

    return result;
  }

  _getRowsCount(): number {
    const items = this._items ?? [];
    return Math.ceil(items.length / this._getColCount());
  }

  _updateReferencedOptions(newLayoutData: unknown): void {
    const layoutData = this.option('layoutData');

    if (isObject(layoutData)) {
      Object.getOwnPropertyNames(layoutData)
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        .forEach((property) => delete this._optionsByReference[`layoutData.${property}`]);
    }

    if (isObject(newLayoutData)) {
      Object.getOwnPropertyNames(newLayoutData)
        // eslint-disable-next-line no-return-assign
        .forEach((property) => this._optionsByReference[`layoutData.${property}`] = true);
    }
  }

  _clearWidget(instance: Editor): void {
    this._disableEditorValueChangedHandler = true;
    instance.clear();
    this._disableEditorValueChangedHandler = false;
    instance.option('isValid', true);
  }

  _optionChanged(args: OptionChanged<ExtendedLayoutManagerProperties>): void {
    if (args.fullName.search('layoutData.') === 0) {
      return;
    }

    switch (args.name) {
      case 'showRequiredMark':
      case 'showOptionalMark':
      case 'requiredMark':
      case 'optionalMark':
        this._invalidate();
        break;
      case 'layoutData': {
        this._updateReferencedOptions(args.value);

        const { items } = this.option();
        if (items) {
          if (!isEmptyObject(args.value)) {
            this._itemsRunTimeInfo.each((_, itemRunTimeInfo: FormItemRuntimeInfo<SimpleItem>) => {
              if (isDefined(itemRunTimeInfo.item)) {
                const { dataField } = itemRunTimeInfo.item;

                if (dataField && isDefined(itemRunTimeInfo.widgetInstance)) {
                  const valueGetter = compileGetter(dataField);
                  // @ts-expect-error ts-error
                  const dataValue = valueGetter(args.value);

                  const { allowIndeterminateState, editorType } = itemRunTimeInfo.item;
                  if (dataValue !== undefined || this._isCheckboxUndefinedStateEnabled(
                    allowIndeterminateState,
                    editorType,
                    dataField,
                  )) {
                    itemRunTimeInfo.widgetInstance.option('value', dataValue);
                  } else {
                    this._clearWidget(itemRunTimeInfo.widgetInstance as Editor);
                  }
                }
              }
            });
          }
        } else {
          this._initDataAndItems(args.value);
          this._invalidate();
        }
        break;
      }
      case 'items':
        this._cleanItemWatchers();
        this._initDataAndItems(args.value);
        this._invalidate();
        break;
      case 'alignItemLabels':
      case 'labelLocation':
      case 'labelMode':
      case 'requiredMessage':
        this._invalidate();
        break;
      case 'customizeItem':
        this._updateItems(this.option('layoutData'));
        this._invalidate();
        break;
      case 'colCount':
      case 'colCountByScreen':
        this._resetColCount();
        break;
      case 'minColWidth': {
        const { colCount } = this.option();
        if (colCount === 'auto') {
          this._resetColCount();
        }
        break;
      }
      case 'readOnly':
        break;
      case 'width': {
        super._optionChanged(args);

        const { colCount } = this.option();
        if (colCount === 'auto') {
          this._resetColCount();
        }
        break;
      }
      case 'onFieldDataChanged':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _resetColCount(): void {
    this._cashedColCount = null;
    this._invalidate();
  }

  updateResponsiveBoxLayout(): void {
    if (!this._responsiveBox) {
      return;
    }

    this._cashedColCount = null;

    this._items = (this._items ?? []).filter((item) => !item.merged);

    const colCount = this._getColCount();
    this._prepareItemsWithMerging(colCount);

    const newLayoutItems = this._generateLayoutItems();

    const { items: responsiveBoxItems } = this._responsiveBox.option();
    const existingItems: ResponsiveBoxItem[] = responsiveBoxItems ?? [];

    for (let i = 0; i < existingItems.length && i < newLayoutItems.length; i += 1) {
      existingItems[i].location = newLayoutItems[i].location;
    }

    const newCols = this._generateRatio(colCount);
    const newRows = this._generateRatio(this._getRowsCount(), true);

    this._responsiveBox._options.silent({
      cols: newCols,
      rows: newRows,
    });

    this._responsiveBox.repaint();
    this._updateItemsCssClasses();
  }

  _getLocationBoundaryFlags(location: Required<Omit<LocationItem, 'screen'>>): LocationBoundaryFlags {
    const colCount = this._getColCount();
    const rowsCount = this._getRowsCount();

    return {
      isFirstCol: location.col === 0,
      isLastCol: (location.col === colCount - 1)
        || (location.col + location.colspan === colCount),
      isFirstRow: location.row === 0,
      isLastRow: location.row === rowsCount - 1,
    };
  }

  _getLocationCssClasses(location: Location): string[] {
    const cssClasses: string[] = [];
    const locationFlags = this._getLocationBoundaryFlags(location);

    if (locationFlags.isFirstRow) {
      cssClasses.push(LAYOUT_MANAGER_FIRST_ROW_CLASS);
    }
    if (locationFlags.isFirstCol) {
      cssClasses.push(LAYOUT_MANAGER_FIRST_COL_CLASS);
    }
    if (locationFlags.isLastCol) {
      cssClasses.push(LAYOUT_MANAGER_LAST_COL_CLASS);
    }
    if (locationFlags.isLastRow) {
      cssClasses.push(LAYOUT_MANAGER_LAST_ROW_CLASS);
    }

    return cssClasses;
  }

  _getLayoutManagerItemByLocation(location: Location): ExtendedItem | undefined {
    const colCount = this._getColCount();
    const index = location.row * colCount + location.col;
    return this._items?.[index];
  }

  _updateItemsCssClasses(): void {
    const { items: responsiveBoxItems } = this._responsiveBox.option();
    responsiveBoxItems?.forEach((
      responsiveBoxItem: ResponsiveBoxItem,
    ): void => {
      const { location } = responsiveBoxItem;
      if (!location || Array.isArray(location)) {
        return;
      }

      const typedLocation = location as Location;

      const {
        isFirstCol,
        isLastCol,
        isFirstRow,
        isLastRow,
      } = this._getLocationBoundaryFlags(typedLocation);

      const item = this._getLayoutManagerItemByLocation(typedLocation);
      if (!item || item.itemType === 'empty') {
        return;
      }

      const $itemContainer = this._itemsRunTimeInfo.findItemContainerByItem(item);
      $itemContainer
        .toggleClass(LAYOUT_MANAGER_FIRST_COL_CLASS, isFirstCol)
        .toggleClass(LAYOUT_MANAGER_LAST_COL_CLASS, isLastCol)
        .toggleClass(LAYOUT_MANAGER_FIRST_ROW_CLASS, isFirstRow)
        .toggleClass(LAYOUT_MANAGER_LAST_ROW_CLASS, isLastRow);

      const element = $itemContainer.get(0);
      element.className = [...element.classList]
        .filter((name: string): boolean => !name.startsWith(LAYOUT_MANAGER_COL_PREFIX))
        .join(' ');

      if (isDefined(typedLocation.col)) {
        $itemContainer.addClass(`${LAYOUT_MANAGER_COL_PREFIX}${typedLocation.col}`);
      }
    });
  }

  linkEditorToDataField(editorInstance: Editor, dataField: string): void {
    this.on('optionChanged', (args: OptionChanged<FormProperties>): void => {
      if (args.fullName === `layoutData.${dataField}`) {
        editorInstance._setOptionWithoutOptionChange('value', args.value);
      }
    });
    editorInstance.on('valueChanged', (args): void => {
      // TODO: This need only for the KO integration
      const isValueReferenceType = isObject(args.value) || Array.isArray(args.value);
      if (!this._disableEditorValueChangedHandler
          && !(isValueReferenceType && args.value === args.previousValue)) {
        this._updateFieldValue(dataField, args.value);
      }
    });
  }

  _dimensionChanged(): void {
    const { colCount } = this.option();
    if (colCount === 'auto' && this.isCachedColCountObsolete()) {
      this._eventsStrategy.fireEvent('autoColCountChanged');
    }
  }

  updateData(data: unknown, value: unknown): void {
    if (isObject(data)) {
      each(data, (dataField: string, fieldValue: unknown): void => {
        this._updateFieldValue(dataField, fieldValue);
      });
    } else if (typeof data === 'string') {
      this._updateFieldValue(data, value);
    }
  }

  getEditor(field: string): Editor | undefined {
    return this._itemsRunTimeInfo.findWidgetInstanceByDataField(field)
      ?? this._itemsRunTimeInfo.findWidgetInstanceByName(field);
  }

  isSingleColumnMode(component?: ResponsiveBox): boolean {
    const responsiveBox = this._responsiveBox || component;
    if (responsiveBox) {
      const { currentScreenFactor, singleColumnScreen } = responsiveBox.option();
      return currentScreenFactor === singleColumnScreen;
    }
    return false;
  }

  getItemsRunTimeInfo(): FormItemsRunTimeInfo {
    return this._itemsRunTimeInfo;
  }
}

registerComponent('dxLayoutManager', LayoutManager);

export default LayoutManager;
