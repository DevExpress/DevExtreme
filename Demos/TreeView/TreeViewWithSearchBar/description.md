To add a search bar to the TreeView and customize the search functionality, do the following:

- Set the [searchEnabled](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#searchEnabled) property to **true**.

- Use the [searchMode](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#searchMode) property to specify whether items should contain (default), start with, or match the search string. In this example, you can switch between search modes in the drop-down menu.

- Configure the [searchExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#searchExpr) property to specify custom search fields. The default search field is [text](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#text). 

The TreeView uses the TextBox component as a search bar. To customize it, specify [TextBox properties](/Documentation/ApiReference/UI_Components/dxTextBox/Configuration/) in the [searchEditorOptions](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#searchEditorOptions) object.

We do not recommend that you enable search if the TreeView uses [virtual mode](https://js.devexpress.com/Demos/WidgetsGallery/Demo/TreeView/VirtualMode/) or [custom logic](https://js.devexpress.com/Demos/WidgetsGallery/Demo/TreeView/LoadDataOnDemand/) to load data on demand. In these cases, the TreeView may not have the full dataset, and the search results include only loaded nodes.
