To change field visibility at runtime, set the **columnChooser**.[enabled](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columnChooser/#enabled) property to `true`. To ensure specific fields remain visible, set the **columns[]**.[allowHiding](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#allowHiding) property to `false`.
<!--split-->

To display the column chooser, click the toolbar button above the CardView. You can specify the column chooser's position with the **columnChooser**.[position](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columnChooser/#position) property. Changing how users display or hide columns depends on **columnChooser**.[mode](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columnChooser/#mode):

* *"dragAndDrop"*    
Users drag and drop fields between the header panel and column chooser.

* *"select"*   
Users toggle check boxes for field names.

If the column chooser contains multiple hidden columns, assign `true` to the **search**.[enabled](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columnChooser/search/#enabled) property to enable the DevExtreme field search UI.

In this demo, use the checkboxes above the CardView to toggle search and selection features.

To hide a field programmatically, change  **columns[]**.[visible](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#visible) property to `false`.
