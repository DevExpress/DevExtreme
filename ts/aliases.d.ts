declare namespace DevExpress {
  /** @deprecated Use DevExpress.events.EventObject instead */
  export type dxEvent = DevExpress.events.EventObject;
  /** @deprecated Use DevExpress.events.event instead */
  export type event = DevExpress.events.event;
}

declare namespace DevExpress.viz {
  /** @deprecated Use DevExpress.viz.ChartSeries instead */
  export type dxChartSeries = viz.ChartSeries;
  /** @deprecated Use DevExpress.viz.PieChartSeries instead */
  export type dxPieChartSeries = viz.PieChartSeries;
  /** @deprecated Use DevExpress.viz.PolarChartSeries instead */
  export type dxPolarChartSeries = viz.PolarChartSeries;

  /** @deprecated Use DevExpress.viz instead */
  export namespace charts {
    /** @deprecated */
    export type dxChartOptions = viz.dxChartOptions;
    /** @deprecated */
    export type dxChartArgumentAxis = viz.dxChartArgumentAxis;
    /** @deprecated */
    export type dxChartArgumentAxisConstantLines = viz.dxChartArgumentAxisConstantLines;
    /** @deprecated */
    export type dxChartArgumentAxisConstantLinesLabel = viz.dxChartArgumentAxisConstantLinesLabel;
    /** @deprecated */
    export type dxChartArgumentAxisConstantLineStyle = viz.dxChartArgumentAxisConstantLineStyle;
    /** @deprecated */
    export type dxChartArgumentAxisConstantLineStyleLabel = viz.dxChartArgumentAxisConstantLineStyleLabel;
    /** @deprecated */
    export type dxChartArgumentAxisLabel = viz.dxChartArgumentAxisLabel;
    /** @deprecated */
    export type dxChartArgumentAxisStrips = viz.dxChartArgumentAxisStrips;
    /** @deprecated */
    export type dxChartArgumentAxisStripsLabel = viz.dxChartArgumentAxisStripsLabel;
    /** @deprecated */
    export type dxChartArgumentAxisTitle = viz.dxChartArgumentAxisTitle;
    /** @deprecated */
    export type dxChartCommonAxisSettings = viz.dxChartCommonAxisSettings;
    /** @deprecated */
    export type dxChartCommonAxisSettingsConstantLineStyle = viz.dxChartCommonAxisSettingsConstantLineStyle;
    /** @deprecated */
    export type dxChartCommonAxisSettingsConstantLineStyleLabel = viz.dxChartCommonAxisSettingsConstantLineStyleLabel;
    /** @deprecated */
    export type dxChartCommonAxisSettingsLabel = viz.dxChartCommonAxisSettingsLabel;
    /** @deprecated */
    export type dxChartCommonAxisSettingsStripStyle = viz.dxChartCommonAxisSettingsStripStyle;
    /** @deprecated */
    export type dxChartCommonAxisSettingsStripStyleLabel = viz.dxChartCommonAxisSettingsStripStyleLabel;
    /** @deprecated */
    export type dxChartCommonAxisSettingsTitle = viz.dxChartCommonAxisSettingsTitle;
    /** @deprecated */
    export type dxChartCommonPaneSettings = viz.dxChartCommonPaneSettings;
    /** @deprecated */
    export type dxChartCommonSeriesSettings = viz.dxChartCommonSeriesSettings;
    /** @deprecated */
    export type dxChartLegend = viz.dxChartLegend;
    /** @deprecated */
    export type dxChartPanes = viz.dxChartPanes;
    /** @deprecated */
    export type dxChartSeries = viz.dxChartSeries;
    /** @deprecated */
    export type dxChartTooltip = viz.dxChartTooltip;
    /** @deprecated */
    export type dxChartValueAxis = viz.dxChartValueAxis;
    /** @deprecated */
    export type dxChartValueAxisConstantLines = viz.dxChartValueAxisConstantLines;
    /** @deprecated */
    export type dxChartValueAxisConstantLinesLabel = viz.dxChartValueAxisConstantLinesLabel;
    /** @deprecated */
    export type dxChartValueAxisConstantLineStyle = viz.dxChartValueAxisConstantLineStyle;
    /** @deprecated */
    export type dxChartValueAxisConstantLineStyleLabel = viz.dxChartValueAxisConstantLineStyleLabel;
    /** @deprecated */
    export type dxChartValueAxisLabel = viz.dxChartValueAxisLabel;
    /** @deprecated */
    export type dxChartValueAxisStrips = viz.dxChartValueAxisStrips;
    /** @deprecated */
    export type dxChartValueAxisStripsLabel = viz.dxChartValueAxisStripsLabel;
    /** @deprecated */
    export type dxChartValueAxisTitle = viz.dxChartValueAxisTitle;

    /** @deprecated */
    export type dxPieChartOptions = viz.dxPieChartOptions;
    /** @deprecated */
    export type dxPieChartAdaptiveLayout = viz.dxPieChartAdaptiveLayout;
    /** @deprecated */
    export type dxPieChartLegend = viz.dxPieChartLegend;
    /** @deprecated */
    export type dxPieChartSeries = viz.dxPieChartSeries;

