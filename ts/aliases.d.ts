declare module DevExpress {
    /** @deprecated Use DevExpress.events.EventObject instead */
    export type dxEvent = DevExpress.events.EventObject
    /** @deprecated Use DevExpress.events.event instead */
    export type event = DevExpress.events.event
}

declare module DevExpress.viz {
    /** @deprecated Use DevExpress.viz.ChartSeries instead */
    export type dxChartSeries =  DevExpress.viz.ChartSeries;
    /** @deprecated Use DevExpress.viz.PieChartSeries instead */
    export type dxPieChartSeries =  DevExpress.viz.PieChartSeries;
    /** @deprecated Use DevExpress.viz.PolarChartSeries instead */
    export type dxPolarChartSeries =  DevExpress.viz.PolarChartSeries;

    /** @deprecated Use DevExpress.viz instead */
    export module charts {
        export type dxChartOptions = DevExpress.viz.dxChartOptions;
        export type dxChartArgumentAxis = DevExpress.viz.dxChartArgumentAxis;
        export type dxChartArgumentAxisConstantLines  = DevExpress.viz.dxChartArgumentAxisConstantLines;
        export type dxChartArgumentAxisConstantLinesLabel = DevExpress.viz.dxChartArgumentAxisConstantLinesLabel;
        export type dxChartArgumentAxisConstantLineStyle = DevExpress.viz.dxChartArgumentAxisConstantLineStyle;
        export type dxChartArgumentAxisConstantLineStyleLabel = DevExpress.viz.dxChartArgumentAxisConstantLineStyleLabel;
        export type dxChartArgumentAxisLabel = DevExpress.viz.dxChartArgumentAxisLabel;
        export type dxChartArgumentAxisStrips = DevExpress.viz.dxChartArgumentAxisStrips;
        export type dxChartArgumentAxisStripsLabel = DevExpress.viz.dxChartArgumentAxisStripsLabel;
        export type dxChartArgumentAxisTitle = DevExpress.viz.dxChartArgumentAxisTitle;
        export type dxChartCommonAxisSettings = DevExpress.viz.dxChartCommonAxisSettings;
        export type dxChartCommonAxisSettingsConstantLineStyle = DevExpress.viz.dxChartCommonAxisSettingsConstantLineStyle;
        export type dxChartCommonAxisSettingsConstantLineStyleLabel = DevExpress.viz.dxChartCommonAxisSettingsConstantLineStyleLabel;
        export type dxChartCommonAxisSettingsLabel = DevExpress.viz.dxChartCommonAxisSettingsLabel;
        export type dxChartCommonAxisSettingsStripStyle = DevExpress.viz.dxChartCommonAxisSettingsStripStyle;
        export type dxChartCommonAxisSettingsStripStyleLabel = DevExpress.viz.dxChartCommonAxisSettingsStripStyleLabel;
        export type dxChartCommonAxisSettingsTitle = DevExpress.viz.dxChartCommonAxisSettingsTitle;
        export type dxChartCommonPaneSettings = DevExpress.viz.dxChartCommonPaneSettings;
        export type dxChartCommonSeriesSettings = DevExpress.viz.dxChartCommonSeriesSettings;
        export type dxChartLegend = DevExpress.viz.dxChartLegend;
        export type dxChartPanes = DevExpress.viz.dxChartPanes;
        export type dxChartSeries = DevExpress.viz.dxChartSeries;
        export type dxChartTooltip = DevExpress.viz.dxChartTooltip;
        export type dxChartValueAxis = DevExpress.viz.dxChartValueAxis;
        export type dxChartValueAxisConstantLines = DevExpress.viz.dxChartValueAxisConstantLines;
        export type dxChartValueAxisConstantLinesLabel = DevExpress.viz.dxChartValueAxisConstantLinesLabel;
        export type dxChartValueAxisConstantLineStyle = DevExpress.viz.dxChartValueAxisConstantLineStyle;
        export type dxChartValueAxisConstantLineStyleLabel = DevExpress.viz.dxChartValueAxisConstantLineStyleLabel;
        export type dxChartValueAxisLabel = DevExpress.viz.dxChartValueAxisLabel;
        export type dxChartValueAxisStrips = DevExpress.viz.dxChartValueAxisStrips;
        export type dxChartValueAxisStripsLabel = DevExpress.viz.dxChartValueAxisStripsLabel;
        export type dxChartValueAxisTitle = DevExpress.viz.dxChartValueAxisTitle;

