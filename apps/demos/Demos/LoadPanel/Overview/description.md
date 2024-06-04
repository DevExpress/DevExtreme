The LoadPanel is an overlay component used to notify users that a process is in progress. In this demo, you can see how to initialize and configure the component.

## Show and Hide the Indicator and Pane 

LoadPanel elements (a message and an animated load indicator) are displayed on a pane. If you want to hide it, set the [showPane](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#showPane) property to **false**. You can also disable the [showIndicator](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#showIndicator) property to hide the animated load indicator. In this case, the LoadPanel displays only the [message](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#message). In this demo, you can use the "With indicator" and "With pane" checkboxes to change the visibility of the load indicator and pane.

## Configure the Background Shade

When LoadPanel is displayed, it shades the background. Use the [shadingColor](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#shadingColor) property to specify the color of the shade. You can also specify the element that should be shaded. For this, assign the element's CSS selector to the [container](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#container) property. If you do not want to shade the background, disable the [shading](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#shading) property. In this demo, you can uncheck the "With overlay" checkbox to do it.

## Show and Hide LoadPanel

To change the LoadPanel visibility in code, use the [visible](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#visible) property. Alternatively, you can call the [show()](/Documentation/ApiReference/UI_Components/dxLoadPanel/Methods/#show) and [hide()](/Documentation/ApiReference/UI_Components/dxLoadPanel/Methods/#hide) or [toggle(showing)](/Documentation/ApiReference/UI_Components/dxLoadPanel/Methods/#toggleshowing) methods.

Users can hide LoadPanel when they click outside it if you enable the [hideOnOutsideClick](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#hideOnOutsideClick) property. Use the "Hide on outside click" checkbox to control this functionality in this demo.

LoadPanel also allows you to handle the show and hide events. Use the [onShowing](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#onShowing) and [onHiding](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#onHiding) functions to handle the events before they occur and possibily cancel them. Use the [onShown](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#onShown) and [onHidden](/Documentation/ApiReference/UI_Components/dxLoadPanel/Configuration/#onHidden) functions to perform required actions after the events are raised.
