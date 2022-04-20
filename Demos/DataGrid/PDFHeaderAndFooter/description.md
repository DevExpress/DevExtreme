The DataGrid allows you to customize a header and a footer in the exported PDF file. Follow the steps below to configure a header/footer:

1. Call the [exportDataGrid(options)](/Documentation/ApiReference/Common/Utils/pdfExporter/#exportDataGridoptions) method.

2. Use the following API to specify header/footer layout settings:    

    - For a header   
    Use the [topLeft](/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/topLeft/topLeft.md) object to specify a start position for DataGrid export. This position should be below the header.
    
    - For a footer    
    Use the [customDrawCell](/Documentation/ApiReference/Common/Object_Structures/ExportDataGridProps/#customDrawCell) function to calculate the coordinates of the last right cell of the DataGrid.

3. Execute a promise after the **exportDataGrid(options)** method. In this promise, specify position and appearance of the header/footer.