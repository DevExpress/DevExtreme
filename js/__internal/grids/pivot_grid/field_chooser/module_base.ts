import $ from '@js/core/renderer';
import eventsEngine from '@js/events/core/events_engine';
import ArrayStore from '@js/data/array_store';
import { name as clickEventName } from '@js/events/click';
import { noop } from '@js/core/utils/common';
import { isDefined } from '@js/core/utils/type';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import localizationMessage from '@js/localization/message';
import registerComponent from '@js/core/component_registrator';
import Widget from '@js/ui/widget/ui.widget';
import {
  HeaderFilterView as HeaderFilterViewBase,
  updateHeaderFilterItemSelectionState,
  headerFilterMixin,
} from '@js/ui/grid_core/ui.grid_core.header_filter_core';
import columnStateMixin from '@js/ui/grid_core/ui.grid_core.column_state_mixin';
import sortingMixin from '@js/ui/grid_core/ui.grid_core.sorting_mixin';
import { Deferred } from '@js/core/utils/deferred';

import { foreachTree, createPath } from '../widget_utils';
import { Sortable } from '../sortable/module';
import { sortableItemRender } from '../sortable/index';

const DIV = '<div>';

const HeaderFilterView = HeaderFilterViewBase.inherit({
  _getSearchExpr(options) {
    options.useDefaultSearchExpr = true;
    return this.callBase(options);
  },
});

const processItems = function (groupItems, field) {
  const filterValues: any = [];
  const isTree = !!field.groupName;
  const isExcludeFilterType = field.filterType === 'exclude';

  if (field.filterValues) {
    each(field.filterValues, (_, filterValue) => {
      filterValues.push(Array.isArray(filterValue) ? filterValue.join('/') : filterValue && filterValue.valueOf());
    });
  }

  foreachTree(groupItems, (items) => {
    const item = items[0];
    const path = createPath(items);
    const preparedFilterValueByText = isTree ? map(items, (item) => item.text).reverse().join('/') : item.text;

    item.value = isTree ? path.slice(0) : item.key || item.value;
    const preparedFilterValue = isTree ? path.join('/') : item.value && item.value.valueOf();

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

const FieldChooserBase = (Widget as any)
  .inherit(columnStateMixin)
  .inherit(sortingMixin)
  .inherit(headerFilterMixin)
  .inherit({
    _getDefaultOptions() {
      return extend(this.callBase(), {
        allowFieldDragging: true,
        applyChangesMode: 'instantly',
        state: null,
        headerFilter: {
          width: 252,
          height: 325,
          searchTimeout: 500,
          texts: {
            emptyValue: localizationMessage.format('dxDataGrid-headerFilterEmptyValue'),
            ok: localizationMessage.format('dxDataGrid-headerFilterOK'),
            cancel: localizationMessage.format('dxDataGrid-headerFilterCancel'),
          },
        },
      });
    },

    _init() {
      this.callBase();
      this._headerFilterView = new HeaderFilterView(this);
      this._refreshDataSource();
      this.subscribeToEvents();
    },

    _refreshDataSource() {
      const dataSource = this.option('dataSource');

      if (dataSource
        && dataSource.fields && dataSource.load/* instanceof DX.ui.dxPivotGrid.DataSource */) {
        this._dataSource = dataSource;
      }
    },

    _optionChanged(args) {
      switch (args.name) {
        case 'dataSource':
          this._refreshDataSource();
          break;
        case 'applyChangesMode':
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
          this.callBase(args);
      }
    },

    renderField(field, showColumnLines) {
      const that = this;
      const $fieldContent = $(DIV).addClass('dx-area-field-content')
        .text(field.caption || field.dataField);
      const $fieldElement = $(DIV)
        .addClass('dx-area-field')
        .addClass('dx-area-box')
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
          },
          showColumnLines,
        });
      }

      if (field.groupName) {
        $fieldElement.attr('item-group', field.groupName);
      }

      return $fieldElement;
    },

    _clean() {
    },

    _render() {
      this.callBase();
      this._headerFilterView.render(this.$element());
    },

    renderSortable() {
      const that = this;

      that._createComponent(that.$element(), Sortable, extend({
        allowDragging: that.option('allowFieldDragging'),
        itemSelector: '.dx-area-field',
        itemContainerSelector: '.dx-area-field-container',
        groupSelector: '.dx-area-fields',
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
        itemRender: sortableItemRender,
        onDragging(e) {
          const field = e.sourceElement.data('field');
          const { targetGroup } = e;
          e.cancel = false;

          if (field.isMeasure === true) {
            if (targetGroup === 'column' || targetGroup === 'row' || targetGroup === 'filter') {
              e.cancel = true;
            }
          } else if (field.isMeasure === false && targetGroup === 'data') {
            e.cancel = true;
          }
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
    },

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
    },

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
    },

    _adjustSortableOnChangedArgs(e) {
      e.removeSourceElement = false;
      e.removeTargetElement = true;
      e.removeSourceClass = false;
    },

    _getSortableOptions() {
      return {
        direction: 'auto',
      };
    },

    subscribeToEvents(element) {
      const that = this;
      const func = function (e) {
        const field: any = $(e.currentTarget).data('field');
        const mainGroupField = extend(true, {}, getMainGroupField(that._dataSource, field));
        const isHeaderFilter = $(e.target).hasClass('dx-header-filter');
        const dataSource = that._dataSource;
        const type = mainGroupField.groupName ? 'tree' : 'list';
        const paginate = dataSource.paginate() && type === 'list';

        if (isHeaderFilter) {
          that._headerFilterView.showHeaderFilterMenu($(e.currentTarget), extend(mainGroupField, {
            type,
            encodeHtml: that.option('encodeHtml'),
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
                dataSource.getFieldValues(
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

            apply() {
              that._applyChanges([mainGroupField], {
                filterValues: this.filterValues,
                filterType: this.filterType,
              });
            },
          }));
        } else if (field.allowSorting && field.area !== 'data') {
          that._applyChanges([field], {
            sortOrder: field.sortOrder === 'desc' ? 'asc' : 'desc',
          });
        }
      };

      if (element) {
        eventsEngine.on(element, clickEventName, '.dx-area-field.dx-area-box', func);
        return;
      }
      eventsEngine.on(that.$element(), clickEventName, '.dx-area-field.dx-area-box', func);
    },

    _initTemplates: noop,

    addWidgetPrefix(className) {
      return `dx-pivotgrid-${className}`;
    },
  });

registerComponent('dxPivotGridFieldChooserBase', FieldChooserBase);

export default { FieldChooserBase };
export { FieldChooserBase };