    /** @deprecated */
    export type dxPolarChartOptions = viz.dxPolarChartOptions;
    /** @deprecated */
    export type dxPolarChartAdaptiveLayout = viz.dxPolarChartAdaptiveLayout;
    /** @deprecated */
    export type dxPolarChartArgumentAxis = viz.dxPolarChartArgumentAxis;
    /** @deprecated */
    export type dxPolarChartArgumentAxisConstantLines = viz.dxPolarChartArgumentAxisConstantLines;
    /** @deprecated */
    export type dxPolarChartArgumentAxisConstantLinesLabel = viz.dxPolarChartArgumentAxisConstantLinesLabel;
    /** @deprecated */
    export type dxPolarChartArgumentAxisLabel = viz.dxPolarChartArgumentAxisLabel;
    /** @deprecated */
    export type dxPolarChartArgumentAxisStrips = viz.dxPolarChartArgumentAxisStrips;
    /** @deprecated */
    export type dxPolarChartArgumentAxisStripsLabel = viz.dxPolarChartArgumentAxisStripsLabel;
    /** @deprecated */
    export type dxPolarChartCommonAxisSettings = viz.dxPolarChartCommonAxisSettings;
    /** @deprecated */
    export type dxPolarChartCommonAxisSettingsConstantLineStyle = viz.dxPolarChartCommonAxisSettingsConstantLineStyle;
    /** @deprecated */
    export type dxPolarChartCommonAxisSettingsConstantLineStyleLabel = viz.dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
    /** @deprecated */
    export type dxPolarChartCommonAxisSettingsLabel = viz.dxPolarChartCommonAxisSettingsLabel;
    /** @deprecated */
    export type dxPolarChartCommonAxisSettingsStripStyle = viz.dxPolarChartCommonAxisSettingsStripStyle;
    /** @deprecated */
    export type dxPolarChartCommonAxisSettingsStripStyleLabel = viz.dxPolarChartCommonAxisSettingsStripStyleLabel;
    /** @deprecated */
    export type dxPolarChartCommonAxisSettingsTick = viz.dxPolarChartCommonAxisSettingsTick;
    /** @deprecated */
    export type dxPolarChartCommonSeriesSettings = viz.dxPolarChartCommonSeriesSettings;
    /** @deprecated */
    export type dxPolarChartLegend = viz.dxPolarChartLegend;
    /** @deprecated */
    export type dxPolarChartSeries = viz.dxPolarChartSeries;
    /** @deprecated */
    export type dxPolarChartTooltip = viz.dxPolarChartTooltip;
    /** @deprecated */
    export type dxPolarChartValueAxis = viz.dxPolarChartValueAxis;
    /** @deprecated */
    export type dxPolarChartValueAxisConstantLines = viz.dxPolarChartValueAxisConstantLines;
    /** @deprecated */
    export type dxPolarChartValueAxisConstantLinesLabel = viz.dxPolarChartValueAxisConstantLinesLabel;
    /** @deprecated */
    export type dxPolarChartValueAxisLabel = viz.dxPolarChartValueAxisLabel;
    /** @deprecated */
    export type dxPolarChartValueAxisStrips = viz.dxPolarChartValueAxisStrips;
    /** @deprecated */
    export type dxPolarChartValueAxisStripsLabel = viz.dxPolarChartValueAxisStripsLabel;
    /** @deprecated */
    export type dxPolarChartValueAxisTick = viz.dxPolarChartValueAxisTick;
  }

  /** @deprecated Use DevExpress.viz instead */
  export namespace funnel {
    /** @deprecated */
    export type dxFunnelOptions = viz.dxFunnelOptions;
    /** @deprecated */
    export type dxFunnelTooltip = viz.dxFunnelTooltip;
  }

  /** @deprecated Use DevExpress.viz instead */
  export namespace gauges {
    /** @deprecated */
    export type dxCircularGaugeOptions = viz.dxCircularGaugeOptions;
    /** @deprecated */
    export type dxCircularGaugeRangeContainer = viz.dxCircularGaugeRangeContainer;
    /** @deprecated */
    export type dxCircularGaugeScale = viz.dxCircularGaugeScale;
    /** @deprecated */
    export type dxCircularGaugeScaleLabel = viz.dxCircularGaugeScaleLabel;

    /** @deprecated */
    export type dxLinearGaugeOptions = viz.dxLinearGaugeOptions;
    /** @deprecated */
    export type dxLinearGaugeRangeContainer = viz.dxLinearGaugeRangeContainer;
    /** @deprecated */
    export type dxLinearGaugeScale = viz.dxLinearGaugeScale;
    /** @deprecated */
    export type dxLinearGaugeScaleLabel = viz.dxLinearGaugeScaleLabel;

    /** @deprecated */
    export type dxBarGaugeOptions = viz.dxBarGaugeOptions;
    /** @deprecated */
    export type dxBarGaugeTooltip = viz.dxBarGaugeTooltip;
  }

  /** @deprecated Use DevExpress.viz instead */
  export namespace rangeSelector {
    /** @deprecated */
    export type dxRangeSelectorOptions = viz.dxRangeSelectorOptions;
  }

  /** @deprecated Use DevExpress.viz instead */
  export namespace sparklines {
    /** @deprecated */
    export type dxSparklineOptions = viz.dxSparklineOptions;
    /** @deprecated */
    export type dxBulletOptions = viz.dxBulletOptions;
  }

  /** @deprecated Use DevExpress.viz instead */
  export namespace map {
    /** @deprecated */
    export type dxVectorMapOptions = viz.dxVectorMapOptions;
    /** @deprecated */
    export type dxVectorMapTooltip = viz.dxVectorMapTooltip;
  }

