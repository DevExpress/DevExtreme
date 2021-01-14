The **DevExpress.viz.exportWidgets(widgetInstances, options)** method allows you to export several charts to a single image or document. The **widgetInstances** parameter accepts an array with the following format:

    [
        [ widgetInstance0_1, widgetInstance0_2, ..., widgetInstance0_N ],
        [ widgetInstance1_1, widgetInstance1_2, ..., widgetInstance1_M ],
        ...
        [ widgetInstanceP_1, widgetInstanceP_2, ..., widgetInstanceP_R ]
    ]

Each nested array contains UI component instances that should be in the same row in the exported document. In this demo, `chartInstance` and `pieChartInstance` occupy the only row in the document.

The **options** parameter accepts an object whose fields allow you to configure export properties. In this demo, we specify the `fileName` and `format`. Refer to the [method description](/Documentation/ApiReference/Common/utils/viz/Methods/#exportWidgetswidgetInstances_options) for information on other available fields.