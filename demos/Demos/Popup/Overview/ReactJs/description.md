This example demonstrates how to show and hide the Popup component, populate it with content, specify its position and other settings.

To see step-by-step instructions on how to get started with the DevExtreme Popup component, refer to the following tutorial: [Getting Started with Popup](/Documentation/Guide/UI_Components/Popup/Getting_Started_with_Popup/).

## Show and Hide the Popup

Bind the [visible](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#visible) property to a Boolean variable (`popupVisible` in this demo). Next, implement the `showInfo(employee)` method to set this Boolean variable to `true`. This causes the Popup to appear. To close a Popup, choose one of the following options:

- **Built-in close button**  
  Enable the [showCloseButton](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#showCloseButton) property to display the Close button in a Popup's top toolbar.

- **Custom close button**  
  This demo shows how to add custom buttons to a Popup. One of these buttons uses an [onClick](/Documentation/ApiReference/UI_Components/dxButton/Configuration/#onClick) handler to set the `popupVisible` variable to `false`, causing the Popup to disappear. Refer to the next section (**Configure the Popup**) to learn how you can populate a popup with custom controls.

- **On outside click**  
  Enable the [hideOnOutsideClick](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#hideOnOutsideClick) property to allow users to hide the Popup by clicking outside the component.

## Configure the Popup

The Popup inner area is divided into three parts:

- **Top toolbar**

  - **Predefined**  
    Set [showTitle](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#showTitle) to `true` and use the [title](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#title) property to specify the caption. The Close button will appear if you do not disable the [showCloseButton](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#showCloseButton) property.

  - **Custom**  
    Add [toolbarItems](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/toolbarItems/) markup and set each item's [toolbar](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/toolbarItems/#toolbar) property to `top`. If you want to display an item in the overflow menu, as shown in this demo, set the item's [locateInMenu](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/toolbarItems/#locateInMenu) property to `always`. You can also assign `never` to this property to keep the item outside the overflow menu, or you can assign `auto` to hide the item in the menu if the Popup's width decreases.

- **Content**  
  To populate the Popup with content, add markup inside the component.

- **Bottom toolbar**  
  To enable the bottom toolbar, declare [toolbarItems](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/toolbarItems/) in the markup as shown in this demo. Set each item's [toolbar](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/toolbarItems/#toolbar) property to `bottom`. To learn more about toolbar configuration, refer to the following tutorial: [Getting Started with Toolbar](/Documentation/Guide/UI_Components/Toolbar/Getting_Started_with_Toolbar/)

## Resize and Position

To specify Popup size, use the [height](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#height) and [width](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#width) properties.

In this demo, each Popup's location is relative to the image. The code specifies the **my**, **at**, and **of** properties of the [position](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#position) object. The configuration in the demo reads as follows: "place **my** `center` side **at** the `bottom` side **of** the `#image${employee.ID}` element."

Use the [container](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#container) property to select the container in which you want to render the Popup. If you set the [container](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#container) property to an element on the page, the [shading](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#shading) applies to this element.

Turn on the [dragEnabled](/Documentation/ApiReference/UI_Components/dxPopup/Configuration/#dragEnabled) option to allow users to move a Popup around the page.
