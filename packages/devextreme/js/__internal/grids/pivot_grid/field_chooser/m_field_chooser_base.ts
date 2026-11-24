/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import { addNamespace } from '@js/common/core/events/utils/index';
import localizationMessage from '@js/common/core/localization/message';
import ArrayStore from '@js/common/data/array_store';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { SearchBoxMixinOptions } from '@js/ui/widget/ui.search_box_mixin';
import { getData, setData } from '@ts/core/element_data';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import eventsEngine from '@ts/events/core/events_engine';
import columnStateMixin from '@ts/grids/grid_core/column_state_mixin/column_state_mixin';
import type { ColumnStateOptions } from '@ts/grids/grid_core/column_state_mixin/types';
import { HeaderFilterView as HeaderFilterViewBase } from '@ts/grids/grid_core/header_filter/header_filter_core';
import type { HeaderFilterOptions, HeaderFilterViewOptions } from '@ts/grids/grid_core/header_filter/types';
import sortingMixin from '@ts/grids/grid_core/sorting/sorting_mixin';
import type { AriaSortState, SortingColumn } from '@ts/grids/grid_core/sorting/types';
import type { InternalGrid } from '@ts/grids/grid_core/types';
import Scrollable from '@ts/ui/scroll_view/scrollable';

import type { PivotGridDataSource } from '../data_source/data_source';
import type { DataSourceHeaderItem } from '../data_source/types';
import { RovingTabIndex } from '../keyboard_navigation/roving_tab_index';
import type { PivotGrid } from '../m_widget';
import SortableModule from '../sortable/sortable';
import type {
  OldSortableChangedArgs,
  OldSortableDraggingArgs,
  OldSortableProperties,
} from '../sortable/types';
import type { PivotGridField } from '../types';
import { getFieldItemA11yLabel } from './a11y';
import type { FieldChooserField, SortOrderType } from './const';
import {
  ATTRIBUTES, CLASSES, FIELD_DATA_KEY, FIELD_NAVIGATION_DELTAS,
} from './const';
import { dragAndDropItemRender } from './dom';
import type { FieldChooser } from './m_field_chooser';
import type {
  FieldChooserBaseProperties,
  FieldChooserFieldEvent,
  FieldChooserHeaderFilterField,
  FieldChooserHeaderFilterItem,
} from './types';
import {
  fieldHasHeaderFilter,
  getFieldSortOrder,
  getMainGroupField,
  getStringState,
  isContextMenuKeyEvent,
  isFieldNavigationEvent,
  isPivotGridArea,
  isPivotGridDataSource,
  processItems,
  reverseSortOrder,
  shouldCancelDragging,
} from './utils';

const { Sortable } = SortableModule;

const DIV = '<div>';

const FIELD_AREAS = ['filter', 'row', 'column', 'data'];

class HeaderFilterView extends HeaderFilterViewBase {
  protected _getSearchExpr(
    options: HeaderFilterViewOptions,
    headerFilterOptions: HeaderFilterOptions,
  ): SearchBoxMixinOptions['searchExpr'] {
    options.useDefaultSearchExpr = true;
    return super._getSearchExpr(options, headerFilterOptions);
  }
}

// @ts-expect-error the sorting and column state mixins are typed for grid views
const mixinWidget: typeof Widget = sortingMixin(columnStateMixin(Widget));

export class FieldChooserBase extends mixinWidget<FieldChooserBaseProperties> {
  protected declare _applyColumnState: (
    options: ColumnStateOptions,
  ) => dxElementWrapper | undefined;

  protected declare _getIndicatorContainer: ($cell: dxElementWrapper) => dxElementWrapper;

  protected _dataSource?: PivotGridDataSource;

  protected _headerFilterView!: HeaderFilterView;

  protected _skipStateChange?: boolean;

  protected _changedHandler?: () => void;

  private _focusedFieldIndex = -1;

  // NOTE: no initializer — class field initializers do not run for classes
  // built on the legacy DevExtreme class system in the systemjs build.
  private _fieldNavigationMap: Record<string, RovingTabIndex> | undefined;

