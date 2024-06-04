The Accordion component contains several panels displayed one under another. Users can expand or collapse these panels, which makes this component useful to present information in a limited amount of space.

## Bind Accordion to Data

You can display Accordion items from the [items](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/items/) array or a [dataSource](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/#dataSource). If you use the **items** array, specify the [title](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/items/#title) and [text](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/items/#text) properties.

## Configure Item Selection and Collapsibility

Enable the [multiple](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/#multiple) property to allow users to select multiple panels. Use the [selectedItems](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/#selectedItems) array to store selected items. Toggle the "Multiple enabled" checkbox in the Options demo section to see how it affects the selection.

If you want to allow users to close panels on click, set the [collapsible](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/#collapsible) property to **true**. Check the "Collapsible enabled" checkbox in the Options demo section to enable this feature.

## Configure Animation

The [animationDuration](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/#animationDuration) property allows you to specify the animation duration when users expand/collapse a panel. Use the "Animation duration" slider in the Options demo section to see how it affects the animation.

## Customize Item Appearance

Use the [itemTemplate](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/#itemTemplate) and [itemTitleTemplate](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/#itemTitleTemplate) properties to customize the panel appearance. If you use the **items** array, you can also specify the [icon](/Documentation/ApiReference/UI_Components/dxAccordion/Configuration/items/#icon) property.