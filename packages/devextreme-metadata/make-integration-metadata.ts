import { Imd, addMetadata, replaceTypes, removeMembers } from 'devextreme-internal-tools/metadata';
import { cleanArtifacts } from './common';
import { IMD_FILE, PATHS } from './common/paths';

cleanArtifacts(IMD_FILE, 'IntegrationDataGenerator.cfg.json');

Imd.makeMetadata({
  args: {
    artifacts: PATHS.artifactsDir,
  },
  mutations: [
    replaceTypes('common/grids:ColumnAIOptions.popup', ['*'], ['object']),
    replaceTypes('ui/card_view:dxCardViewOptions.filterBuilderPopup', ['*'], ['object']),
    replaceTypes('ui/card_view:Editing.popup', ['*'], ['object']),
    replaceTypes('ui/scheduler:dxSchedulerOptions.editing.popup', ['*'], ['object']),

    removeMembers('core/dom_component:DOMComponentOptions.bindingOptions'),

    addMetadata('common/charts:SeriesPoint(|.hoverStyle|.selectionStyle).border', {
      forcedName: 'pointBorder',
    }),

    addMetadata('viz/chart:CommonPaneSettings.border', { forcedName: 'paneBorder' }),

    addMetadata(
      [
        'common/charts:SeriesLabel.border',
        'viz/chart:dxChartSeriesTypesCommonSeries(|HoverStyle|SelectionStyle).border',
        'viz/pie_chart:dxPieChartSeriesTypesCommonPieChartSeries(|.hoverStyle|.label|.selectionStyle).border',
        'viz/polar_chart:dxPolarChartSeriesTypesCommonPolarChartSeries(|.hoverStyle|.selectionStyle).border',
        'viz/polar_chart:dxPolarChartSeriesTypesCommonPolarChartSeriesLabel.border',
      ],
      { forcedName: 'seriesBorder' },
    ),

    addMetadata('viz/funnel:dxFunnelOptions.item(|.hoverStyle|.selectionStyle).border', {
      forcedName: 'itemBorder',
    }),

    addMetadata(
      [
        'viz/sankey:dxSankeyOptions.(label|link|node).border',
        'viz/sankey:dxSankeyOptions.(link|node).hoverStyle.border',
      ],
      { forcedName: 'sankeyborder' },
    ),

    addMetadata('viz/tree_map:dxTreeMapOptions.(group|tile)(|.hoverStyle|.selectionStyle).border', {
      forcedName: 'treeMapborder',
    }),

    addMetadata('viz/(chart|polar_chart):(ArgumentAxis|ValueAxis).label', {
      forcedName: 'axisLabel',
    }),

    addMetadata('viz/chart:(ArgumentAxis|ValueAxis).title', { forcedName: 'axisTitle' }),

    addMetadata('viz/chart:(ArgumentAxis|ValueAxis).constantLineStyle', {
      forcedName: 'axisConstantLineStyle',
    }),

    addMetadata(/\.data$/, { omitConfigComponents: ['*'] }),

    addMetadata(/\.dataSource$/, { omitConfigComponents: ['*'] }),

    // Do not generate configuration components for specified members
    addMetadata(
      [
        'ui/box:dxBoxItem.box',
        'ui/data_grid:dxDataGridColumn.columns',
        'ui/form:dxFormGroupItem.items',
        'ui/form:dxFormTabbedItem.tabs.items',
        'ui/splitter:dxSplitterItem.splitter',
        'ui/tree_list:dxTreeListColumn.columns',
      ],
      { omitConfigComponents: ['*'] },
    ),

    // Do not generate configuration component for Member within parent Component
    /* addMetadata([ Member ], { omitConfigComponents: ['Component'] }), */

    [
      ['common:AsyncRule', 'async'],
      ['common:CompareRule', 'compare'],
      ['common:CustomRule', 'custom'],
      ['common:EmailRule', 'email'],
      ['common:NumericRule', 'numeric'],
      ['common:PatternRule', 'pattern'],
      ['common:RangeRule', 'range'],
      ['common:RequiredRule', 'required'],
      ['common:StringLengthRule', 'stringLength'],
    ].map(([uid, alias]) => addMetadata(uid, { typeAlias: alias })),

    [
      ['ui/form:dxFormButtonItem', 'button'],
      ['ui/form:dxFormEmptyItem', 'empty'],
      ['ui/form:dxFormGroupItem', 'group'],
      ['ui/form:dxFormSimpleItem', 'simple'],
      ['ui/form:dxFormTabbedItem', 'tabbed'],
    ].map(([uid, alias]) => addMetadata(uid, { itemTypeAlias: alias })),

    // Force name FormGroupItem for dxFormGroupItem alias (GroupItem) within DxDataGrid parent component
    addMetadata('ui/form:dxFormGroupItem', {
      forcedName: 'FormGroupItem',
      parentComponents: ['DxDataGrid'],
    }),

    addMetadata('ui/data_grid:Toolbar.items', {
      forcedName: 'dataGridToolbarItem',
    }),
    addMetadata('ui/tree_list:Toolbar.items', {
      forcedName: 'treeListToolbarItem',
    }),

    replaceTypes(/.+/, ['core/element:UserDefinedElement'], ['any']),

    removeMembers(['core/element:DxElement', 'core/element:UserDefinedElement'], 'any'),
  ],
});