  public _getDefaultOptions(): FieldChooserBaseProperties {
    return {
      ...super._getDefaultOptions(),
      ...{
        allowFieldDragging: true,
        applyChangesMode: 'instantly',
        state: undefined,
        onFieldContextMenuKeyDown: null,
        headerFilter: {
          width: 252,
          height: 325,
          allowSelectAll: true,
          showRelevantValues: false,
          search: {
            enabled: false,
            timeout: 500,
            editorOptions: {},
            mode: 'contains',
          },
          texts: {
            emptyValue: localizationMessage.format('dxDataGrid-headerFilterEmptyValue'),
            ok: localizationMessage.format('dxDataGrid-headerFilterOK'),
            cancel: localizationMessage.format('dxDataGrid-headerFilterCancel'),
          },
        },
        // NOTE: private option added in fix of the T1150523 ticket.
        remoteSort: false,
      },
    };
  }

  protected _setAriaSortAttribute(
    column: SortingColumn,
    ariaSortState: AriaSortState | undefined,
    $rootElement: dxElementWrapper,
  ): void;

  protected _setAriaSortAttribute(): void { }

  public _init(): void {
    super._init();
    this._headerFilterView = new HeaderFilterView(this as unknown as InternalGrid);
    this._refreshDataSource();
    this.subscribeToEvents();
  }

  protected _refreshDataSource(): void {
    const dataSource = this.option('dataSource');

    // Field indexes are only meaningful within one data source, so the roving
    // tab stops fall back to the first field of each area.
    this._resetFieldNavigation();

    if (isPivotGridDataSource(dataSource)) {
      this._dataSource = dataSource;
    }
  }

  private _resetFieldNavigation(): void {
    Object.values(this._fieldNavigationMap ?? {}).forEach((navigation) => {
      navigation.reset();
    });
  }