  /** @deprecated Use DevExpress.viz instead */
  export namespace treeMap {
    /** @deprecated */
    export type dxTreeMapOptions = viz.dxTreeMapOptions;
    /** @deprecated */
    export type dxTreeMapTooltip = viz.dxTreeMapTooltip;
  }
}

declare namespace DevExpress.ui {
  /** @deprecated Use DevExpress.ui.dxAccordionItem */
  export type dxAccordionItemTemplate = ui.dxAccordionItem;

  /** @deprecated Use DevExpress.ui.dxActionSheetItem */
  export type dxActionSheetItemTemplate = ui.dxActionSheetItem;

  /** @deprecated Use DevExpress.ui.dxBoxItem */
  export type dxBoxItemTemplate = ui.dxBoxItem;

  /** @deprecated Use DevExpress.ui.dxGalleryItem */
  export type dxGalleryItemTemplate = ui.dxGalleryItem;

  /** @deprecated Use DevExpress.ui.dxMultiViewItem */
  export type dxMultiViewItemTemplate = ui.dxMultiViewItem;

  /** @deprecated Use DevExpress.ui.dxResponsiveBoxItem */
  export type dxResponsiveBoxItemTemplate = ui.dxResponsiveBoxItem;

  /** @deprecated Use DevExpress.ui.dxSchedulerAppointment */
  export type dxSchedulerAppointmentTemplate = ui.dxSchedulerAppointment;

  /** @deprecated Use DevExpress.ui.dxTabsItem */
  export type dxTabsItemTemplate = ui.dxTabsItem;

  /** @deprecated Use DevExpress.ui.dxTabPanelItem */
  export type dxTabPanelItemTemplate = ui.dxTabPanelItem;

  /** @deprecated Use DevExpress.ui.dxTileViewItem */
  export type dxTileViewItemTemplate = ui.dxTileViewItem;

  /** @deprecated Use DevExpress.ui.dxToolbarItem */
  export type dxToolbarItemTemplate = ui.dxToolbarItem;

  /** @deprecated Use DevExpress.ui.CollectionWidgetItem */
  export type CollectionWidgetItemTemplate = ui.CollectionWidgetItem;

  /** @deprecated Use DevExpress.ui.dxContextMenuItem */
  export type dxContextMenuItemTemplate = ui.dxContextMenuItem;

  /** @deprecated Use DevExpress.ui.dxMenuBaseItem */
  export type dxMenuBaseItemTemplate = ui.dxMenuBaseItem;

  /** @deprecated Use DevExpress.ui.CollectionWidgetItem */
  export type DataExpressionMixinItemTemplate = ui.CollectionWidgetItem;

  /** @deprecated Use DevExpress.ui.dxListItem */
  export type dxListItemTemplate = ui.dxListItem;

  /** @deprecated Use DevExpress.ui.dxMenuItem */
  export type dxMenuItemTemplate = ui.dxMenuItem;

  /** @deprecated Use DevExpress.ui.dxTreeViewItem */
  export type dxTreeViewItemTemplate = ui.dxTreeViewItem;
}

// v22.1

declare namespace DevExpress.ui {
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type GridBase<TRowData = any, TKey = any> = common.grids.GridBase<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type GridBaseOptions<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> = common.grids.GridBaseOptions<TComponent, TRowData, TKey>;
}

declare namespace DevExpress.ui.dxDataGrid {

  /** @deprecated Use DevExpress.common.Scrollable */
  export type Scrollable = common.Scrollable;

