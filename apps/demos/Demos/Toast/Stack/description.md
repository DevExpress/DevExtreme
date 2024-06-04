The DevExtreme Toast components can stack multiple notifications. Use the [notify(message, stack)](/Documentation/ApiReference/Common/Utils/ui/#notifymessage_stack) or [notify(options, stack)](/Documentation/ApiReference/Common/Utils/ui/#notifyoptions_stack) method to display stacked messages.

These methods use a **stack** object that has the following structure: *{position, direction}*.

## Specify Position

You can set the `position` field to a string (select *'predefined'* in the radio group) or an object (select *'coordinates'* in the radio group). Note that if you use coordinates for the `position` field, you need to specify one vertical and one horizontal coordinate only. For example, if you specify *'top'*, the demo disables the *'bottom'* field, and vice versa.

## Specify Direction

The `direction` field specifies two options: which way the notification stack grows and whether new notifications appear at the end or at the beginning of the line. For this reason, the field's pull-down menu choices show pairs of values such as *'up-push'* and *'up-stack'*.

- *'up-push'*   
New toasts push the previous toasts upwards.

- *'up-stack'*    
Toasts stack on top of each other. 

## Hide Toasts

To hide all toast messages, use the [hideToasts](/Documentation/ApiReference/Common/Utils/ui/Methods/#hideToasts) method.