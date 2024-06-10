DevExtreme JavaScript Gantt component allows you to export the contents of your Gantt to PDF.
<!--split-->

This demo allows you to apply the following built-in export and task filter options:

**Export Options**

Document format  - Specifies document size.

Landscape orientation – Renders the PDF horizontally. 

Export mode - Specifies Gantt regions to include within the exported document (chart area, tree list area, or the entire component).

**Task Filter Options**

Date range  - Restricts data output against a specified date range.

Start task (index) – Restricts data output against the start task's index within an index range. 

End task (index) – Restricts data output against the end task's index within an index range. 

Start date (task)- Restricts data output by start date. 

End date (task) – Restricts data output by end date. 

Click the “Export” toolbar item to call the [exportGantt(options)](/Documentation/ApiReference/Common/Utils/pdfExporter/#exportGanttoptions) method (exports Gantt data with specified export options).

To enable PDF export operations, you must reference or import the following:
- <a href="https://github.com/parallax/jsPDF" target="_blank">jsPDF</a>        
A library that creates and manages PDF documents.

- <a href="https://github.com/simonbengtsson/jsPDF-AutoTable" target="_blank">jsPDF-AutoTable</a>        
A plugin that creates and manages tables in PDF documents.