  /** @deprecated Use DevExpress.common.grids.ColumnChooser instead */
  export type ColumnChooser = common.grids.ColumnChooser;
  /** @deprecated Use DevExpress.common.grids.ColumnCustomizeTextArg instead */
  export type ColumnCustomizeTextArg = common.grids.ColumnCustomizeTextArg;
  /** @deprecated Use DevExpress.common.grids.ColumnFixing instead */
  export type ColumnFixing = common.grids.ColumnFixing;
  /** @deprecated Use DevExpress.common.grids.ColumnFixingTexts instead */
  export type ColumnFixingTexts = common.grids.ColumnFixingTexts;
  /** @deprecated Use DevExpress.common.grids.ColumnHeaderFilter instead */
  export type ColumnHeaderFilter = common.grids.ColumnHeaderFilter;
  /** @deprecated Use DevExpress.common.grids.ColumnLookup instead */
  export type ColumnLookup = common.grids.ColumnLookup;
  /** @deprecated Use DevExpress.common.grids.DataChange instead */
  export type DataChange<TRowData = any, TKey = any> = common.grids.DataChange<TRowData, TKey>;
  /** @deprecated Use DevExpress.common.grids.FilterPanelTexts instead */
  export type FilterPanelTexts = common.grids.FilterPanelTexts;
  /** @deprecated Use DevExpress.common.grids.FilterRow instead */
  export type FilterRow = common.grids.FilterRow;
  /** @deprecated Use DevExpress.common.grids.FilterRowOperationDescriptions instead */
  export type FilterRowOperationDescriptions = common.grids.FilterRowOperationDescriptions;
  /** @deprecated Use DevExpress.common.grids.HeaderFilter instead */
  export type HeaderFilter = common.grids.HeaderFilter;
  /** @deprecated Use DevExpress.common.grids.HeaderFilterGroupInterval instead */
  export type HeaderFilterGroupInterval = common.grids.HeaderFilterGroupInterval;
  /** @deprecated Use DevExpress.common.grids.HeaderFilterTexts instead */
  export type HeaderFilterTexts = common.grids.HeaderFilterTexts;
  /** @deprecated Use DevExpress.common.grids.KeyboardNavigation instead */
  export type KeyboardNavigation = common.grids.KeyboardNavigation;
  /** @deprecated Use DevExpress.common.grids.LoadPanel instead */
  export type LoadPanel = common.grids.LoadPanel;
  /** @deprecated Use DevExpress.common.grids.Pager instead */
  export type Pager = common.grids.Pager;
  /** @deprecated Use DevExpress.common.grids.RowDraggingTemplateData instead */
  export type RowDraggingTemplateData = common.grids.RowDraggingTemplateData;
  /** @deprecated Use DevExpress.common.grids.RowDraggingTemplateData instead */
  export type RowDraggingTemplateDataModel = common.grids.RowDraggingTemplateData;
  /** @deprecated Use DevExpress.common.grids.SearchPanel instead */
  export type SearchPanel = common.grids.SearchPanel;
  /** @deprecated Use DevExpress.common.grids.Sorting instead */
  export type Sorting = common.grids.Sorting;
  /** @deprecated Use DevExpress.common.grids.StateStoring instead */
  export type StateStoring = common.grids.StateStoring;

  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type AdaptiveDetailRowPreparingInfo = common.grids.AdaptiveDetailRowPreparingInfo;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type DataChangeInfo<TRowData = any, TKey = any> = common.grids.DataChangeInfo<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type DataErrorOccurredInfo = common.grids.DataErrorOccurredInfo;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type DragDropInfo = common.grids.DragDropInfo;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type DragReorderInfo = common.grids.DragReorderInfo;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type DragStartEventInfo<TRowData = any> = common.grids.DragStartEventInfo<TRowData>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type KeyDownInfo = common.grids.KeyDownInfo;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type NewRowInfo<TRowData = any> = common.grids.NewRowInfo<TRowData>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type PagingBase = common.grids.PagingBase;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type RowDraggingEventInfo<TRowData = any> = common.grids.RowDraggingEventInfo<TRowData>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type RowInsertedInfo<TRowData = any, TKey = any> = common.grids.RowInsertedInfo<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type RowInsertingInfo<TRowData = any> = common.grids.RowInsertingInfo<TRowData>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type RowKeyInfo<TKey = any> = common.grids.RowKeyInfo<TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type RowRemovedInfo<TRowData = any, TKey = any> = common.grids.RowRemovedInfo<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type RowRemovingInfo<TRowData = any, TKey = any> = common.grids.RowRemovingInfo<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type RowUpdatedInfo<TRowData = any, TKey = any> = common.grids.RowUpdatedInfo<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type RowUpdatingInfo<TRowData = any, TKey = any> = common.grids.RowUpdatingInfo<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type RowValidatingInfo<TRowData = any, TKey = any> = common.grids.RowValidatingInfo<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type SavingInfo<TRowData = any, TKey = any> = common.grids.SavingInfo<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type SelectionChangedInfo<TRowData = any, TKey = any> = common.grids.SelectionChangedInfo<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type ToolbarPreparingInfo = common.grids.ToolbarPreparingInfo;
}

declare namespace DevExpress.common.charts {
  /** @deprecated Use DevExpress.common.grids.ApplyChangesMode instead */
  export type ApplyChangesMode = common.grids.ApplyChangesMode;
  /** @deprecated Use DevExpress.common.grids.ApplyFilterMode instead */
  export type ApplyFilterMode = common.grids.ApplyFilterMode;
  /** @deprecated Use DevExpress.common.grids.ColumnChooserMode instead */
  export type ColumnChooserMode = common.grids.ColumnChooserMode;
  /** @deprecated Use DevExpress.common.grids.ColumnResizeMode instead */
  export type ColumnResizeMode = common.grids.ColumnResizeMode;
  /** @deprecated Use DevExpress.common.grids.DataChangeType instead */
  export type DataChangeType = common.grids.DataChangeType;
  /** @deprecated Use DevExpress.common.grids.DataRenderMode instead */
  export type DataRenderMode = common.grids.DataRenderMode;
  /** @deprecated Use DevExpress.common.grids.EnterKeyAction instead */
  export type EnterKeyAction = common.grids.EnterKeyAction;
  /** @deprecated Use DevExpress.common.grids.EnterKeyDirection instead */
  export type EnterKeyDirection = common.grids.EnterKeyDirection;
  /** @deprecated Use DevExpress.common.grids.FilterOperation instead */
  export type FilterOperation = common.grids.FilterOperation;
  /** @deprecated Use DevExpress.common.grids.FilterType instead */
  export type FilterType = common.grids.FilterType;
  /** @deprecated Use DevExpress.common.grids.GridsEditMode instead */
  export type GridsEditMode = common.grids.GridsEditMode;
  /** @deprecated Use DevExpress.common.grids.GridsEditRefreshMode instead */
  export type GridsEditRefreshMode = common.grids.GridsEditRefreshMode;
  /** @deprecated Use DevExpress.common.grids.GroupExpandMode instead */
  export type GroupExpandMode = common.grids.GroupExpandMode;
  /** @deprecated Use DevExpress.common.grids.NewRowPosition instead */
  export type NewRowPosition = common.grids.NewRowPosition;
  /** @deprecated Use DevExpress.common.grids.PagerDisplayMode instead */
  export type PagerDisplayMode = common.grids.PagerDisplayMode;
  /** @deprecated Use DevExpress.common.grids.PagerPageSize instead */
  export type PagerPageSize = common.grids.PagerPageSize;
  /** @deprecated Use DevExpress.common.grids.SelectedFilterOperation instead */
  export type SelectedFilterOperation = common.grids.SelectedFilterOperation;
  /** @deprecated Use DevExpress.common.grids.SelectionColumnDisplayMode instead */
  export type SelectionColumnDisplayMode = common.grids.SelectionColumnDisplayMode;
  /** @deprecated Use DevExpress.common.grids.StartEditAction instead */
  export type StartEditAction = common.grids.StartEditAction;
  /** @deprecated Use DevExpress.common.grids.StateStoreType instead */
  export type StateStoreType = common.grids.StateStoreType;
  /** @deprecated Use DevExpress.common.grids.SummaryType instead */
  export type SummaryType = common.grids.SummaryType;
}

