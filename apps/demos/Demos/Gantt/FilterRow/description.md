The DevExtreme JavaScript Gantt component allows users to filter columns by filter row values. To display the filter row, set the **filterRow**.[visible](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/filterRow/#visible) property to **true**.
<!--split-->

To apply filter criteria to a column, enter or select a value for the filter row cell or specify the [filterValue](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#filterValue) property (for the appropriate column) in code.

Underlying [dataType](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#dataType) defines editor types used within filter row cells:

<table class="dx-table">
    <tr>
        <th>dataType</th>
        <th>Editor</th>
    </tr>
    <tr>
        <td><i>"string"</i>, <i>"number"</i>, <i>"object"</i></td>
        <td>Text box</td>
    </tr>
    <tr>
        <td><i>"boolean"</i></td>
        <td>Drop-down list</td>
    </tr> 
    <tr>
        <td><i>"date"</i></td>
        <td>Date picker</td>
    </tr> 
    <tr>
        <td><i>"datetime"</i></td>
        <td>Date and time picker</td>
    </tr> 
</table>

The **Gantt** supports a predefined set of [filter operations](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#filterOperations) for each data type. Click a cell’s magnifier icon to select the desired filter operation ([selectedFilterOperation](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#selectedFilterOperation)).

To disable the filter row cell for a specific column, set the column’s [allowFiltering](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#allowFiltering) property to **false**.