To display total summaries, populate the [summary](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/).[totalItems](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/) array with configuration objects. Each object should specify a [column](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/#column) that supplies data for summary calculation and a [summaryType](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/#summaryType)&mdash;an aggregate function that should be applied to this data.

This demo illustrates the following total summaries:

- **Total number of orders**             
This summary uses the *"count"* **summaryType**.

- **Date of the first order**              
This summary uses the *"min"* **summaryType** and the [customizeText](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/#customizeText) function that formats the displayed summary value.
   
- **Total revenue**        
This summary uses the *"sum"* **summaryType** and the [valueFormat](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/#valueFormat) property to format the summary value as currency.
