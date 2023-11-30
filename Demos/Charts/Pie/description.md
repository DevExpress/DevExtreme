This example demonstrates the PieChart component that visualizes data as a circle divided into points (slices) to illustrate data proportions.

To get started with the DevExtreme PieChart component, refer to the following tutorial for step-by-step instructions: [Getting Started with PieChart](/Documentation/Guide/UI_Components/PieChart/Getting_Started_with_PieChart/).

## Bind PieChart to Data

This demo uses an array as a PieChart data source. To bind the PieChart to data, pass the array to the PieChart's [dataSource](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/#dataSource) property.

To display data, specify the [series](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/) nested options - [argumentField](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/#argumentField) and [valueField](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/#valueField) - with the corresponding object fields (arguments and values) in the array.

## Specify Title and Labels

Use the [title](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/title/) property to specify and configure the PieChart's title.

You can accompany each series point with a label that displays the point's value or custom data. To make point labels visible, assign `true` to the [series](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/).[label](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/label/).[visible](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/label/#visible) property. With this configuration, the component displays point labels detached from their respective series points. To make the connection between labels and points visible, set the [label](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/label/).[connector](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/label/connector/).[visible](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/label/connector/#visible) property to `true`.

## Process Point and Legend Clicks 

To process point and legend clicks, use the [onPointClick](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/#onPointClick) and [onLegendClick](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/#onLegendClick) functions. This demo uses these event handlers to toggle point visibility.

## Enable PieChart Export 

Assign `true` to the [export](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/export/).[enabled](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/export/#enabled) property to enable PieChart export.

[note]

Use our DevExpress BI Dashboard to embed interactive business intelligence into your next web app.

The Web Dashboard is a data analysis UI component that you can embed into your ASP.NET Core or Angular, React, and Vue applications with .NET backend. Dashboards allow you to display multiple inter-connected data analysis elements such as grids, charts, maps, gauges, and others: all within an automatically-arranged layout.

The set of components allows you to deploy an all-in-one solution and switch between Viewer and Designer modes directly on the web client (includes adaptive layouts for tablet & mobile).

The Web Dashboard is available as a part of a Universal subscription.

[Get Started with DevExpress BI Dashboard](https://docs.devexpress.com/Dashboard/115955/web-dashboard) | [Explore Demos](https://demos.devexpress.com/Dashboard/)

[/note]