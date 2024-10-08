# Headers

## A11y

Headers element cannot have focus on itself.

When element gets keyDown event with `tab` key, it moves focus to next (or prev, if `shift` is pressed) header item and stops propagation. If not, it does nothing
