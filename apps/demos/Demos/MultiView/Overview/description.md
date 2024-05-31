The MultiView component contains multiple views and allows users to switch between them. In this demo, swipe left or right to navigate through the views.
<!--split-->

You can create view items in the [items](/Documentation/ApiReference/UI_Components/dxMultiView/Configuration/items/) array, or load them from a [dataSource](/Documentation/ApiReference/UI_Components/dxMultiView/Configuration/#dataSource). If you specify the [dataSource](/Documentation/ApiReference/UI_Components/dxMultiView/Configuration/#dataSource) structure as described in the [items](/Documentation/ApiReference/UI_Components/dxMultiView/Configuration/items/) API section, the [dataSource](/Documentation/ApiReference/UI_Components/dxMultiView/Configuration/#dataSource) populates the component with view items. Otherwise, you need to specify an [itemTemplate](/Documentation/ApiReference/UI_Components/dxMultiView/Configuration/#itemTemplate). This demo shows how to implement the latter scenario.

If you want users to scroll back to the first item after they swipe the last item, set the [loop](/Documentation/ApiReference/UI_Components/dxMultiView/Configuration/#loop) property to **true**. Specify the [animationEnabled](/Documentation/ApiReference/UI_Components/dxMultiView/Configuration/#animationEnabled) property to enable or disable the scroll animation.

