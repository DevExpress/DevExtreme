import {
  AspNet,
  Mutation,
  addMember,
  removeMembers,
  replaceTypes,
} from 'devextreme-internal-tools/metadata';
import { cleanArtifacts, types } from './common';
import { commonSmdCollectionItems } from './common/smd';
import { enums, enumAliases, enumItemRenamings } from './aspnet/enums';
import { PATHS } from './common/paths';
import { replaceTypesMutations } from './common-smd-mutations';

cleanArtifacts('StrongMetaData.json', 'StrongMetaDataGenerator.cfg.json');

AspNet.makeMetadata({
  args: {
    version: '26_1',
    artifacts: PATHS.artifactsDir,
  },
  mutations: [
    replaceTypes(
      [
        // 'Length' can be added to the next mutation's regex, but it in that case it affects
        // 'arrowLength' and 'edgeLength' properties, which is probably a right thing to do,
        // but it changes the existing behavior.
        // Another pattern might be /\.(max|min)[A-Z]\w+$/ but it affects even more properties.
        'ui/autocomplete:dxAutocompleteOptions.minSearchLength',
        'ui/drop_down_editor/ui.drop_down_list:dxDropDownListOptions.minSearchLength',
        'ui/html_editor:dxHtmlEditorMention.minSearchLength',

        'ui/tag_box:dxTagBoxOptions.maxFilterQueryLength',
        'ui/scheduler:dxSchedulerOptions(.|.views.)maxAppointmentsPerCell',
        'viz/chart_components/base_chart:BaseChartOptions.animation.maxPointCountSupported',

        'ui/data_grid:SortByGroupSummaryInfoItem.summaryItem',
      ],
      ['number'],
      ['int'],
    ),
    replaceTypes(
      /(?:Count|[Ii]ndex|\.maxAppointmentsPerCell|\.hidingPriority|\.pageSize|\.lg|\.md|\.sm|\.xs|\.col[Ss]pan|\.row[Ss]pan)$/,
      ['number'],
      ['int'],
    ),

    replaceTypes(
      'ui/pivot_grid:dxPivotGridOptions.dataSource',
      ['*'],
      ['ui/pivot_grid/data_source:PivotGridDataSource'],
    ),

    replaceTypes(
      [
        'viz/chart:ArgumentAxis.workWeek',
        'viz/range_selector:dxRangeSelectorOptions.scale.workWeek',
      ],
      ['number[]'],
      ['int[]'],
    ),

    replaceTypes(
      'viz/chart:dxChartOptions.annotations',
      ['*'],
      ['viz/chart:dxChartAnnotationConfig[]'],
    ),

    replaceTypes(
      'viz/pie_chart:dxPieChartOptions.annotations',
      ['*'],
      ['viz/pie_chart:dxPieChartAnnotationConfig[]'],
    ),

    replaceTypes(
      'viz/polar_chart:dxPolarChartOptions.annotations',
      ['*'],
      ['viz/polar_chart:dxPolarChartAnnotationConfig[]'],
    ),

    replaceTypes(
      'viz/vector_map:dxVectorMapOptions.annotations',
      ['*'],
      ['viz/vector_map:dxVectorMapAnnotationConfig[]'],
    ),

    replaceTypes(
      'ui/html_editor:dxHtmlEditorTableContextMenuItem.items',
      ['*'],
      ['ui/html_editor:HtmlEditorPredefinedContextMenuItem[]'],
    ),

    replaceTypes(
      'ui/(calendar:dxCalendar|date_box:dxDateBox)Options.disabledDates',
      ['*'],
      [
        // | ((data: DevExpress.ui.dxCalendar.DisabledDate) => boolean);
        {
          kind: 'function',
          params: [
            {
              name: 'data',
              types: [types.uidRef('ui/calendar:DisabledDate')],
            },
          ],
          returnTypes: [{ kind: 'boolean' }],
        },
        // | Array<Date>
        'date[]',
      ],
    ),

    replaceTypes(
      [
        'ui/color_box:dxColorBoxOptions.maxLength',
        'ui/date_box:dxDateBoxOptions.maxLength',
        'ui/date_range_box:dxDateRangeBoxOptions.maxLength',
        'ui/lookup:dxLookupOptions.maxLength',
        'ui/scheduler:dxSchedulerOptions.cellDuration',
        'ui/scheduler:dxSchedulerOptions.views.(agenda|cell)Duration',
        'ui/text_box:dxTextBoxOptions.maxLength',
        // 'common/grids:ColumnBase.ownerBand',
        'ui/responsive_box:dxResponsiveBoxItem.location.(col|row)',
        'ui/tag_box:dxTagBoxOptions.maxDisplayedTags',
      ],
      ['number', 'string'],
      ['int'],
    ),

    // recover inherited
    // ownerBand
    removeMembers('common/grids:ColumnBase.ownerBand'),
    addMember({ uid: 'ui/data_grid:dxDataGridColumn.ownerBand' }),
    addMember({ uid: 'ui/tree_list:dxTreeListColumn.ownerBand' }),
    replaceTypes('ui/data_grid:dxDataGridColumn.ownerBand', ['*'], ['int']),
    replaceTypes('ui/tree_list:dxTreeListColumn.ownerBand', ['*'], ['number']),
    // ownerBand
    // maxLength
    addMember({ uid: 'ui/drop_down_box:dxDropDownBoxOptions.maxLength' }),
    addMember({ uid: 'ui/tag_box:dxTagBoxOptions.maxLength' }),
    replaceTypes(
      ['ui/drop_down_box:dxDropDownBoxOptions.maxLength', 'ui/tag_box:dxTagBoxOptions.maxLength'],
      ['*'],
      ['number', 'string'],
    ),
    // maxLength
    // recover inherited

    // This isn't the pageSize you're looking for. Rollback.
    replaceTypes('ui/diagram:dxDiagramOptions.pageSize', ['int'], []),

    replaceTypes(
      ['common/grids:Pager.allowedPageSizes', 'ui/pagination:dxPaginationOptions.allowedPageSizes'],
      ['*'],
      ['int[]'],
    ),

    replaceTypes(
      'ui/validator:dxValidatorOptions.adapter.validationRequestsCallbacks',
      ['*'],
      ['any[]'],
    ),

    ...replaceTypesMutations,

    [
      ['ui/box:dxBoxOptions', 'ui/box:dxBoxItem.box'],
      ['ui/button:dxButtonOptions', 'common:TextEditorButton.options'],
      ['ui/button:dxButtonOptions', 'ui/form:dxFormButtonItem.buttonOptions'],
      ['ui/button_group:dxButtonGroupOptions', 'ui/chat:dxChatOptions.suggestions'],
      ['ui/calendar:dxCalendarOptions', 'ui/date_box:DateBoxBaseOptions.calendarOptions'],
      ['ui/chat:dxChatOptions', 'common/grids:AIAssistant.chat'],
      [
        'ui/file_uploader:dxFileUploaderOptions',
        'ui/html_editor:dxHtmlEditorImageUpload.fileUploaderOptions',
      ],
      ['ui/file_uploader:dxFileUploaderOptions', 'ui/chat:dxChatOptions.fileUploaderOptions'],
      ['ui/filter_builder:dxFilterBuilderOptions', 'common/grids:GridBaseOptions.filterBuilder'],
      ['ui/filter_builder:dxFilterBuilderOptions', 'ui/card_view:dxCardViewOptions.filterBuilder'],
      ['ui/form:dxFormOptions', 'common/grids:EditingBase.form'],
      ['ui/form:dxFormOptions', 'ui/card_view:Editing.form'],
      ['ui/form:dxFormOptions', 'ui/scheduler:dxSchedulerOptions.editing.form'],
      ['ui/popover:dxPopoverOptions', 'ui/lookup:dxLookupOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'common/grids:AIAssistant.popup'],
      ['ui/popup:dxPopupOptions', 'common/grids:ColumnAIOptions.popup'],
      ['ui/popup:dxPopupOptions', 'common/grids:EditingBase.popup'],
      ['ui/popup:dxPopupOptions', 'common/grids:GridBaseOptions.filterBuilderPopup'],
      ['ui/popup:dxPopupOptions', 'ui/autocomplete:dxAutocompleteOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/card_view:Editing.popup'],
      ['ui/popup:dxPopupOptions', 'ui/card_view:dxCardViewOptions.filterBuilderPopup'],
      ['ui/popup:dxPopupOptions', 'ui/color_box:dxColorBoxOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/date_box:DateBoxBaseOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/drop_down_box:dxDropDownBoxOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/drop_down_button:dxDropDownButtonOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/select_box:dxSelectBoxOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/scheduler:dxSchedulerOptions.editing.popup'],
      ['ui/sortable:dxSortableOptions', 'ui/list:dxListOptions.itemDragging'],
      ['ui/splitter:dxSplitterOptions', 'ui/splitter:dxSplitterItem.splitter'],
      ['ui/tab_panel:dxTabPanelOptions', 'ui/form:dxFormTabbedItem.tabPanelOptions'],
      ['ui/text_box:dxTextBoxOptions', 'common/grids:ColumnAIOptions.editorOptions'],
      [
        'ui/text_box:dxTextBoxOptions',
        'ui/widget/ui.search_box_mixin:SearchBoxMixinOptions.searchEditorOptions',
      ],
      ['ui/speech_to_text:dxSpeechToTextOptions', 'ui/chat:dxChatOptions.speechToTextOptions'],
    ].flatMap((pair) => replaceTypes(pair[1], ['*'], [types.uidRef(pair[0], true)])),

    removeMembers('common/ai-integration:AIIntegration'),
    removeMembers('ui/html_editor:AICommand(|Base|NameExtended|Name)'),
    replaceWithWidgetFactory({
      uid: 'ui/form:dxFormSimpleItem',
      from: {
        componentNameProp: 'editorType',
        componentConfigProp: 'editorOptions',
      },
      to: {
        factoryName: 'FormItemEditor',
        newProp: 'editor',
      },
    }),
    replaceWithWidgetFactory({
      uid: 'ui/toolbar:dxToolbarItem',
      from: {
        componentNameProp: 'widget',
        componentConfigProp: 'options',
      },
      to: {
        factoryName: 'ToolbarItem',
        newProp: 'widget',
      },
    }),
    addMember({
      uid: 'ui/popover:ToolbarItem',
      name: 'dxPopoverToolbarItem',
      parent: 'ui/popup:ToolbarItem',
    }),
    addMember({
      uid: 'ui/popover:dxPopoverOptions.toolbarItems',
      types: [types.array(types.uidRef('ui/popover:ToolbarItem'))],
    }),
    removeMembers('ui/scheduler:ToolbarItem.options'),
  ],
  variables: {
    ForwardedEnums: [
      {
        Uid: 'ui/form:FormItemComponent',
        Name: 'FormItemEditorType',
      },
      {
        Uid: 'common:ToolbarItemComponent',
        Name: 'ToolbarItemWidget',
      },
    ],
    CollectionItems: [...commonSmdCollectionItems],
    Enums: enums,
    EnumAliases: enumAliases,
    EnumItemRenamings: enumItemRenamings,
  },
});

function replaceWithWidgetFactory({
  uid,
  from: { componentNameProp, componentConfigProp },
  to: { factoryName, newProp },
}: {
  uid: string;
  from: {
    componentNameProp: string;
    componentConfigProp: string;
  };
  to: {
    factoryName: AspNet.WidgetFactoryKind;
    newProp: string;
  };
}): Mutation<AspNet.WidgetFactory, never>[] {
  return [
    removeMembers(`${uid}.(${componentNameProp}|${componentConfigProp})`),
    addMember({
      uid: `${uid}.${newProp}`,
      types: [
        {
          kind: 'custom',
          name: 'WidgetFactory',
          params: {
            factory: factoryName,
            componentNameProp,
            componentConfigProp,
          },
        },
      ],
    }),
  ];
}