// v22.2
declare namespace DevExpress {
  /** @deprecated Use DevExpress.GlobalConfig instead */
  export type globalConfig = common.GlobalConfig;
}

declare namespace DevExpress.ui {
  /** @deprecated Use DevExpress.common.AsyncRule instead */
  export type AsyncRule = common.AsyncRule;
  /** @deprecated Use DevExpress.common.CompareRule instead */
  export type CompareRule = common.CompareRule;
  /** @deprecated Use DevExpress.common.CustomRule instead */
  export type CustomRule = common.CustomRule;
  /** @deprecated Use DevExpress.common.EmailRule instead */
  export type EmailRule = common.EmailRule;
  /** @deprecated Use DevExpress.common.NumericRule instead */
  export type NumericRule = common.NumericRule;
  /** @deprecated Use DevExpress.common.PatternRule instead */
  export type PatternRule = common.PatternRule;
  /** @deprecated Use DevExpress.common.RangeRule instead */
  export type RangeRule = common.RangeRule;
  /** @deprecated Use DevExpress.common.RequiredRule instead */
  export type RequiredRule = common.RequiredRule;
  /** @deprecated Use DevExpress.common.StringLengthRule instead */
  export type StringLengthRule = common.StringLengthRule;
  /** @deprecated Use DevExpress.common.ValidationCallbackData instead */
  export type ValidationCallbackData = common.ValidationCallbackData;
  /** @deprecated Use DevExpress.common.ValidationRule instead */
  export type ValidationRule = common.ValidationRule;
  /** @deprecated Use DevExpress.common.ValidationRuleType instead */
  export type ValidationRuleType = common.ValidationRuleType;
}

declare namespace DevExpress.viz {
  /** @deprecated Use DevExpress.common.ScaleBreak instead */
  export type ScaleBreak = common.charts.ScaleBreak;
  /** @deprecated Use DevExpress.common.SeriesType instead */
  export type SeriesType = common.charts.SeriesType;
  /** @deprecated Use DevExpress.common.VisualRange instead */
  export type VisualRange = common.charts.VisualRange;
  /** @deprecated Use DevExpress.common.TimeIntervalConfig instead */
  export type VizTimeInterval = common.charts.TimeIntervalConfig;
}

// v23.1

declare namespace DevExpress.ui.dxSlider {
  /** @deprecated Use DevExpress.common.SliderValueChangeMode instead */
  export type ValueChangeMode = common.SliderValueChangeMode;
}

declare namespace DevExpress.viz.dxFunnel {
  /** @deprecated Use DevExpress.common.charts.ShiftLabelOverlap instead */
  export type FunnelLabelOverlap = common.charts.ShiftLabelOverlap;
}

declare namespace DevExpress.viz.dxPieChart {
  /** @deprecated Use DevExpress.common.charts.ShiftLabelOverlap instead */
  export type PieChartLabelOverlap = common.charts.ShiftLabelOverlap;
}

declare namespace DevExpress.viz {

  /** @deprecated Use DevExpress.viz.dxBarGauge.Legend instead */
  export type dxBarGaugeLegend = viz.dxBarGauge.Legend;

  /** @deprecated Use DevExpress.viz.dxBarGauge.LoadingIndicator instead */
  export type dxBarGaugeLoadingIndicator = viz.dxBarGauge.LoadingIndicator;

  /** @deprecated Use DevExpress.viz.dxBarGauge.Tooltip instead */
  export type dxBarGaugeTooltip = viz.dxBarGauge.Tooltip;

  /** @deprecated Use DevExpress.viz.dxChart.ArgumentAxis instead */
  export type dxChartArgumentAxis = viz.dxChart.ArgumentAxis;

  /** @deprecated Use DevExpress.viz.dxChart.ArgumentAxisConstantLines instead */
  export type dxChartArgumentAxisConstantLines = viz.dxChart.ArgumentAxisConstantLines;

  /** @deprecated Use DevExpress.viz.dxChart.ArgumentAxisConstantLinesLabel instead */
  export type dxChartArgumentAxisConstantLinesLabel = viz.dxChart.ArgumentAxisConstantLinesLabel;