  public _optionChanged(args: OptionChanged<FieldChooserBaseProperties>): void {
    switch (args.name) {
      case 'dataSource':
        this._refreshDataSource();
        break;
      case 'applyChangesMode':
      case 'remoteSort':
      case 'onFieldContextMenuKeyDown':
        break;
      case 'state':
        if (this._skipStateChange || !this._dataSource) {
          break;
        }

        if (this.option('applyChangesMode') === 'instantly'
            && getStringState(this._dataSource.state()) !== getStringState(args.value)) {
          this._dataSource.state(args.value);
        } else {
          this._clean(true);
          this._renderComponent();
        }
        break;
      case 'headerFilter':
      case 'allowFieldDragging':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }

  public renderField(field: FieldChooserField, showColumnLines: boolean): dxElementWrapper {
    const caption = field.caption ?? field.dataField ?? '';
    const $fieldContent = $(DIV).addClass(CLASSES.area.fieldContent)
      .text(caption);
    const $fieldElement = $(DIV)
      .addClass(CLASSES.area.field)
      .addClass(CLASSES.area.box)
      .attr('tabIndex', 0)
      .append($fieldContent);
    setData($fieldElement, FIELD_DATA_KEY, field);

    if (field.area !== 'data') {
      if (field.allowSorting) {
        this._applyColumnState({
          name: 'sort',
          rootElement: $fieldElement,
          column: {
            alignment: this.option('rtlEnabled') ? 'right' : 'left',
            sortOrder: getFieldSortOrder(field),
            allowSorting: field.allowSorting,
            caption,
          },
          showColumnLines,
        });
      }

      this._renderHeaderFilterIcon($fieldElement, field, showColumnLines);
    }

    if (field.groupName) {
      $fieldElement.attr(ATTRIBUTES.itemGroup, field.groupName);
    }

    $fieldElement
      .attr('role', 'menuitem')
      .attr('aria-label', this._getFieldItemAriaLabel(field, caption));

    return $fieldElement;
  }

  private _getFieldItemAriaLabel(field: FieldChooserField, caption: string): string {
    // The sort indicator is rendered for every sortable non-data field, with
    // ascending shown by default, so the label mirrors the visible state.
    const sortOrder = field.allowSorting && field.area !== 'data'
      ? getFieldSortOrder(field)
      : undefined;
    const hasHeaderFilterValue = !!this._dataSource
      && fieldHasHeaderFilter(this._dataSource, field)
      && !!getMainGroupField(this._dataSource, field).filterValues?.length;

    return getFieldItemA11yLabel(caption, { sortOrder, hasHeaderFilterValue });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public _clean(value?: boolean): void {
  }

  public _render(): void {
    super._render();
    this._headerFilterView.render(this.$element());
  }

  public renderSortable(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- the methods use their own this
    const that = this;

    this._createComponent(this.$element(), Sortable, extend({
      allowDragging: this.option('allowFieldDragging'),
      itemSelector: `.${CLASSES.area.field}`,
      itemContainerSelector: `.${CLASSES.area.fieldContainer}`,
      groupSelector: `.${CLASSES.area.fieldList}`,
      groupFilter(this: Element): boolean {
        const dataSource = that._dataSource;
        const $sortable = $(this).closest('.dx-sortable-old');
        const pivotGrid = $sortable.data<PivotGrid | undefined>('dxPivotGrid');
        const pivotGridFieldChooser = $sortable
          .data<FieldChooser | undefined>('dxPivotGridFieldChooser');

        if (pivotGrid) {
          return pivotGrid.getDataSource() === dataSource;
        }
        if (pivotGridFieldChooser) {
          return pivotGridFieldChooser.option('dataSource') === dataSource;
        }
        return false;
      },
      itemRender: dragAndDropItemRender,
      onDragging(e: OldSortableDraggingArgs): void {
        const field = getData(e.sourceElement, FIELD_DATA_KEY);
        const { targetGroup } = e;
        e.cancel = shouldCancelDragging(field, targetGroup);
      },
      useIndicator: true,
      onChanged: (e: OldSortableChangedArgs): void => {
        const field = getData(e.sourceElement, FIELD_DATA_KEY);

        e.removeSourceElement = !!e.sourceGroup;

        this._adjustSortableOnChangedArgs(e);

        if (!field) {
          return;
        }

        const { targetGroup, targetIndex } = e;
        let invisibleFieldsIndexOffset = 0;

        const mainGroupField = this._processDemandState((dataSource) => {
          const fields = dataSource.getAreaFields(field.area, true);
          const visibleFields = fields.filter((f) => f.visible !== false);
          const fieldBeforeTarget = visibleFields[targetIndex - 1];

          if (fieldBeforeTarget) {
            invisibleFieldsIndexOffset = fields
              .filter((f) => f.visible === false
                  && Number(f.areaIndex) <= Number(fieldBeforeTarget.areaIndex))
              .length;
          }

          return getMainGroupField(dataSource, field);
        });

        if (!mainGroupField) {
          return;
        }

        this._applyChanges([mainGroupField], {
          area: isPivotGridArea(targetGroup) ? targetGroup : undefined,
          areaIndex: targetIndex + invisibleFieldsIndexOffset,
        });
      },
    }, this._getSortableOptions()));
  }

  protected _processDemandState<T>(
    func: (dataSource: PivotGridDataSource, isInstantlyMode: boolean) => T,
  ): T | undefined {
    const dataSource = this._dataSource;

    if (!dataSource) {
      return undefined;
    }

    const isInstantlyMode = this.option('applyChangesMode') === 'instantly';

    if (isInstantlyMode) {
      return func(dataSource, isInstantlyMode);
    }

    const currentState = dataSource.state();
    const pivotGridState = this.option('state');

    if (pivotGridState) {
      dataSource.state(pivotGridState, true);
    }

    const result = func(dataSource, isInstantlyMode);

    dataSource.state(currentState, true);

    return result;
  }

  protected _applyChanges(fields: FieldChooserField[], props: Partial<PivotGridField>): void {
    this._processDemandState((dataSource, isInstantlyMode) => {
      fields.forEach(({ index }) => {
        dataSource.field(index, props);
      });

      if (isInstantlyMode) {
        dataSource.load();
      } else {
        this._changedHandler?.();
      }
    });
  }

  private _applyLocalSortChanges(fieldIdx: number, sortOrder: SortOrderType): void {
    this._processDemandState((dataSource) => {
      dataSource.field(fieldIdx, { sortOrder });
      dataSource.sortLocal();
    });
  }

  protected _adjustSortableOnChangedArgs(e: OldSortableChangedArgs): void {
    e.removeSourceElement = false;
    e.removeTargetElement = true;
    e.removeSourceClass = false;
  }

  protected _getSortableOptions(): Partial<OldSortableProperties> {
    return {
      direction: 'auto',
    };
  }

  public subscribeToEvents(element?: dxElementWrapper | Element): void {
    const fieldSelector = `.${CLASSES.area.field}.${CLASSES.area.box}`;
    const targetElement = element ?? this.$element();

    const handler = (e: FieldChooserFieldEvent<KeyboardEvent>): void => {
      const field = getData($(e.currentTarget), FIELD_DATA_KEY);

      if (!field) {
        return;
      }

      const isClick = e.type === clickEventName
        || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '));
      const isAltArrowDown = e.type === 'keydown' && e.altKey && e.key === 'ArrowDown';
      const isHeaderFilterIconInteraction = isClick
        && $(e.target).hasClass(CLASSES.headerFilter);

      if (isAltArrowDown || isHeaderFilterIconInteraction) {
        if (this._dataSource && fieldHasHeaderFilter(this._dataSource, field)) {
          e.preventDefault();
          this.handleHeaderFilterIconClick(e, field);
        }

        return;
      }

      if (isFieldNavigationEvent(e)) {
        this._handleFieldNavigation(e, field);
        return;
      }

      if (isContextMenuKeyEvent(e)) {
        this._handleFieldContextMenuKey(e, field);
        return;
      }

      if (!isClick) {
        return;
      }

      if (field.allowSorting && field.area !== 'data') {
        e.preventDefault();
        this.handleFieldClick(field);
      }
    };

    const focusInHandler = (e: FieldChooserFieldEvent<FocusEvent>): void => {
      const $field = $(e.currentTarget);
      const field = getData($field, FIELD_DATA_KEY);

      if (!field) {
        return;
      }

      this._focusedFieldIndex = field.index;

      if (field.area) {
        this._getFieldNavigation(field.area).handleFocusIn(e.currentTarget);
      }
    };

    const focusOutHandler = (e: FieldChooserFieldEvent<FocusEvent>): void => {
      const relatedTarget = e.relatedTarget as Node | null;

      if (relatedTarget) {
        this._focusedFieldIndex = -1;
      }
    };

    eventsEngine.on(
      targetElement,
      addNamespace(clickEventName, 'dxPivotGridFieldChooserBase'),
      fieldSelector,
      handler,
    );
    eventsEngine.on(
      targetElement,
      addNamespace('keydown', 'dxPivotGridFieldChooserBase'),
      fieldSelector,
      handler,
    );
    eventsEngine.on(
      targetElement,
      addNamespace('focusin', 'dxPivotGridFieldChooserBase'),
      fieldSelector,
      focusInHandler,
    );
    eventsEngine.on(
      targetElement,
      addNamespace('focusout', 'dxPivotGridFieldChooserBase'),
      fieldSelector,
      focusOutHandler,
    );
  }

  public restoreFieldFocus(): void {
    this.updateFieldsTabIndexes();

    if (this._focusedFieldIndex !== -1) {
      this.focusFieldElement(this._focusedFieldIndex);
    }
  }

  protected updateFieldsTabIndexes(): void {
    FIELD_AREAS.forEach((area) => {
      this._getFieldNavigation(area).updateTabIndexes();
    });
  }

  private _getFieldNavigation(area: string): RovingTabIndex {
    this._fieldNavigationMap = this._fieldNavigationMap ?? {};
    this._fieldNavigationMap[area] = this._fieldNavigationMap[area] ?? new RovingTabIndex({
      component: this,
      getItems: (): HTMLElement[] => this._getAreaFieldElements(area),
      scrollToItem: (item: HTMLElement): void => this._scrollFieldElementToView(item),
      getItemId: (item: HTMLElement): string | undefined => this._getFieldElementId(item),
    });

    return this._fieldNavigationMap[area];
  }

  // field.index identifies the same logical field when fields are reordered,
  // added or removed, so the tab stop does not drift to another field.
  private _getFieldElementId(fieldElement: HTMLElement): string | undefined {
    const field = getData($(fieldElement), FIELD_DATA_KEY);

    return isDefined(field?.index) ? String(field.index) : undefined;
  }

  // The field chooser popup can be rendered inside the pivot grid element, so
  // the fields of this instance are told apart from the other instance's
  // fields by the closest field chooser root.
  private _getAreaFieldElements(area: string): HTMLElement[] {
    const ownFieldChooserRoot = this.$element().closest(`.${CLASSES.fieldChooser.self}`).get(0) ?? null;
    // NOTE: get() without an index is not supported by the native renderer.
    // @ts-expect-error toArray() returns Element[], the field elements are divs
    const fields: HTMLElement[] = this.$element()
      .find(`[group="${area}"] .${CLASSES.area.field}.${CLASSES.area.box}`)
      .toArray();

    return fields.filter((field) => {
      const fieldChooserRoot = $(field).closest(`.${CLASSES.fieldChooser.self}`).get(0) ?? null;

      return fieldChooserRoot === ownFieldChooserRoot;
    });
  }

  private _scrollFieldElementToView(fieldElement: HTMLElement): void {
    const $scrollable = $(fieldElement).closest(`.${CLASSES.scrollable.self}`);
    const scrollable = $scrollable.length
      ? Scrollable.getInstance<Scrollable | undefined>($scrollable.get(0))
      : undefined;

    scrollable?.scrollToElement(fieldElement);
  }

  private _getFieldNavigationDelta(key: string): number {
    const isHorizontal = key === 'ArrowLeft' || key === 'ArrowRight';

    if (isHorizontal && this.option('rtlEnabled')) {
      return -FIELD_NAVIGATION_DELTAS[key];
    }

    return FIELD_NAVIGATION_DELTAS[key];
  }

  private _handleFieldContextMenuKey(
    e: FieldChooserFieldEvent<KeyboardEvent>,
    field: FieldChooserField,
  ): void {
    const onContextMenuKey = this.option('onFieldContextMenuKeyDown');

    if (!field.area || !onContextMenuKey) {
      return;
    }

    const navigation = this._getFieldNavigation(field.area);

    // The event can bubble to another instance subscribed to an ancestor
    // element; the field then does not belong to this instance's items.
    if (!navigation.getItems().includes(e.currentTarget)) {
      return;
    }

    onContextMenuKey(e, navigation);
  }

  private _handleFieldNavigation(
    e: FieldChooserFieldEvent<KeyboardEvent>,
    field: FieldChooserField,
  ): void {
    if (!field.area) {
      return;
    }

    const navigation = this._getFieldNavigation(field.area);
    const items = navigation.getItems();
    const index = items.indexOf(e.currentTarget);

    // The event can bubble to another instance subscribed to an ancestor
    // element; the field then does not belong to this instance's items.
    if (index < 0) {
      return;
    }

    e.preventDefault();

    const targetIndex = index + this._getFieldNavigationDelta(e.key);

    if (targetIndex >= 0 && targetIndex < items.length) {
      navigation.focusItem(targetIndex);
    }
  }

  private _renderHeaderFilterIcon(
    $fieldElement: dxElementWrapper,
    field: FieldChooserField,
    showColumnLines: boolean,
  ): void {
    if (!this._dataSource || !fieldHasHeaderFilter(this._dataSource, field)) {
      return;
    }

    const mainGroupField = getMainGroupField(this._dataSource, field);
    const isEmpty = !mainGroupField.filterValues?.length;
    const $icon = $('<span>')
      .addClass(CLASSES.headerFilter)
      .toggleClass(CLASSES.headerFilterEmpty, isEmpty);

    let $container = this._getIndicatorContainer($fieldElement);

    if (!$container.length) {
      const rtlEnabled = this.option('rtlEnabled') as boolean;
      const indicatorAlignment = rtlEnabled ? 'left' : 'right';

      $container = $('<div>').addClass('dx-column-indicators');
      if (showColumnLines) {
        $container.css('float', indicatorAlignment);
      }

      $container[!showColumnLines && rtlEnabled ? 'appendTo' : 'prependTo']($fieldElement);
    }

    $container.append($icon);
  }

  private handleHeaderFilterIconClick(e: FieldChooserFieldEvent, field: FieldChooserField): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- the methods use their own this
    const that = this;
    const dataSource = this._dataSource;

    if (!dataSource) {
      return;
    }

    // @ts-expect-error a field's selector is typed as Function
    const mainGroupField: FieldChooserHeaderFilterField = extend(
      true,
      {},
      getMainGroupField(dataSource, field),
    );
    const type: HeaderFilterViewOptions['type'] = mainGroupField.groupName ? 'tree' : 'list';
    const paginate = dataSource.paginate() && type === 'list';

    this._headerFilterView.showHeaderFilterMenu($(e.currentTarget), extend(mainGroupField, {
      type,
      encodeHtml: this.option('encodeHtml'),
      dataSource: {
        useDefaultSearch: !paginate,
        // paginate: false,
        load(options) {
          const { userData } = options;
          if (userData.store) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- userData isn't typed
            return userData.store.load(options);
          }
          const d = Deferred<DataSourceHeaderItem[]>();
          dataSource.getFieldValues(
            mainGroupField.index,
            !!that.option('headerFilter')?.showRelevantValues,
            paginate
              ? options
              : undefined,
          ).done((data) => {
            const emptyValue = that.option('headerFilter')?.texts?.emptyValue;

            data.forEach((element) => {
              if (!element.text) {
                element.text = emptyValue;
              }
            });

            if (paginate) {
              d.resolve(data);
            } else {
              userData.store = new ArrayStore(data);
              userData.store.load(options).done(d.resolve).fail(d.reject);
            }
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          }).fail(d.reject);
          return d;
        },
        postProcess(data: FieldChooserHeaderFilterItem[]): FieldChooserHeaderFilterItem[] {
          processItems(data, mainGroupField);
          return data;
        },
      },
      onHidden: () => {
        this.focusFieldElement(field.index);
      },
      apply() {
        that._focusedFieldIndex = field.index;

        that._applyChanges([mainGroupField], {
          filterValues: this.filterValues,
          filterType: this.filterType,
        });
      },
    }));
  }

  private handleFieldClick(field: FieldChooserField): void {
    const isRemoteSort = this.option('remoteSort');
    const sortOrder = reverseSortOrder(field.sortOrder);

    if (isRemoteSort) {
      this._applyChanges([field], { sortOrder });
    } else {
      this._applyLocalSortChanges(field.index, sortOrder);
    }
  }

  private focusFieldElement(fieldIndex: number): void {
    const $fieldElements = this.$element().find(`.${CLASSES.area.field}.${CLASSES.area.box}`);
    // @ts-expect-error get() without an index returns undefined in the native renderer
    const fieldElements: HTMLElement[] | undefined = $fieldElements.get();

    fieldElements?.forEach((fieldElement) => {
      const field = getData($(fieldElement), FIELD_DATA_KEY);

      if (field?.index === fieldIndex) {
        fieldElement.focus();
      }
    });
  }

  public _initTemplates(): void {

  }

  public addWidgetPrefix(className: string): string {
    return `dx-pivotgrid-${className}`;
  }
}

registerComponent('dxPivotGridFieldChooserBase', FieldChooserBase);

export default { FieldChooserBase };
