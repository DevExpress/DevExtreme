To change field visibility at runtime, set the **columnChooser**.[enabled](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columnChooser/#enabled) property to `true`. To ensure specific fields remain visible, set the **columns[]**.[allowHiding](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#allowHiding) property to `false`. In this demo, **allowHiding** is disabled for "Full Name" and "Phone" columns.

Set **columnChooser**.[mode](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columnChooser/#mode) to specify how users toggle column visibility:

* *"dragAndDrop"*    
Users drag & drop fields between the header panel and column chooser.

* *"select"*    
Users toggle check boxes for field names.
<!--split-->

To display the CardView Column Chooser, click the column chooser icon in the CardView toolbar. You can specify the column chooser's position with the **columnChooser**.[position](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columnChooser/#position) property.

If the column chooser contains multiple hidden columns, assign `true` to the **search**.[enabled](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columnChooser/search/#enabled) property to enable DevExtreme’s field search UI.

In this demo, use the checkboxes above the CardView to toggle search and selection features.

To hide a field programmatically, change the **columns[]**.[visible](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#visible) property to `false`.