  /** @deprecated Use DevExpress.viz.dxChart.ArgumentAxisConstantLineStyle instead */
  export type dxChartArgumentAxisConstantLineStyle = viz.dxChart.ArgumentAxisConstantLineStyle;

  /** @deprecated Use DevExpress.viz.dxChart.ArgumentAxisConstantLineStyleLabel instead */
  export type dxChartArgumentAxisConstantLineStyleLabel = viz.dxChart.ArgumentAxisConstantLineStyleLabel;

  /** @deprecated Use DevExpress.viz.dxChart.ArgumentAxisLabel instead */
  export type dxChartArgumentAxisLabel = viz.dxChart.ArgumentAxisLabel;

  /** @deprecated Use DevExpress.viz.dxChart.ArgumentAxisStrips instead */
  export type dxChartArgumentAxisStrips = viz.dxChart.ArgumentAxisStrips;

  /** @deprecated Use DevExpress.viz.dxChart.ArgumentAxisStripsLabel instead */
  export type dxChartArgumentAxisStripsLabel = viz.dxChart.ArgumentAxisStripsLabel;

  /** @deprecated Use DevExpress.viz.dxChart.ArgumentAxisTitle instead */
  export type dxChartArgumentAxisTitle = viz.dxChart.ArgumentAxisTitle;

  /** @deprecated Use DevExpress.viz.dxChart.CommonAxisSettings instead */
  export type dxChartCommonAxisSettings = viz.dxChart.CommonAxisSettings;

  /** @deprecated Use DevExpress.viz.dxChart.CommonAxisSettingsConstantLineStyle instead */
  export type dxChartCommonAxisSettingsConstantLineStyle = viz.dxChart.CommonAxisSettingsConstantLineStyle;

  /** @deprecated Use DevExpress.viz.dxChart.CommonAxisSettingsConstantLineStyleLabel instead */
  export type dxChartCommonAxisSettingsConstantLineStyleLabel = viz.dxChart.CommonAxisSettingsConstantLineStyleLabel;

  /** @deprecated Use DevExpress.viz.dxChart.CommonAxisSettingsLabel instead */
  export type dxChartCommonAxisSettingsLabel = viz.dxChart.CommonAxisSettingsLabel;

  /** @deprecated Use DevExpress.viz.dxChart.CommonAxisSettingsStripStyle instead */
  export type dxChartCommonAxisSettingsStripStyle = viz.dxChart.CommonAxisSettingsStripStyle;

  /** @deprecated Use DevExpress.viz.dxChart.CommonAxisSettingsStripStyleLabel instead */
  export type dxChartCommonAxisSettingsStripStyleLabel = viz.dxChart.CommonAxisSettingsStripStyleLabel;

  /** @deprecated Use DevExpress.viz.dxChart.CommonAxisSettingsTitle instead */
  export type dxChartCommonAxisSettingsTitle = viz.dxChart.CommonAxisSettingsTitle;

  /** @deprecated Use DevExpress.viz.dxChart.CommonPaneSettings instead */
  export type dxChartCommonPaneSettings = viz.dxChart.CommonPaneSettings;

  /** @deprecated Use DevExpress.viz.dxChart.CommonSeriesSettings instead */
  export type dxChartCommonSeriesSettings = viz.dxChart.CommonSeriesSettings;

  /** @deprecated Use DevExpress.viz.dxChart.Legend instead */
  export type dxChartLegend = viz.dxChart.Legend;

  /** @deprecated Use DevExpress.viz.dxChart.Panes instead */
  export type dxChartPanes = viz.dxChart.Panes;

  /** @deprecated Use DevExpress.viz.dxChart.Tooltip instead */
  export type dxChartTooltip = viz.dxChart.Tooltip;

  /** @deprecated Use DevExpress.viz.dxChart.ValueAxis instead */
  export type dxChartValueAxis = viz.dxChart.ValueAxis;

  /** @deprecated Use DevExpress.viz.dxChart.ValueAxisConstantLines instead */
  export type dxChartValueAxisConstantLines = viz.dxChart.ValueAxisConstantLines;

  /** @deprecated Use DevExpress.viz.dxChart.ValueAxisConstantLinesLabel instead */
  export type dxChartValueAxisConstantLinesLabel = viz.dxChart.ValueAxisConstantLinesLabel;

  /** @deprecated Use DevExpress.viz.dxChart.ValueAxisConstantLineStyle instead */
  export type dxChartValueAxisConstantLineStyle = viz.dxChart.ValueAxisConstantLineStyle;

  /** @deprecated Use DevExpress.viz.dxChart.ValueAxisConstantLineStyleLabel instead */
  export type dxChartValueAxisConstantLineStyleLabel = viz.dxChart.ValueAxisConstantLineStyleLabel;

  /** @deprecated Use DevExpress.viz.dxChart.ValueAxisLabel instead */
  export type dxChartValueAxisLabel = viz.dxChart.ValueAxisLabel;

  /** @deprecated Use DevExpress.viz.dxChart.ValueAxisStrips instead */
  export type dxChartValueAxisStrips = viz.dxChart.ValueAxisStrips;

  /** @deprecated Use DevExpress.viz.dxChart.ValueAxisStripsLabel instead */
  export type dxChartValueAxisStripsLabel = viz.dxChart.ValueAxisStripsLabel;