        export type dxPieChartOptions = DevExpress.viz.dxPieChartOptions;
        export type dxPieChartAdaptiveLayout = DevExpress.viz.dxPieChartAdaptiveLayout;
        export type dxPieChartLegend = DevExpress.viz.dxPieChartLegend;
        export type dxPieChartSeries = DevExpress.viz.dxPieChartSeries;

        export type dxPolarChartOptions = DevExpress.viz.dxPolarChartOptions;
        export type dxPolarChartAdaptiveLayout = DevExpress.viz.dxPolarChartAdaptiveLayout;
        export type dxPolarChartArgumentAxis = DevExpress.viz.dxPolarChartArgumentAxis;
        export type dxPolarChartArgumentAxisConstantLines = DevExpress.viz.dxPolarChartArgumentAxisConstantLines;
        export type dxPolarChartArgumentAxisConstantLinesLabel = DevExpress.viz.dxPolarChartArgumentAxisConstantLinesLabel;
        export type dxPolarChartArgumentAxisLabel = DevExpress.viz.dxPolarChartArgumentAxisLabel;
        export type dxPolarChartArgumentAxisStrips = DevExpress.viz.dxPolarChartArgumentAxisStrips;
        export type dxPolarChartArgumentAxisStripsLabel = DevExpress.viz.dxPolarChartArgumentAxisStripsLabel;
        export type dxPolarChartCommonAxisSettings = DevExpress.viz.dxPolarChartCommonAxisSettings;
        export type dxPolarChartCommonAxisSettingsConstantLineStyle = DevExpress.viz.dxPolarChartCommonAxisSettingsConstantLineStyle;
        export type dxPolarChartCommonAxisSettingsConstantLineStyleLabel = DevExpress.viz.dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
        export type dxPolarChartCommonAxisSettingsLabel = DevExpress.viz.dxPolarChartCommonAxisSettingsLabel;
        export type dxPolarChartCommonAxisSettingsStripStyle = DevExpress.viz.dxPolarChartCommonAxisSettingsStripStyle;
        export type dxPolarChartCommonAxisSettingsStripStyleLabel = DevExpress.viz.dxPolarChartCommonAxisSettingsStripStyleLabel;
        export type dxPolarChartCommonAxisSettingsTick = DevExpress.viz.dxPolarChartCommonAxisSettingsTick;
        export type dxPolarChartCommonSeriesSettings = DevExpress.viz.dxPolarChartCommonSeriesSettings;
        export type dxPolarChartLegend = DevExpress.viz.dxPolarChartLegend;
        export type dxPolarChartSeries = DevExpress.viz.dxPolarChartSeries;
        export type dxPolarChartTooltip = DevExpress.viz.dxPolarChartTooltip;
        export type dxPolarChartValueAxis = DevExpress.viz.dxPolarChartValueAxis;
        export type dxPolarChartValueAxisConstantLines = DevExpress.viz.dxPolarChartValueAxisConstantLines;
        export type dxPolarChartValueAxisConstantLinesLabel = DevExpress.viz.dxPolarChartValueAxisConstantLinesLabel;
        export type dxPolarChartValueAxisLabel = DevExpress.viz.dxPolarChartValueAxisLabel;
        export type dxPolarChartValueAxisStrips = DevExpress.viz.dxPolarChartValueAxisStrips;
        export type dxPolarChartValueAxisStripsLabel = DevExpress.viz.dxPolarChartValueAxisStripsLabel;
        export type dxPolarChartValueAxisTick = DevExpress.viz.dxPolarChartValueAxisTick;
    }

    /** @deprecated Use DevExpress.viz instead */
    export module funnel {
        export type dxFunnelOptions = DevExpress.viz.dxFunnelOptions;
        export type dxFunnelTooltip = DevExpress.viz.dxFunnelTooltip;
    }

    /** @deprecated Use DevExpress.viz instead */
    export module gauges {
        export type dxCircularGaugeOptions = DevExpress.viz.dxCircularGaugeOptions;
        export type dxCircularGaugeRangeContainer = DevExpress.viz.dxCircularGaugeRangeContainer;
        export type dxCircularGaugeScale = DevExpress.viz.dxCircularGaugeScale;
        export type dxCircularGaugeScaleLabel = DevExpress.viz.dxCircularGaugeScaleLabel;

        export type dxLinearGaugeOptions = DevExpress.viz.dxLinearGaugeOptions;
        export type dxLinearGaugeRangeContainer = DevExpress.viz.dxLinearGaugeRangeContainer;
        export type dxLinearGaugeScale = DevExpress.viz.dxLinearGaugeScale;
        export type dxLinearGaugeScaleLabel = DevExpress.viz.dxLinearGaugeScaleLabel;

