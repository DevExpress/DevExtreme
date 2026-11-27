import '../data_source/data_source';

import localizationMessage from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import { hasWindow as hasWindowFn } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import ContextMenu from '@js/ui/context_menu';
import type { PivotGridArea } from '@js/ui/pivot_grid/data_source';
import TreeView from '@js/ui/tree_view';
import { getData, setData } from '@ts/core/element_data';
import type { OptionChanged } from '@ts/core/widget/types';
import type Scrollable from '@ts/ui/scroll_view/scrollable';

import type { PivotGridDataSource } from '../data_source/data_source';
import type { OldSortableProperties } from '../sortable/types';
import type { PivotGridField, PivotGridPreparedField } from '../types';
import { foreachDataLevel, getCompareFunction } from '../widget_utils';
import { getFieldsHotkeysA11yLabel } from './a11y';
import {
  ATTRIBUTES, CLASSES, FIELD_DATA_KEY, ICONS,
} from './const';
import { FieldChooserBase } from './field_chooser_base';
import type {
  FieldChooserArea,
  FieldChooserContextMenuArgs,
  FieldChooserGroupFieldName,
  FieldChooserTreeItem,
  FieldChooserTreeItems,
  PivotGridFieldChooserProperties,
} from './types';

const DIV = '<div>';
const hasWindow = hasWindowFn();

function getDimensionFields(
  item: FieldChooserTreeItem,
  fields: PivotGridPreparedField[],
): PivotGridPreparedField[] {
  const result: PivotGridPreparedField[] = [];

  if (item.items) {
    for (const childItem of item.items) {
      result.push(...getDimensionFields(childItem, fields));
    }
  } else if (isDefined(item.index)) {
    result.push(fields[item.index]);
  }
  return result;
}

function getFirstItem(
  item: FieldChooserTreeItem,
  condition: (item: FieldChooserTreeItem) => unknown,
): FieldChooserTreeItem | undefined {
  if (item.items) {
    for (const childItem of item.items) {
      const childrenItem = getFirstItem(childItem, condition);
      if (childrenItem) {
        return childrenItem;
      }
    }
  }

  if (condition(item)) {
    return item;
  }

  return undefined;
}

const compareOrder: ((a: FieldChooserTreeItem, b: FieldChooserTreeItem) => number)[] = [
  function compareByMeasure(a, b): number {
    const aValue = -!!a.isMeasure;
    const bValue = +!!b.isMeasure;

    return aValue + bValue;
  },

  function compareByItems(a, b): number {
    const aValue = -!!a.items?.length;
    const bValue = +!!b.items?.length;

    return aValue + bValue;
  },

  function compareByLevels(a, b): number {
    const aValue = +!!(a.isMeasure === false && a.field?.levels?.length);
    const bValue = -!!(b.isMeasure === false && b.field?.levels?.length);

    return aValue + bValue;
  },
  getCompareFunction((item: FieldChooserTreeItem) => item.text),
];

function compareItems(a: FieldChooserTreeItem, b: FieldChooserTreeItem): number {
  let result = 0;
  let i = 0;

  while (!result && compareOrder[i]) {
    result = compareOrder[i](a, b);
    i += 1;
  }

  return result;
}

function getScrollable(container: dxElementWrapper): Scrollable | undefined {
  // @ts-expect-error dxScrollable is added to the renderer at runtime
  const scrollable: Scrollable | undefined = container.find(`.${CLASSES.scrollable.self}`).dxScrollable('instance');

  return scrollable;
}

export class FieldChooser extends FieldChooserBase {
  private _expandedPaths!: (string | number)[];

  private _dataChangedHandlers!: (() => void)[];

  private onContextMenuPreparingAction!: (event?: unknown) => void;

  private _contextMenu?: ContextMenu;

  public _getDefaultOptions(): PivotGridFieldChooserProperties {
    return {
      ...super._getDefaultOptions(),
      ...{
        height: 400,
        layout: 0,
        dataSource: null,
        encodeHtml: true,
        onContextMenuPreparing: undefined,
        allowSearch: false,
        searchTimeout: 500,
        texts: {
          columnFields: localizationMessage.format('dxPivotGrid-columnFields'),
          rowFields: localizationMessage.format('dxPivotGrid-rowFields'),
          dataFields: localizationMessage.format('dxPivotGrid-dataFields'),
          filterFields: localizationMessage.format('dxPivotGrid-filterFields'),
          allFields: localizationMessage.format('dxPivotGrid-allFields'),
        },
      },
    };
  }

