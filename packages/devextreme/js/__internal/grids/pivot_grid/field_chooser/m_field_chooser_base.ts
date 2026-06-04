/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import localizationMessage from '@js/common/core/localization/message';
import ArrayStore from '@js/common/data/array_store';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import Widget from '@js/ui/widget/ui.widget';
import columnStateMixin from '@ts/grids/grid_core/column_state_mixin/m_column_state_mixin';
import {
  headerFilterMixin,
  HeaderFilterView as HeaderFilterViewBase,
  updateHeaderFilterItemSelectionState,
} from '@ts/grids/grid_core/header_filter/m_header_filter_core';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import sortingMixin from '@ts/grids/grid_core/sorting/m_sorting_mixin';

import { createPath, foreachTree } from '../m_widget_utils';
import SortableModule from '../sortable/m_sortable';
import { ATTRIBUTES, CLASSES } from './const';
import { dragAndDropItemRender } from './dom';
import { reverseSortOrder, shouldCancelDragging } from './utils';

const { Sortable } = SortableModule;

const DIV = '<div>';

class HeaderFilterView extends HeaderFilterViewBase {
  _getSearchExpr(options, headerFilterOptions) {
    options.useDefaultSearchExpr = true;
    return super._getSearchExpr(options, headerFilterOptions);
  }
}

const processItems = function (groupItems, field) {
  const filterValues: any = [];
  const isTree = !!field.groupName;
  const isExcludeFilterType = field.filterType === 'exclude';

  if (field.filterValues) {
    each(field.filterValues, (_, filterValue) => {
      filterValues.push(Array.isArray(filterValue) ? filterValue.join('/') : filterValue?.valueOf());
    });
  }

  foreachTree(groupItems, (items) => {
    const item = items[0];
    const path = createPath(items);
    const preparedFilterValueByText = isTree ? map(items, (item) => item.text).reverse().join('/') : item.text;

    item.value = isTree ? path.slice(0) : item.key || item.value;
    const preparedFilterValue = isTree ? path.join('/') : item.value?.valueOf();

    if (item.children) {
      item.items = item.children;
      item.children = null;
    }

    updateHeaderFilterItemSelectionState(
      item,
      item.key
      && filterValues.includes(preparedFilterValueByText)
      || filterValues.includes(preparedFilterValue),
      isExcludeFilterType,
    );
  });
};

function getMainGroupField(dataSource, sourceField) {
  let field = sourceField;
  if (isDefined(sourceField.groupIndex)) {
    field = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex];
  }

  return field;
}

function getStringState(state) {
  state = state || {};
  return JSON.stringify([state.fields, state.columnExpandedPaths, state.rowExpandedPaths]);
}

const mixinWidget = headerFilterMixin(
  sortingMixin(
    columnStateMixin(Widget as any),
  ),
);

export class FieldChooserBase extends mixinWidget {
  private _focusedFieldIndex = -1;

