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
  export type ColumnBase<TRowData = any> = common.grids.ColumnBase<TRowData>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type ColumnButtonBase = common.grids.ColumnButtonBase;
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
  export type EditingBase<TRowData = any, TKey = any> = common.grids.EditingBase<TRowData, TKey>;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type EditingTextsBase = common.grids.EditingTextsBase;
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
  export type ScrollingBase = common.grids.ScrollingBase;
  /** @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution. */
  export type SelectionBase = common.grids.SelectionBase;
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