        export type dxBarGaugeOptions = DevExpress.viz.dxBarGaugeOptions;
        export type dxBarGaugeTooltip = DevExpress.viz.dxBarGaugeTooltip;
    }

    /** @deprecated Use DevExpress.viz instead */
    export module rangeSelector {
        export type dxRangeSelectorOptions = DevExpress.viz.dxRangeSelectorOptions;
    }

    /** @deprecated Use DevExpress.viz instead */
    export module sparklines {
        export type dxSparklineOptions = DevExpress.viz.dxSparklineOptions;
        export type dxBulletOptions = DevExpress.viz.dxBulletOptions;
    }

    /** @deprecated Use DevExpress.viz instead */
    export module map {
        export type dxVectorMapOptions = DevExpress.viz.dxVectorMapOptions;
        export type dxVectorMapTooltip = DevExpress.viz.dxVectorMapTooltip;
    }

    /** @deprecated Use DevExpress.viz instead */
    export module treeMap {
        export type dxTreeMapOptions = DevExpress.viz.dxTreeMapOptions;
        export type dxTreeMapTooltip = DevExpress.viz.dxTreeMapTooltip;
    }
}

declare module DevExpress.ui {
    /** @deprecated Use DevExpress.ui.dxAccordionItem */
    export type dxAccordionItemTemplate = DevExpress.ui.dxAccordionItem;

    /** @deprecated Use DevExpress.ui.dxActionSheetItem */
    export type dxActionSheetItemTemplate = DevExpress.ui.dxActionSheetItem;

    /** @deprecated Use DevExpress.ui.dxBoxItem */
    export type dxBoxItemTemplate = DevExpress.ui.dxBoxItem;

    /** @deprecated Use DevExpress.ui.dxGalleryItem */
    export type dxGalleryItemTemplate = DevExpress.ui.dxGalleryItem;

    /** @deprecated Use DevExpress.ui.dxMultiViewItem */
    export type dxMultiViewItemTemplate = DevExpress.ui.dxMultiViewItem;

    /** @deprecated Use DevExpress.ui.dxNavBarItem */
    export type dxNavBarItemTemplate = DevExpress.ui.dxNavBarItem;

    /** @deprecated Use DevExpress.ui.dxResponsiveBoxItem */
    export type dxResponsiveBoxItemTemplate = DevExpress.ui.dxResponsiveBoxItem;

    /** @deprecated Use DevExpress.ui.dxSchedulerAppointment */
    export type dxSchedulerAppointmentTemplate = DevExpress.ui.dxSchedulerAppointment;

    /** @deprecated Use DevExpress.ui.dxSlideOutItem */
    export type dxSlideOutItemTemplate = DevExpress.ui.dxSlideOutItem;

    /** @deprecated Use DevExpress.ui.dxTabsItem */
    export type dxTabsItemTemplate = DevExpress.ui.dxTabsItem;

    /** @deprecated Use DevExpress.ui.dxTabPanelItem */
    export type dxTabPanelItemTemplate = DevExpress.ui.dxTabPanelItem;

    /** @deprecated Use DevExpress.ui.dxTileViewItem */
    export type dxTileViewItemTemplate = DevExpress.ui.dxTileViewItem;

    /** @deprecated Use DevExpress.ui.dxToolbarItem */
    export type dxToolbarItemTemplate = DevExpress.ui.dxToolbarItem;

    /** @deprecated Use DevExpress.ui.CollectionWidgetItem */
    export type CollectionWidgetItemTemplate = DevExpress.ui.CollectionWidgetItem;

    /** @deprecated Use DevExpress.ui.dxContextMenuItem */
    export type dxContextMenuItemTemplate = DevExpress.ui.dxContextMenuItem;

    /** @deprecated Use DevExpress.ui.dxMenuBaseItem */
    export type dxMenuBaseItemTemplate = DevExpress.ui.dxMenuBaseItem;

    /** @deprecated Use DevExpress.ui.CollectionWidgetItem */
    export type DataExpressionMixinItemTemplate = DevExpress.ui.CollectionWidgetItem;

    /** @deprecated Use DevExpress.ui.dxListItem */
    export type dxListItemTemplate = DevExpress.ui.dxListItem;

    /** @deprecated Use DevExpress.ui.dxMenuItem */
    export type dxMenuItemTemplate = DevExpress.ui.dxMenuItem;

    /** @deprecated Use DevExpress.ui.dxTreeViewItem */
    export type dxTreeViewItemTemplate = DevExpress.ui.dxTreeViewItem;
}