  /** @deprecated Use DevExpress.viz.dxChart.ValueAxisTitle instead */
  export type dxChartValueAxisTitle = viz.dxChart.ValueAxisTitle;

  /** @deprecated Use DevExpress.viz.dxPolarChart.AdaptiveLayout instead */
  export type dxPolarChartAdaptiveLayout = viz.dxPolarChart.AdaptiveLayout;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ArgumentAxis instead */
  export type dxPolarChartArgumentAxis = viz.dxPolarChart.ArgumentAxis;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ArgumentAxisConstantLines instead */
  export type dxPolarChartArgumentAxisConstantLines = viz.dxPolarChart.ArgumentAxisConstantLines;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ArgumentAxisConstantLinesLabel instead */
  export type dxPolarChartArgumentAxisConstantLinesLabel = viz.dxPolarChart.ArgumentAxisConstantLinesLabel;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ArgumentAxisLabel instead */
  export type dxPolarChartArgumentAxisLabel = viz.dxPolarChart.ArgumentAxisLabel;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ArgumentAxisMinorTick instead */
  export type dxPolarChartArgumentAxisMinorTick = viz.dxPolarChart.ArgumentAxisMinorTick;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ArgumentAxisStrips instead */
  export type dxPolarChartArgumentAxisStrips = viz.dxPolarChart.ArgumentAxisStrips;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ArgumentAxisStripsLabel instead */
  export type dxPolarChartArgumentAxisStripsLabel = viz.dxPolarChart.ArgumentAxisStripsLabel;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ArgumentAxisTick instead */
  export type dxPolarChartArgumentAxisTick = viz.dxPolarChart.ArgumentAxisTick;

  /** @deprecated Use DevExpress.viz.dxPolarChart.CommonAxisSettings instead */
  export type dxPolarChartCommonAxisSettings = viz.dxPolarChart.CommonAxisSettings;

  /** @deprecated Use DevExpress.viz.dxPolarChart.CommonAxisSettingsConstantLineStyle instead */
  export type dxPolarChartCommonAxisSettingsConstantLineStyle = viz.dxPolarChart.CommonAxisSettingsConstantLineStyle;

  /** @deprecated Use DevExpress.viz.dxPolarChart.CommonAxisSettingsConstantLineStyleLabel instead */
  export type dxPolarChartCommonAxisSettingsConstantLineStyleLabel = viz.dxPolarChart.CommonAxisSettingsConstantLineStyleLabel;

  /** @deprecated Use DevExpress.viz.dxPolarChart.CommonAxisSettingsLabel instead */
  export type dxPolarChartCommonAxisSettingsLabel = viz.dxPolarChart.CommonAxisSettingsLabel;

  /** @deprecated Use DevExpress.viz.dxPolarChart.CommonAxisSettingsMinorTick instead */
  export type dxPolarChartCommonAxisSettingsMinorTick = viz.dxPolarChart.CommonAxisSettingsMinorTick;

  /** @deprecated Use DevExpress.viz.dxPolarChart.CommonAxisSettingsStripStyle instead */
  export type dxPolarChartCommonAxisSettingsStripStyle = viz.dxPolarChart.CommonAxisSettingsStripStyle;

  /** @deprecated Use DevExpress.viz.dxPolarChart.CommonAxisSettingsStripStyleLabel instead */
  export type dxPolarChartCommonAxisSettingsStripStyleLabel = viz.dxPolarChart.CommonAxisSettingsStripStyleLabel;

  /** @deprecated Use DevExpress.viz.dxPolarChart.CommonAxisSettingsTick instead */
  export type dxPolarChartCommonAxisSettingsTick = viz.dxPolarChart.CommonAxisSettingsTick;

  /** @deprecated Use DevExpress.viz.dxPolarChart.CommonSeriesSettings instead */
  export type dxPolarChartCommonSeriesSettings = viz.dxPolarChart.CommonSeriesSettings;

  /** @deprecated Use DevExpress.viz.dxPolarChart.Legend instead */
  export type dxPolarChartLegend = viz.dxPolarChart.Legend;

  /** @deprecated Use DevExpress.viz.dxPolarChart.Tooltip instead */
  export type dxPolarChartTooltip = viz.dxPolarChart.Tooltip;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ValueAxis instead */
  export type dxPolarChartValueAxis = viz.dxPolarChart.ValueAxis;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ValueAxisConstantLines instead */
  export type dxPolarChartValueAxisConstantLines = viz.dxPolarChart.ValueAxisConstantLines;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ValueAxisConstantLinesLabel instead */
  export type dxPolarChartValueAxisConstantLinesLabel = viz.dxPolarChart.ValueAxisConstantLinesLabel;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ValueAxisLabel instead */
  export type dxPolarChartValueAxisLabel = viz.dxPolarChart.ValueAxisLabel;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ValueAxisStrips instead */
  export type dxPolarChartValueAxisStrips = viz.dxPolarChart.ValueAxisStrips;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ValueAxisStripsLabel instead */
  export type dxPolarChartValueAxisStripsLabel = viz.dxPolarChart.ValueAxisStripsLabel;

  /** @deprecated Use DevExpress.viz.dxPolarChart.ValueAxisTick instead */
  export type dxPolarChartValueAxisTick = viz.dxPolarChart.ValueAxisTick;

  /** @deprecated Use DevExpress.viz.dxCircularGauge.RangeContainer instead */
  export type dxCircularGaugeRangeContainer = viz.dxCircularGauge.RangeContainer;