  protected _refreshDataSource(): void {
    this._expandedPaths = [];
    this._changedHandler ??= (): void => {
      this._dataChangedHandlers.forEach((handler) => {
        handler();
      });
      this.restoreFieldFocus();
      this._fireContentReadyAction();
      this._skipStateChange = true;
      if (this._dataSource) {
        this.option('state', this._dataSource.state());
      }
      this._skipStateChange = false;
    };

    this._disposeDataSource();

    super._refreshDataSource();

    if (this._dataSource) {
      this._dataSource.on('changed', this._changedHandler);
    }
  }

  private _disposeDataSource(): void {
    const dataSource = this._dataSource;

    if (dataSource) {
      dataSource.off('changed', this._changedHandler);
      this._dataSource = undefined;
    }
  }

  public _dispose(): void {
    this._disposeDataSource();
    super._dispose();
  }

  public _init(): void {
    super._init();
    this._refreshDataSource();
    this._dataChangedHandlers = [];
    this.onContextMenuPreparingAction = this._createActionByOption('onContextMenuPreparing');
  }

  public _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      dataSource: true,
    });
  }

  public _optionChanged(args: OptionChanged<PivotGridFieldChooserProperties>): void {
    switch (args.name) {
      case 'dataSource':
        this._refreshDataSource();
        this._invalidate();
        break;
      case 'layout':
      case 'texts':
      case 'allowSearch':
      case 'searchTimeout':
      case 'encodeHtml':
        this._invalidate();
        break;
      case 'onContextMenuPreparing':
        this.onContextMenuPreparingAction = this._createActionByOption(args.name);
        break;
      default:
        super._optionChanged(args);
    }
  }

  public _clean(skipStateSetting?: boolean): void {
    if (!skipStateSetting && this._dataSource) {
      this.option('state', this._dataSource.state());
    }
    this.$element().children(`.${CLASSES.fieldChooser.container}`).remove();
  }

  private _renderLayout0($container: dxElementWrapper): void {
    $container.addClass(CLASSES.layout.zero);

    const $row1 = $(DIV).addClass(CLASSES.row).appendTo($container);
    const $row2 = $(DIV).addClass(CLASSES.row).appendTo($container);

    const $col1 = $(DIV).addClass(CLASSES.col).appendTo($row1);
    const $col2 = $(DIV).addClass(CLASSES.col).appendTo($row1);

    const $col3 = $(DIV).addClass(CLASSES.col).appendTo($row2);
    const $col4 = $(DIV).addClass(CLASSES.col).appendTo($row2);

    this._renderArea($col1, 'all');
    this._renderArea($col2, 'row');
    this._renderArea($col2, 'column');
    this._renderArea($col3, 'filter');
    this._renderArea($col4, 'data');
  }

  private _renderLayout1($container: dxElementWrapper): void {
    const $col1 = $(DIV).addClass(CLASSES.col).appendTo($container);
    const $col2 = $(DIV).addClass(CLASSES.col).appendTo($container);

    this._renderArea($col1, 'all');
    this._renderArea($col2, 'filter');
    this._renderArea($col2, 'row');
    this._renderArea($col2, 'column');
    this._renderArea($col2, 'data');
  }

  private _renderLayout2($container: dxElementWrapper): void {
    $container.addClass(CLASSES.layout.second);

    const $row1 = $(DIV).addClass(CLASSES.row).appendTo($container);
    this._renderArea($row1, 'all');

    const $row2 = $(DIV).addClass(CLASSES.row).appendTo($container);
    const $col1 = $(DIV).addClass(CLASSES.col).appendTo($row2);
    const $col2 = $(DIV).addClass(CLASSES.col).appendTo($row2);

    this._renderArea($col1, 'filter');
    this._renderArea($col1, 'row');
    this._renderArea($col2, 'column');
    this._renderArea($col2, 'data');
  }

  public _initMarkup(): void {
    const $element = this.$element();
    const $container = $(DIV).addClass(CLASSES.fieldChooser.container).appendTo($element);
    const layout = this.option('layout');

    super._initMarkup();

    $element
      .addClass(CLASSES.fieldChooser.self)
      .addClass(CLASSES.pivotGrid.fieldsContainer)
      .attr('role', 'group')
      .attr('aria-label', getFieldsHotkeysA11yLabel(localizationMessage.format('dxPivotGrid-fieldChooserTitle')));

    this._dataChangedHandlers = [];

    const dataSource = this._dataSource;
    const currentState = this.option('applyChangesMode') !== 'instantly' && dataSource?.state();

    if (currentState && dataSource && this.option('state')) {
      dataSource.state(this.option('state'), true);
    }

    if (layout === 0) {
      this._renderLayout0($container);
    } else if (layout === 1) {
      this._renderLayout1($container);
    } else {
      this._renderLayout2($container);
    }

    if (currentState && dataSource) {
      dataSource.state(currentState, true);
    }
  }

  public _renderContentImpl(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- the base returns nothing
    super._renderContentImpl();

    this.renderSortable();
    this._renderContextMenu();
    this.updateDimensions();
    this.updateFieldsTabIndexes();
  }

  public _fireContentReadyAction(): void {
    if (!this._dataSource?.isLoading()) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- the result isn't used
      super._fireContentReadyAction();
    }
  }

  private _getContextMenuArgs(dxEvent: DxEvent): FieldChooserContextMenuArgs {
    const targetFieldElement = $(dxEvent.target).closest(`.${CLASSES.area.field}`);
    const targetGroupElement = $(dxEvent.target).closest(`.${CLASSES.area.fieldList}`);
    // eslint-disable-next-line @typescript-eslint/init-declarations -- set for a field target
    let field: PivotGridField | undefined;

    if (targetFieldElement.length) {
      const fieldCopy = getData(targetFieldElement, FIELD_DATA_KEY);
      if (fieldCopy) {
        field = this.getDataSource()?.field(fieldCopy.index) ?? fieldCopy;
      }
    }

    const area = targetGroupElement.length ? targetGroupElement.attr('group') : undefined;

    return {
      event: dxEvent,
      field,
      area,
      items: [],
    };
  }

  private _renderContextMenu(): void {
    const $container = this.$element();

    if (this._contextMenu) {
      this._contextMenu.$element().remove();
    }

    this._contextMenu = this._createComponent($(DIV).appendTo($container), ContextMenu, {
      onPositioning: (actionArgs): void => {
        const { event } = actionArgs;

        if (!event) {
          return;
        }

        const args = this._getContextMenuArgs(event);

        this.onContextMenuPreparingAction(args);

        if (args.items?.length) {
          actionArgs.component.option('items', args.items);
        } else {
          actionArgs.cancel = true;
        }
      },
      target: $container,
      onItemClick(params): void {
        if (params.itemData.onItemClick) {
          params.itemData.onItemClick(params);
        }
      },
      cssClass: CLASSES.fieldChooser.contextMenu,
    });
  }

  private _createTreeItems(
    fields: PivotGridPreparedField[],
    groupFieldNames: FieldChooserGroupFieldName[],
    path?: string | number,
  ): FieldChooserTreeItems {
    let resultItems: FieldChooserTreeItems = [];
    const groupedItems: FieldChooserTreeItem[] = [];
    const groupFieldName = groupFieldNames[0];
    const fieldsByGroup: Record<string, PivotGridPreparedField[]> = {};

    if (!groupFieldName) {
      fields.forEach((field) => {
        // eslint-disable-next-line @typescript-eslint/init-declarations -- set by the checks below
        let icon: string | undefined;

        if (field.isMeasure === true) {
          icon = ICONS.measure;
        }

        if (field.isMeasure === false) {
          icon = field.groupName ? ICONS.hierarchy : ICONS.dimension;
        }

        resultItems.push({
          index: field.index,
          field,
          key: field.dataField,
          selected: isDefined(field.area),
          text: field.caption || field.dataField,
          icon,
          isMeasure: field.isMeasure,
          isDefault: field.isDefault,
        });
      });
    } else {
      let isMeasure = true;

      fields.forEach((field) => {
        const groupName = field[groupFieldName] ?? '';
        fieldsByGroup[groupName] ??= [];
        fieldsByGroup[groupName].push(field);

        isMeasure &&= field.isMeasure === true;
      });

      each(fieldsByGroup, (groupName: string | number, groupFields) => {
        const currentPath = path ? `${path}.${groupName}` : groupName;
        const items = this._createTreeItems(groupFields, groupFieldNames.slice(1), currentPath);
        if (groupName) {
          groupedItems.push({
            key: groupName,
            text: groupName,
            path: currentPath,
            isMeasure: items.isMeasure,
            expanded: this._expandedPaths.includes(currentPath),
            items,
          });
        } else {
          resultItems = items;
        }
      });

      resultItems = groupedItems.concat(resultItems);
      resultItems.isMeasure = isMeasure;
    }

    return resultItems;
  }

  private _createFieldsDataSource(): FieldChooserTreeItems {
    let fields = this._dataSource?.fields() ?? [];

    fields = fields.filter((field) => field.visible !== false && !isDefined(field.groupIndex));

    const treeItems = this._createTreeItems(fields, ['dimension', 'displayFolder']);

    foreachDataLevel(treeItems, (items) => {
      items.sort(compareItems);
    }, 0, 'items');

    return treeItems;
  }

  private _renderFieldsTreeView(container: dxElementWrapper): void {
    const treeView = this._createComponent(container, TreeView, {
      dataSource: this._createFieldsDataSource(),
      showCheckBoxesMode: 'normal',
      expandNodesRecursive: false,
      searchEnabled: this.option('allowSearch'),
      searchTimeout: this.option('searchTimeout'),
      useNativeScrolling: false,
      itemTemplate(itemData: FieldChooserTreeItem, itemIndex, itemElement): void {
        const $item = $('<div>')
          .toggleClass(CLASSES.area.field, !itemData.items)
          .attr(ATTRIBUTES.treeViewItem, true)
          .appendTo(itemElement);

        if (itemData.field) {
          setData($item, FIELD_DATA_KEY, itemData.field);
        }

        if (itemData.icon) {
          getImageContainer(itemData.icon)?.appendTo($item);
        }

        $('<span>')
          .text(itemData.text ?? '')
          .appendTo($item);
      },
      onItemCollapsed: (e): void => {
        const index = this._expandedPaths.indexOf(e.itemData.path);
        if (index >= 0) {
          this._expandedPaths.splice(index, 1);
        }
      },
      onItemExpanded: (e): void => {
        const index = this._expandedPaths.indexOf(e.itemData.path);
        if (index < 0) {
          this._expandedPaths.push(e.itemData.path);
        }
      },
      onItemSelectionChanged: (e): void => {
        const dataSource = this._dataSource;

        if (!dataSource) {
          return;
        }

        const data = e.itemData;
        // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the branches
        let fields: PivotGridPreparedField[] | undefined;
        let needSelectDefaultItem = true;
        // eslint-disable-next-line @typescript-eslint/init-declarations -- set for a selected field
        let area: PivotGridArea | undefined;

        if (data.items) {
          if (data.selected) {
            treeView.unselectItem(data);
            return;
          }

          this._processDemandState(() => {
            fields = getDimensionFields(data, dataSource.fields());

            for (const dimensionField of fields) {
              if (dimensionField.area) {
                needSelectDefaultItem = false;
                break;
              }
            }
          });

          if (needSelectDefaultItem) {
            const item = getFirstItem(
              data,
              (treeItem) => treeItem.isDefault,
            ) ?? getFirstItem(data, (treeItem) => isDefined(treeItem.index));
            if (item) {
              treeView.selectItem(item);
            }
            return;
          }
        } else {
          const field = dataSource.fields()[data.index];
          if (data.selected) {
            area = field.isMeasure ? 'data' : 'column';
          }
          if (field) {
            fields = [field];
          }
        }

        if (fields) {
          this._applyChanges(fields, {
            area,
            areaIndex: undefined,
          });
        }
      },
    });

    const dataChanged = (): void => {
      let scrollable = getScrollable(container);
      const scrollTop = scrollable ? scrollable.scrollTop() : 0;

      treeView.option({ dataSource: this._createFieldsDataSource() });
      scrollable = getScrollable(container);
      if (scrollable) {
        scrollable.scrollTo({ top: scrollTop });
        scrollable.update();
      }
    };

    this._dataChangedHandlers.push(dataChanged);
  }

  private _renderAreaFields($container: dxElementWrapper, area: PivotGridArea): void {
    const dataSource = this._dataSource;
    const fields = dataSource ? extend(true, [], dataSource.getAreaFields(area, true)) : [];

    $container.empty();
    fields.forEach((field) => {
      if (field.visible !== false) {
        this.renderField(field, true).appendTo($container);
      }
    });

    // A menubar without menu items is invalid ARIA, so an empty area stays
    // without the role until fields are dropped into it.
    const hasFields = !!$container.children().length;
    const areaFieldsText = this.option('texts')?.[`${area}Fields`] ?? null;
    $container
      .attr('role', hasFields ? 'menubar' : null)
      .attr('aria-label', hasFields ? areaFieldsText : null);
  }

  private _renderArea(container: dxElementWrapper, area: FieldChooserArea): void {
    const $areaContainer = $(DIV).addClass(CLASSES.area.self).appendTo(container);
    const $fieldsHeaderContainer = $(DIV)
      .addClass(CLASSES.area.fieldListHeader)
      .appendTo($areaContainer);
    const caption: string = this.option('texts')?.[`${area}Fields`] ?? '';

    $('<span>').addClass(CLASSES.area.icon)
      .addClass(`dx-icon-${ICONS[area]}`)
      .appendTo($fieldsHeaderContainer);

    $('<span>')
      .html('&nbsp;')
      .appendTo($fieldsHeaderContainer);

    $('<span>').addClass(CLASSES.area.caption)
      .text(caption)
      .appendTo($fieldsHeaderContainer);

    const $fieldsContainer = $(DIV).addClass(CLASSES.area.fieldList)
      .addClass(CLASSES.pivotGrid.dragAction)
      .appendTo($areaContainer);

    if (area !== 'all') {
      $fieldsContainer.attr('group', area).attr(ATTRIBUTES.allowScrolling, true);
      const $fieldsContent = $(DIV)
        .addClass(CLASSES.area.fieldContainer)
        .appendTo($fieldsContainer);
      const render = (): void => {
        this._renderAreaFields($fieldsContent, area);
      };
      this._dataChangedHandlers.push(render);
      render();
      // @ts-expect-error dxScrollable is added to the renderer at runtime
      $fieldsContainer.dxScrollable({
        useNative: false,
        useKeyboard: false,
      });
    } else {
      $areaContainer.addClass(CLASSES.allFields);
      $fieldsContainer.addClass(CLASSES.treeView.borderVisible);
      this._renderFieldsTreeView($fieldsContainer);
    }
  }

  protected _getSortableOptions(): Partial<OldSortableProperties> {
    // TODO
    return {
      direction: '',
    };
  }

  protected _adjustSortableOnChangedArgs(): void {
  }

  public resetTreeView(): void {
    // @ts-expect-error dxTreeView is added to the renderer at runtime
    const treeView = this.$element().find(`.${CLASSES.treeView.self}`).dxTreeView('instance');

    if (treeView) {
      treeView.option('searchValue', '');
      treeView.collapseAll();
    }
  }

  public applyChanges(): void {
    const state = this.option('state');

    if (isDefined(state)) {
      this._dataSource?.state(state);
    }
  }

  public cancelChanges(): boolean {
    const dataSource = this._dataSource;

    if (dataSource && !dataSource.isLoading()) {
      this.option('state', dataSource.state());
      return true;
    }
    return false;
  }

  public getDataSource(): PivotGridDataSource | undefined {
    return this._dataSource;
  }

  public updateDimensions(): void {
    const $scrollableElements = this.$element().find(`.${CLASSES.area.self} .${CLASSES.scrollable.self}`);
    // @ts-expect-error dxScrollable is added to the renderer at runtime
    $scrollableElements.dxScrollable('update');
  }

  public _visibilityChanged(visible: boolean): void {
    if (visible && hasWindow) {
      this.updateDimensions();
    }
  }
}

registerComponent('dxPivotGridFieldChooser', FieldChooser);

export default { FieldChooser };
