The Floating Action Button (FAB) is the primary action button on a screen that is displayed in front of all screen content. The FAB can perform an action or open a stack of two to five related actions (speed dial).

This demo illustrates a FAB that opens a speed dial when there are selected grid rows or performs a custom action&mdash;adds a new row&mdash;when nothing is selected.

In DevExtreme, the FAB is implemented as a container that collects and stores [SpeedDialAction][0] components. To display a FAB that performs a custom action, add a SpeedDialAction to the page. Specify its [onClick][1] and [icon][2] properties. Setting other properties is not required.

Two to five SpeedDialActions are collected in the FAB's speed dial. The actions are sorted according to their [indexes][3]. To hide an action from the speed dial, set its [visible][4] property to **false**.

FAB parameters are configured in the [floatingActionButtonConfig][5] object. Use it to change the FAB's [position][6], [maximum number of actions][7], icons in the [open][8] and [close][9] states, and other parameters. In this demo, the drop-down menu under the grid allows you to select the [direction][10] in which the speed dial should be opened. The [repaintFloatingActionButton()][11] method is called to apply the new configuration.

[0]: /Documentation/ApiReference/UI_Components/dxSpeedDialAction/
[1]: /Documentation/ApiReference/UI_Components/dxSpeedDialAction/Configuration/#onClick
[2]: /Documentation/ApiReference/UI_Components/dxSpeedDialAction/Configuration/#icon
[3]: /Documentation/ApiReference/UI_Components/dxSpeedDialAction/Configuration/#index
[4]: /Documentation/ApiReference/UI_Components/dxSpeedDialAction/Configuration/#visible
[5]: /Documentation/ApiReference/Common/Object_Structures/globalConfig/floatingActionButtonConfig/
[6]: /Documentation/ApiReference/Common/Object_Structures/globalConfig/floatingActionButtonConfig/#position
[7]: /Documentation/ApiReference/Common/Object_Structures/globalConfig/floatingActionButtonConfig/#maxSpeedDialActionCount
[8]: /Documentation/ApiReference/Common/Object_Structures/globalConfig/floatingActionButtonConfig/#closeIcon
[9]: /Documentation/ApiReference/Common/Object_Structures/globalConfig/floatingActionButtonConfig/#icon
[10]: /Documentation/ApiReference/Common/Object_Structures/globalConfig/floatingActionButtonConfig/#direction
[11]: /Documentation/ApiReference/Common/utils/ui/#repaintFloatingActionButton
 