  /** @deprecated Use DevExpress.viz.dxCircularGauge.Scale instead */
  export type dxCircularGaugeScale = viz.dxCircularGauge.Scale;

  /** @deprecated Use DevExpress.viz.dxCircularGauge.ScaleLabel instead */
  export type dxCircularGaugeScaleLabel = viz.dxCircularGauge.ScaleLabel;

  /** @deprecated Use DevExpress.viz.dxFunnel.Legend instead */
  export type dxFunnelLegend = dxFunnel.Legend;

  /** @deprecated Use DevExpress.viz.dxFunnel.Tooltip instead */
  export type dxFunnelTooltip = dxFunnel.Tooltip;

  /** @deprecated Use DevExpress.viz.dxLinearGauge.RangeContainer instead */
  export type dxLinearGaugeRangeContainer = viz.dxLinearGauge.RangeContainer;

  /** @deprecated Use DevExpress.viz.dxLinearGauge.Scale instead */
  export type dxLinearGaugeScale = viz.dxLinearGauge.Scale;

  /** @deprecated Use DevExpress.viz.dxLinearGauge.ScaleLabel instead */
  export type dxLinearGaugeScaleLabel = viz.dxLinearGauge.ScaleLabel;

  /** @deprecated Use DevExpress.viz.dxPieChart.AdaptiveLayout instead */
  export type dxPieChartAdaptiveLayout = dxPieChart.AdaptiveLayout;

  /** @deprecated Use DevExpress.viz.dxPieChart.Legend instead */
  export type dxPieChartLegend = dxPieChart.Legend;

  /** @deprecated Use DevExpress.viz.dxSankey.Tooltip instead */
  export type dxSankeyTooltip = viz.dxSankey.Tooltip;

  /** @deprecated Use DevExpress.viz.dxTreeMap.Tooltip instead */
  export type dxTreeMapTooltip = viz.dxTreeMap.Tooltip;

  /** @deprecated Use DevExpress.viz.dxVectorMap.Legend instead */
  export type dxVectorMapLegends = viz.dxVectorMap.Legend;

  /** @deprecated Use DevExpress.viz.dxVectorMap.Tooltip instead */
  export type dxVectorMapTooltip = viz.dxVectorMap.Tooltip;

}

declare namespace DevExpress.ui {

  /** @deprecated Use DevExpress.ui.dxDataGrid.Editing instead */
  export type dxDataGridEditing<TRowData, TKey = any> = dxDataGrid.Editing<TRowData, TKey>;

  /** @deprecated Use DevExpress.ui.dxDataGrid.Scrolling instead */
  export type dxDataGridScrolling = dxDataGrid.Scrolling;

  /** @deprecated Use DevExpress.ui.dxDataGrid.Selection instead */
  export type dxDataGridSelection = dxDataGrid.Selection;

  /** @deprecated Use DevExpress.ui.dxTreeList.Editing instead */
  export type dxTreeListEditing<TRowData = any, TKey = any> = ui.dxTreeList.Editing<TRowData, TKey>;

  /** @deprecated Use DevExpress.ui.dxTreeList.Scrolling instead */
  export type dxTreeListScrolling = ui.dxTreeList.Scrolling;

  /** @deprecated Use DevExpress.ui.dxTreeList.Selection instead */
  export type dxTreeListSelection = ui.dxTreeList.Selection;

  /** @deprecated Use DevExpress.ui.dxTreeList.EditingTexts instead */
  export type dxTreeListEditingTexts = ui.dxTreeList.EditingTexts;

  /** @deprecated Use DevExpress.ui.dxTreeList.Paging instead */
  export type dxTreeListPaging = ui.dxTreeList.Paging;

  /** @deprecated Use DevExpress.ui.dxDataGrid.Column instead */
  export type GridBaseColumn<TRowData = any> = dxDataGrid.ColumnBase<TRowData>;

  /** @deprecated Use DevExpress.ui.dxDataGrid.ColumnButton instead */
  export type GridBaseColumnButton = dxDataGrid.ColumnButtonBase;

  /** @deprecated Use DevExpress.ui.dxDataGrid.Editing instead */
  export type GridBaseEditing<TRowData = any, TKey = any> = dxDataGrid.EditingBase<TRowData, TKey>;

  /** @deprecated Use DevExpress.ui.dxDataGrid.EditingTexts instead */
  export type GridBaseEditingTexts = dxDataGrid.EditingTextsBase;

  /** @deprecated Use DevExpress.ui.dxDataGrid.Paging instead */
  export type GridBasePaging = dxDataGrid.Paging;

  /** @deprecated Use DevExpress.ui.dxDataGrid.Scrolling instead */
  export type GridBaseScrolling = dxDataGrid.Scrolling;

  /** @deprecated Use DevExpress.ui.dxDataGrid.Selection instead */
  export type GridBaseSelection = dxDataGrid.Selection;
}

declare namespace DevExpress.ui.dxDataGrid {

  /** @deprecated Use DevExpress.ui.dxDataGrid.SortByGroupSummaryInfoItem instead */
  export type dxDataGridSortByGroupSummaryInfoItem = dxDataGrid.SortByGroupSummaryInfoItem;

  /** @deprecated Use DevExpress.ui.dxDataGrid.EditingTexts instead */
  export type EditingTextsBase = dxDataGrid.EditingTexts;

}