  _getDefaultOptions() {
    return {
      ...super._getDefaultOptions(),
      ...{
        allowFieldDragging: true,
        applyChangesMode: 'instantly',
        state: null,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _setAriaSortAttribute(_column, _ariaSortState, _$rootElement) { }

  _init() {
    super._init();
    this._headerFilterView = new HeaderFilterView(this);
    this._refreshDataSource();
    this.subscribeToEvents();

    gridCoreUtils.logHeaderFilterDeprecatedWarningIfNeed(this);
  }

  _refreshDataSource() {
    const dataSource = this.option('dataSource');

    if (dataSource?.fields && dataSource.load/* instanceof DX.ui.dxPivotGrid.DataSource */) {
      this._dataSource = dataSource;
    }
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'dataSource':
        this._refreshDataSource();
        break;
      case 'applyChangesMode':
      case 'remoteSort':
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

  renderField(field, showColumnLines) {
    const that = this;
    const caption = field.caption ?? field.dataField ?? '';
    const $fieldContent = $(DIV).addClass(CLASSES.area.fieldContent)
      .text(caption);
    const $fieldElement = $(DIV)
      .addClass(CLASSES.area.field)
      .addClass(CLASSES.area.box)
      .attr('tabIndex', 0)
      .data('field', field)
      .append($fieldContent);
    const mainGroupField = getMainGroupField(that._dataSource, field);

    if (field.area !== 'data') {
      if (field.allowSorting) {
        that._applyColumnState({
          name: 'sort',
          rootElement: $fieldElement,
          column: {
            alignment: that.option('rtlEnabled') ? 'right' : 'left',
            sortOrder: field.sortOrder === 'desc' ? 'desc' : 'asc',
            allowSorting: field.allowSorting,
            caption,
          },
          showColumnLines,
        });
      }

      that._applyColumnState({
        name: 'headerFilter',
        rootElement: $fieldElement,
        column: {
          alignment: that.option('rtlEnabled') ? 'right' : 'left',
          filterValues: mainGroupField.filterValues,
          allowFiltering: mainGroupField.allowFiltering && !field.groupIndex,
          allowSorting: field.allowSorting,
          caption,
        },
        showColumnLines,
      });
    }

    if (field.groupName) {
      $fieldElement.attr(ATTRIBUTES.itemGroup, field.groupName);
    }

    return $fieldElement;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _clean(value?) {
  }

  _render() {
    super._render();
    this._headerFilterView.render(this.$element());
  }

  renderSortable() {
    const that = this;

    that._createComponent(that.$element(), Sortable, extend({
      allowDragging: that.option('allowFieldDragging'),
      itemSelector: `.${CLASSES.area.field}`,
      itemContainerSelector: `.${CLASSES.area.fieldContainer}`,
      groupSelector: `.${CLASSES.area.fieldList}`,
      groupFilter() {
        const dataSource = that._dataSource;
        const $sortable = $(this).closest('.dx-sortable-old');
        const pivotGrid: any = $sortable.data('dxPivotGrid');
        const pivotGridFieldChooser: any = $sortable.data('dxPivotGridFieldChooser');

        if (pivotGrid) {
          return pivotGrid.getDataSource() === dataSource;
        }
        if (pivotGridFieldChooser) {
          return pivotGridFieldChooser.option('dataSource') === dataSource;
        }
        return false;
      },
      itemRender: dragAndDropItemRender,
      onDragging(e) {
        const field = e.sourceElement.data('field');
        const { targetGroup } = e;
        e.cancel = shouldCancelDragging(field, targetGroup);
      },
      useIndicator: true,
      onChanged(e) {
        const field = e.sourceElement.data('field');

        e.removeSourceElement = !!e.sourceGroup;

        that._adjustSortableOnChangedArgs(e);

        if (field) {
          const { targetIndex } = e;
          let mainGroupField;
          let invisibleFieldsIndexOffset = 0;

          that._processDemandState((dataSource) => {
            const fields = dataSource.getAreaFields(field.area, true);
            mainGroupField = getMainGroupField(dataSource, field);

            const visibleFields = fields.filter((f) => f.visible !== false);
            const fieldBeforeTarget = visibleFields[targetIndex - 1];

            if (fieldBeforeTarget) {
              invisibleFieldsIndexOffset = fields
                .filter((f) => f.visible === false
                    && f.areaIndex <= fieldBeforeTarget.areaIndex)
                .length;
            }
          });

          that._applyChanges([mainGroupField], {
            area: e.targetGroup,
            areaIndex: targetIndex + invisibleFieldsIndexOffset,
          });
        }
      },
    }, that._getSortableOptions()));
  }

  _processDemandState(func) {
    const that = this;
    const isInstantlyMode = that.option('applyChangesMode') === 'instantly';
    const dataSource = that._dataSource;

    if (isInstantlyMode) {
      func(dataSource, isInstantlyMode);
    } else {
      const currentState = dataSource.state();
      const pivotGridState = that.option('state');

      if (pivotGridState) {
        dataSource.state(pivotGridState, true);
      }

      func(dataSource, isInstantlyMode);

      dataSource.state(currentState, true);
    }
  }

  _applyChanges(fields, props) {
    const that = this;

    that._processDemandState((dataSource, isInstantlyMode) => {
      fields.forEach(({ index }) => {
        dataSource.field(index, props);
      });

      if (isInstantlyMode) {
        dataSource.load();
      } else {
        that._changedHandler();
      }
    });
  }

  _applyLocalSortChanges(fieldIdx, sortOrder): void {
    this._processDemandState((dataSource) => {
      dataSource.field(fieldIdx, { sortOrder });
      dataSource.sortLocal();
    });
  }

  _adjustSortableOnChangedArgs(e) {
    e.removeSourceElement = false;
    e.removeTargetElement = true;
    e.removeSourceClass = false;
  }

  _getSortableOptions() {
    return {
      direction: 'auto',
    };
  }

  subscribeToEvents(element?) {
    const fieldSelector = `.${CLASSES.area.field}.${CLASSES.area.box}`;
    const targetElement = element ?? this.$element();

    const handler = (e) => {
      const shouldHandle = e.type === clickEventName
        || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '));

      if (!shouldHandle) {
        return;
      }

      const field: any = $(e.currentTarget).data('field');
      const isHeaderFilter = $(e.target).hasClass(CLASSES.headerFilter);

      if (isHeaderFilter) {
        e.preventDefault();
        this.handleHeaderFilterIconClick(e, field);
      } else if (field.allowSorting && field.area !== 'data') {
        e.preventDefault();
        this.handleFieldClick(field);
      }
    };

    const focusInHandler = (e) => {
      const $field = $(e.currentTarget);
      const field: any = $field.data('field');

      if (!field) {
        return;
      }

      this._focusedFieldIndex = field.index;
    };

    const focusOutHandler = (e) => {
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

  restoreFieldFocus(): void {
    if (this._focusedFieldIndex !== -1) {
      this.focusFieldElement(this._focusedFieldIndex);
    }
  }

  private handleHeaderFilterIconClick(e, field): void {
    const that = this;

    const mainGroupField = extend(true, {}, getMainGroupField(that._dataSource, field));
    const type = mainGroupField.groupName ? 'tree' : 'list';
    const paginate = this._dataSource.paginate() && type === 'list';

    this._headerFilterView.showHeaderFilterMenu($(e.currentTarget), extend(mainGroupField, {
      type,
      encodeHtml: this.option('encodeHtml'),
      dataSource: {
        useDefaultSearch: !paginate,
        // paginate: false,
        load(options) {
          const { userData } = options;
          if (userData.store) {
            return userData.store.load(options);
          }
          // @ts-expect-error
          const d = new Deferred();
          that._dataSource.getFieldValues(
            mainGroupField.index,
            that.option('headerFilter.showRelevantValues'),
            paginate
              ? options
              : undefined,
          ).done((data) => {
            const emptyValue = that.option('headerFilter.texts.emptyValue');

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
          }).fail(d.reject);
          return d;
        },
        postProcess(data) {
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

  private handleFieldClick(field): void {
    const isRemoteSort = this.option('remoteSort');
    const sortOrder = reverseSortOrder(field.sortOrder);

    if (isRemoteSort) {
      this._applyChanges([field], { sortOrder });
    } else {
      this._applyLocalSortChanges(field.index, sortOrder);
    }
  }

  private focusFieldElement(fieldIndex: number): void {
    const fieldElements = this.$element()
      .find(`.${CLASSES.area.field}.${CLASSES.area.box}`)
      .get();

    fieldElements?.forEach((fieldElement) => {
      const field: any = $(fieldElement).data('field');

      if (field.index === fieldIndex) {
        fieldElement.focus();
      }
    });
  }

  _initTemplates() {

  }

  addWidgetPrefix(className) {
    return `dx-pivotgrid-${className}`;
  }
}

registerComponent('dxPivotGridFieldChooserBase', FieldChooserBase as any);

export default { FieldChooserBase };
