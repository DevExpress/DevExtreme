The DataGrid uses an integrated DevExtreme [Toolbar](/Demos/WidgetsGallery/Demo/Toolbar/Overview/) component to display predefined and custom commands. To add or remove toolbar items, implement the [onToolbarPreparing](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onToolbarPreparing) function. Use its parameter's **toolbarOptions** field to access the [Toolbar's configuration](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/) object. This object includes the command collection: the **toolbarOptions**.[items](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/) array.

This demo illustrates how to add the following items to the toolbar:

- **DevExtreme components**        
Specify a [component](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/#widget) that you want to add and its [options](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/#options). In this demo, we extended the toolbar's item collection with a [Button](/Demos/WidgetsGallery/Demo/Button/PredefinedTypes/) and a [SelectBox](/Demos/WidgetsGallery/Demo/SelectBox/Overview/).

- **Custom elements**       
Specify a [template](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/#template) for your custom element. In this demo, the custom element displays the total group count.

- **Predefined controls**        
The availability of predefined controls depends on whether a specific DataGrid feature is enabled. For example, this demo enables the [columnChooser](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnChooser/), and the toolbar displays the Column Chooser button. You can customize the predefined controls in the **onToolbarPreparing** function. Refer to its [description](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onToolbarPreparing) for a code example.
