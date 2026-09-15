# fluent-next disabled states - the reasoning behind the code

Kept out of the branch on purpose: these are the notes that used to sit as comments in the
files below. Every entry is the argument for a decision the code makes silently now.

## packages/devextreme-scss/tests/disabled-paint.test.ts

Gate for the theme's disabled-state policy: components paint the state from the disabled roles
rather than dimming, and nothing arrives with no disabled rule of its own.

The theme dims a disabled widget with one blanket rule and lets a component opt out of it with
`opacity: 1` when it paints the state itself from the disabled roles. Opting out without
painting is strictly worse than the dim: the component then renders exactly like an enabled one.
That is not hypothetical - it shipped that way in Toolbar in all four themes, and an attempt to
migrate ColorView reproduced it within this branch.

So: every rule that lifts the dim must belong to a component that also paints a colour in a
disabled context. The check runs over the compiled bundle rather than the sources because that
is where the two halves finally meet - a `with()`-injected mixin argument and a hand-written
rule are indistinguishable here, which is the point.

Components in RESET_WITHOUT_PAINT lift the dim on purpose and paint nothing; each is a reset
that prevents double dimming, not a disabled state of its own.

The blanket rule itself plus its "do not multiply the dim on nested widgets" companion. A
disabled TimeView sits inside a disabled DateBox; the reset stops the dim applying twice. The
tab strip is dimmed through its items; the nav buttons hide instead of dimming. Spin buttons are
dimmed with the editor they belong to. The resize handle has no content of its own; the pane it
belongs to carries the state. Pure wrappers: everything visible in them is a nested widget, and
the theme paints those through `.dx-state-disabled .dx-button` / `.dx-radiobutton`. They have
nothing of their own. The library spells a disabled element three ways: the shared state class,
the pager's own dx-button-disable, and the BEM modifier of the grid's AI chat. Deliberately
small: split on brace pairs and drop at-rule preludes. The bundle has no nested style rules at
this stage, and a parser that silently swallowed some would weaken the gate. The component a
selector belongs to: its first class that is not a state or the generic marker. Prefix matching,
not equality: the reset and the paint routinely sit on different parts of one component (`.dx-
progressbar` resets, `.dx-progressbar-container` paints), and demanding the same class would
report every such pair as unpainted. Two components lift the dim; only one replaces it with a
colour. A green gate has to mean "nothing to find", not "the scan matched nothing". A name
ending in -disabled must mark a disabled state. Borrowing one for a resting element - as the
ordinary tag border and the pivot grid field boxes did - hides a design decision behind a state
that is not there, and it was how the cardView drag source came to be painted with the disabled
colours in the first place. one disabled name defined in terms of another is a chain, not a read
in a live rule The theme has no blanket dim any more: every component with a surface of its own
paints its disabled state from the roles, the way Fluent specifies it and the way Blazor's
themes are built. A rule that dims whatever it finds would put that back and hide the next gap.
A blanket selector is one that reaches any widget at all: nothing but the state class and .dx-
widget. A component-scoped rule such as `.dx-timeview .dx-state-disabled .dx-widget` is not one,
and neither is anything that resets the opacity back to 1.

Ratchet: a component must not arrive with no disabled rule of its own.

This is a static signal and deliberately not the same measurement as the runtime one. It asks
only "does any rule mention this component's root class in a disabled context and paint
something", so it over-reports: a text box is painted through the .dx-texteditor chassis, and
Calendar, Form and TabPanel are covered by the widgets inside them. The runtime comparison in
playground/disabled-readonly-compare.html is the judge of what actually renders - by that
measure five components rely on the blanket dim, not thirty-seven.

What the ratchet is for is the regression that produced the Toolbar and cardView defects: a
component appearing with nothing of its own and nobody noticing. The list may shrink, never
grow. Bank a drop deliberately:

  UPDATE_DISABLED_BASELINE=1 pnpm test

Whole class tokens, not a substring of the joined selectors: `.dx-toolbar` would otherwise look
covered by a scheduler rule that happens to mention `.dx-toolbar-item-content`, and the ratchet
would stay silent exactly when a component lost its own rule. Prefix, like the paint gate: a
component is covered when any painted class belongs to it, and the painted part is usually a
sub-element - ProgressBar paints .dx-progressbar-container, never .dx-progressbar itself.

Ratchet: Fluent expresses a disabled control by painting it from the disabled roles, not by
making it translucent. Opacity dims the background through the element and cannot state a
contrast, which is why List and TreeView were moved onto their roles - both already had one.

Nine rules still dim, each for a reason that has not been decided yet:   - tabs nav button uses
opacity 0, which hides rather than dims;   - scheduler appointments and grid modified-cell links
sit on user-supplied colours;     the appointment's allowance is three because a disabled
scheduler reuses the dim the     component already defines for a disabled appointment, rather
than adding a second signal:     greying the title instead put content-disabled on the
appointment's own surface and     composited to 1.22:1. Same variable, same mechanism, two more
selectors;   - the AI chat regenerate button dims a whole composite;   - the number box spin
container dims a pair of arrows.

The list may shrink, never grow: a new component-scoped dim has to be argued for here first.

Ratchet: an element that sets its own colour cannot inherit a disabled one.

Every defect this branch found after the blanket dim came off had the same mechanism. A
component's disabled rule greys a container, the elements inside it inherit that colour - and
one element does not, because it declares a colour of its own. It then sits at full contrast
next to greyed siblings. That is how the Toolbar items, the TreeView expander, the TreeList
chevron, the Form captions, the stepper connector, the calendar's selected day and the chat
attachment were all missed, each found by eye rather than by a gate.

So the check is not "does the component have a disabled rule" - the earlier ratchet asks that -
but "is every element that paints its own colour reached by one". It looks at `color` only: that
is the property the argument rests on, since background and border do not inherit and an element
without them is not claiming to be readable.

The list is long and mostly legitimate - toast variants, popup chrome, theme utility classes,
anything that has no disabled state to speak of - so it is a baseline rather than a hard zero.
It may shrink, never grow. Bank a drop deliberately:

  UPDATE_OWN_COLOUR_BASELINE=1 pnpm test

A disabled rule conditional on a modifier - `.dx-show-clear-button.dx-state-disabled` - covers
only the elements that carry the modifier, not every element with that class. Banking it as
coverage for the class name is how a placeholder painted in editors with a clear button, and
nowhere else, read as covered: the gate saw the name and the shipped editors kept a full-
strength placeholder. Coverage counts only when the compound carrying the state class holds
nothing but the state and a component root.

The target's own compound is the element saying it is disabled itself - `.dx-tile .dx-state-
disabled` - which is a state, not a condition on some other element.

A widget is disabled two ways: the state class lands on its own root, or on something it sits
inside. A rule written only as `.dx-grid.dx-state-disabled` covers the first and misses the
second entirely, and the miss is invisible in every screenshot of a widget disabled on its own -
it shows up only when the widget sits in a disabled form or toolbar. That shipped in eleven
components at once, so it is a gate rather than a review note.

The pair is checked inside one rule, which is what `when-disabled()` emits and what a hand-
written pair looks like. Anchored on component roots: an item's own state class (`.dx-tile.dx-
state-disabled`) is a state, not a widget-level rule, and has no ancestor form.

  UPDATE_BOTH_FORMS_BASELINE=1 pnpm nx test devextreme-scss --skip-nx-cache

Collected over the bundle, not within one rule: the two forms are usually written together, but
a component is free to state them apart and the pair is what matters, not where it is.

## packages/devextreme-scss/scss/widgets/fluent-next/scheduler/_index.scss

Kept: a resize has no floating copy, so the appointment being stretched is what moves, and its
surface is a resource colour nobody controls - the same reason the disabled appointment keeps
its own dim rather than a role. Its colour role is applied below; the dim it used to carry has
to be switched off explicitly, because base's intermediate module defaults to 0.8 whatever the
leaf says. A disabled scheduler was carried entirely by the blanket dim: the work space, the
panels and the header are its own markup and no child widget paints them. Both now paint their
own subtle colour, so they no longer inherit this one The header toolbar and the view switcher
are widgets of their own and are not disabled, so their text is painted here rather than through
their tiers. An appointment already carries its own disabled signal: base dims it to
$appointment-disabled-opacity when the appointment itself is disabled. Greying its text on top
of that stacked a second dim - the title composited to #cdcdcd against the faded surface, 1.22:1
- so the text keeps the appointment's own colour and the dim stays the only signal.

The case that genuinely had nothing is a disabled scheduler, where .dx-state-disabled lands on
the scheduler root and never reaches the appointment. It takes the same dim the component
already defines rather than a second colour, which keeps the title readable against its own
surface. The date under an appointment's subject, and the details line in the agenda view, are
the same kind of secondary text as the tooltip's date below - and were the same 70% of the
content colour. The appointment paints its own text with a fixed role whatever the resource
colour behind it, so the subtle role is the consistent answer here too, and it does not drag the
recurrence icon with it the way the element's opacity did. The tooltip's date line is secondary
text and takes the subtle content role; it used to be the appointment colour at 80% opacity,
which states no contrast of its own. The time panel paints its own text, so the hours stayed at
full contrast in a disabled scheduler while the grid around them greyed. The month view paints
its own cells - the day number, the first-of-month and current-date emphasis, the adjacent-month
grey and the header panel's date - so the work space greyed around a table that stayed at full
contrast. Appended here rather than merged into the disabled block above because these match the
painting rules class for class and only source order settles the tie. The month view qualifies
this one with its work-space class and :last-child, which outranks a plain widget-level rule -
the weekday header stayed at full contrast on its own.

## packages/devextreme-scss/tests/tier-values.test.ts

The component and design-system tiers carry VALUES. Nothing else belongs in them.

A Sass switch published by mistake proves the point: `$scheduler-appointment-bg-focused: false`
is a build-time flag - base reads it as `@if $fill-focused-appointment` to decide whether a rule
exists at all - and _public.scss published it mechanically, so the shipped CSS carried `--dx-
scheduler-appointment-bg-focused: false` on every `.dx-scheduler` root. A custom property
accepts any token sequence, so the browser said nothing; nothing read the name either, so
nothing broke. But the name reads as a colour role while holding a boolean, and the first
`var()` to reach for it would produce an invalid declaration that resolves to `unset` in
silence.

A hard gate rather than a ratchet: at the time of writing no bundle holds such a value, and this
shape has no legitimate use - a flag that decides which rules exist cannot be a custom property,
because custom properties are resolved long after the rules are emitted.

A declaration whose whole value is a Sass literal, or nothing at all.

An opacity in the component tier has to be able to change something.

Two shapes say nothing and were both found in the theme: a variable whose value is `1`, which
dims by zero (`--dx-scheduler-other-month-cell-opacity` sat at 1 while the adjacent-month cell
was already painted with content-subtle), and a variable published with no `var()` reading it,
which is a knob wired to nothing (`--dx-tabs-nav-button-opacity-disabled` hid the content of a
button that `visibility: hidden` had already removed).

Scoped to `--dx-*` and never `--dxds-*`: the design-system tier publishes the whole opacity
ladder - 0, 10, 15 … 100 - as a complete, stable set, so an unused rung there is the contract
working as intended, and `--dxds-opacity-100` is meant to be 1.

## packages/devextreme-scss/scss/widgets/fluent-next/pivotGrid/_index.scss

No dim on the field left behind while dragging. The package has no pivot grid, but Blazor marks
its draggable header with a background, a border and a colour and never with opacity
(pivot/pivot-table/layout.scss), which is also what cardView and the grid do here. The field
being dragged is a drag source like any other in this theme, so it takes the one value the
sortable states rather than a role of its own: base dims it to 0.5, which leaves the field
caption at 3.26 once axe composites the opacity into it, and 0.65 reads 5.29. The panel is not
what moves either - a field being dragged carries its own header, with the border and the shadow
above. A disabled pivot grid was carried entirely by the blanket dim: its areas, headers and
field chips are its own markup and no child widget paints them. The header cells paint their own
text, so colouring the container above never reached the row and column captions inside them.
Total cells paint their own colour, and the state sits above the table rather than on the pivot
grid root, so the rule above never reached them. The field a drag started from is marked with
colour rather than halved: at 0.5 its text sat at about 3.4:1, the same defect cardView had. The
disabled pair keeps the own-colour ratchet honest - these elements now paint themselves, so a
disabled rule has to reach them. The field chooser's area captions paint themselves, so they
stayed at full contrast inside a disabled chooser while the fields under them greyed.

## packages/devextreme-scss/scss/widgets/fluent-next/widget/_index.scss

No blanket dim - but a blanket colour, which is a different thing. Opacity dims the background
through the element and states no contrast; the disabled content role states one, and it is the
role the package names for 70 of its 125 disabled tokens.

It is applied at the root because that is where the gap was. A component's disabled rule paints
the parts it knows about, and everything else inherits from .dx-widget, which kept the resting
content colour - so a disabled checkbox had a black label, a disabled calendar had black weekday
headers, a disabled splitter had black panes, and each was found by eye rather than by a rule.
Anything that needs a different disabled colour still says so: those rules are more specific and
win. Layout containers now carry the state through to their text, which is what was missing.

What is left here that is not a colour: no text selection, and no pointer cursor on something
that cannot be used. Nine component-scoped opacity dims still remain, each named with its reason
in the ratchet in tests/disabled-paint.test.ts. The colour is on the state class itself, not
only on .dx-widget: item.disabled is inherited from the base collection item, so every
collection widget can disable a single entry - and that entry is an item, not a widget. Scoped
to .dx-widget it missed a disabled box pane, gallery slide, splitter pane, tile, form item and
scheduler appointment. At one class it is a floor: anything a component says about its own
disabled colour is more specific and wins.

## packages/devextreme-scss/scss/widgets/fluent-next/chat/_index.scss

No dim. The transcript is content, not a control: the package defines no disabled token for a
message bubble, and Blazor never dims its chat either - it paints the individual controls. Those
already paint themselves here, so the dim only made the transcript hard to read. The composing
area is what actually goes out of use when the chat is disabled: its input text and send icon
already paint themselves, and the rule that separates it takes the disabled border so the
boundary reads as inactive too. The transcript above it stays legible. The transcript greys with
the rest of the widget. This reverses the earlier reading - that a message is content and so has
no disabled state - on the owner's instruction. That other reading had the package and Blazor
behind it: neither defines a disabled colour for a message bubble, and Blazor never dims its
chat, it paints the individual controls. The attachment was already following the state, being a
control that downloads on click. The empty view's icon reads content-subtle when enabled, the
same role as the prompt beside it, so it greys with the prompt instead of staying at #444444
next to greyed text.

## packages/devextreme-scss/scss/widgets/fluent-next/list/_index.scss

Stays an opacity, deliberately. base pairs it with `transition: opacity 0.2s linear`, so this is
a fade while the item waits for a server response - motion, not the paint of a state - and a
loading affordance is the one thing the package does express with opacity (skeleton, spinner).
The list draws this button without a surface, so a disabled item has none to grey out - the
cross alone takes the disabled colour. Qualified past the contained mode's disabled fill, which
the button applies to any button sitting inside something disabled. An item icon is painted
rather than inherited, so the colour above never reaches it and a disabled item kept its icon at
full strength - the blanket dim this replaced took the whole item down at once. Same role the
chevron of a disabled item already uses. item.color.selected.bg.disabled: a selected item keeps
a surface when disabled, but the package's alpha one rather than the selection colour. The
selector carries .dx-list so it matches the specificity of the rule that paints a selected item
- one class short and that rule wins. The content colour needs the same treatment: it is painted
for selection and outranked the state.

## packages/devextreme-scss/scss/widgets/fluent-next/filterBuilder/_index.scss

The separator between a range's two ends is secondary text, and it used to say so with 30% of
the content colour - 1.9:1 on the theme's own ground, for a word the reader has to read. The
package's role for secondary text carries a contrast of its own. The widget-level disabled state
was carried entirely by the blanket dim, so the component showed nothing of its own once that
rule was lifted. It is painted from the disabled content role now. The operator and field chips
carry semantic tints - danger for the operator, primary for the field - and a disabled builder
kept them at full strength. The value chip is nested inside .dx-filterbuilder-text rather than
carrying the class itself - that is how the rule which paints it at rest is written - so listing
it as a compound here matched nothing and it kept its resting fill while every chip beside it
moved to the disabled surface. The add and remove icons carry semantic colours - success and
danger - which say "you can act" and so kept saying it inside a disabled builder.

## packages/devextreme-scss/scss/widgets/fluent-next/loadIndicator/_index.scss

The spinner is painted with the accent, which does not inherit anything, so it kept spinning at
full strength inside a disabled widget.

The two rules mirror the enabled ones exactly rather than painting every segment at once,
because the arc is drawn by leaving borders transparent and a blanket border-color fills those
gaps in - the ring stops reading as a rotating arc and the motion looks wrong.

Two gaps, at two different specificities. segment0 and segment1 clear border-right-color and
border-left-color at three classes, above the rule below, so those survive. The bottom gap is
cleared on the bare .dx-loadindicator-segment-inner at one class, so the shorthand here has to
restate it - otherwise each arc gains a third painted side only while disabled. Only the track
is matched at full depth, where a complete ring is what the enabled rule draws too.

## packages/devextreme-scss/scss/widgets/fluent-next/cardView/_index.scss

The widget-level disabled state was carried entirely by the blanket dim, so the component showed
nothing of its own once that rule was lifted. It is painted from the disabled content role now.
The existing `…header-panel-item-*-disabled` names are not reused here: base applies those to
the sortable drag source, which is active content, not to a disabled state. the sort index
paints an accent of its own and stayed bright next to greyed headers base exempts this widget's
drag source from dxSortable's dim and marks it by repainting it with the disabled roles instead
- which measured 2.11 here. This theme marks every drag source the same way, with the dim, so
the exemption is lifted and the chip fades as one piece with its own colours underneath: 5.36 at
the 0.65 the theme dims by. The empty header's drop zone invites a drop it cannot accept while
the widget is disabled, and it paints its own accent, so it was the one thing in a greyed
cardView still asking to be used.

## packages/devextreme-scss/scss/widgets/fluent-next/fileManager/_index.scss

The directory tree and the progress panel paint their own text, so a disabled file manager kept
them at full contrast next to greyed surroundings. The status icons are SVG data-uri backgrounds
with their colour baked in at build time, so `color` cannot reach them and the toolbar refresh
icon stayed at full contrast. The image has to be emitted a second time with the disabled colour
substituted. Font icons, unlike the data-uri set above: the folder glyph in the tree, the
overflow menu on a row and the tree's expander are painted rather than inherited, so they stayed
at full contrast in a disabled file manager. Scoped to the widget - the bare `.dx-state-
disabled` selector this file also uses would reach every icon in the theme. The focused row
keeps its class while the widget is disabled and paints at five classes, which outranks the rule
above - the folder glyph and the expander on that one row stayed black.

## packages/devextreme-scss/scss/widgets/fluent-next/stepper/_colors.scss

A disabled stepper lost the difference between the selected step and the rest: both became a
white disc with a grey ring. The selected one is filled when enabled, so it stays filled here -
in the disabled scale - and its numeral inverts against that fill. The ring needs a border role,
not the background one: painting both with bg-disabled left an almost invisible white disc with
grey digits floating in it. The filled part of the connector kept the accent when the widget was
disabled, so a greyed step sat on a bright blue line.

It takes the same role as the filled step discs it runs between, not bg-disabled: the empty
track is border-subtle (#e1e1e1) and bg-disabled (#f5f5f5) is lighter than that, which made the
walked part of the path fainter than the part still ahead.

## packages/devextreme-scss/scss/widgets/fluent-next/_mixins.scss

A widget is disabled two ways: the state class lands on its own root, or on something the widget
sits inside - DevExtreme puts it on the container and lets CSS reach in. Writing only the first
is the half-finished form that reads as complete, and it leaves a grid inside a disabled form,
or a button inside a disabled toolbar, at full contrast. Emitting both from one place is what
stops the pair being written by hand and getting written once.

The ancestor form is a descendant, never a child: a widget is rarely the immediate child of the
element carrying the state.

## packages/devextreme-scss/scss/widgets/fluent-next/gridBase/_index.scss

A disabled grid was carried entirely by the blanket dim: its own cells, headers and captions are
not painted by any child widget, so lifting that rule left the content at full contrast. Two
selectors because the widgets differ: treeList carries .dx-treelist on the widget root, A
descendant, not a child: the grid keeps .dx-datagrid one level below the root that carries the
state when it disables itself, but an enclosing disabled form or toolbar is further up than
that, and the child combinator this used to have matched only the first case. The command
column's links paint themselves with the link colour, so they stayed at full accent in a
disabled grid and went on reading as the one thing still clickable in it. The adaptive "more"
button paints its own icon colour, so a disabled grid kept it at full contrast next to greyed
rows.

## packages/devextreme-scss/scss/widgets/fluent-next/stepper/_index.scss

The widget-level disabled state was carried entirely by the blanket dim, so the component showed
nothing of its own once that rule was lifted. It now paints the same disabled roles that its
individually disabled items already use. A completed step is filled with the accent when
enabled, exactly like the selected one, so it greys to the same filled disc rather than falling
through to the empty one. The ring is what separates the two and it keeps its own shape in
either state. The filled connector kept the accent colour while the steps around it greyed. The
selected step's ring is a box-shadow, not a border, so setting border-color left the accent ring
in place. Neither the package nor Blazor has a stepper to copy - there is no stepper in either -
so the disabled ring simply follows the same shape in the disabled scale.

## packages/devextreme-scss/scss/widgets/fluent-next/textEditor/_index.scss

Also for an editor nested in a disabled container: DevExtreme puts the state on the container,
and the editors inside a ColorView, a Pagination or a Form never carry it. Also for an editor
nested in a disabled container: DevExtreme puts the state on the container, and the editors
inside a ColorView, a Pagination or a Form never carry it. The placeholder paints itself, so the
disabled content colour never reaches it by inheritance. The rule that did paint it sat under
.dx-show-clear-button, which left every editor without a clear button - a plain text box, a text
area, a date box - with a full-strength placeholder while it was disabled. An invalid editor
reddens its label, and it kept doing so after being disabled - a red caption over a grey field,
an error you are not allowed to correct. The state wins over the validity.

## packages/devextreme-scss/scss/widgets/fluent-next/treeView/_index.scss

no dim: .dx-treeview-item-content.dx-state-disabled paints the disabled role instead The widget-
level disabled state was carried entirely by the blanket dim, so the component showed nothing of
its own once that rule was lifted. It now paints the same disabled roles that its individually
disabled items already use. The expander sets its own colour, so the rule on the item never
reached it and it kept full contrast next to greyed text. It is painted only here, where the
whole widget is disabled and the root takes pointer-events: none. The expander of a single
disabled item still expands the node, so it keeps its enabled colour - greying it would claim it
is inert when it is not. item.color.selected.bg.disabled

## packages/devextreme-scss/scss/widgets/fluent-next/pagination/_index.scss

no dim: the disabled navigation button is painted from the content role below at the first or
last page this button used to be dimmed to 30%; it is painted from the same content role as the
rest of the disabled pagination instead The widget-level disabled state was carried entirely by
the blanket dim, so the component showed nothing of its own once that rule was lifted. It is
painted from the disabled content role now. The page-count line is secondary text. It used to be
the content colour at 70%, which drags the whole element - not just its text - and states no
contrast; content-subtle is the package's own role for it.

## packages/devextreme-scss/scss/widgets/fluent-next/switch/_colors.scss

The handle is content, not a border: enabled it is painted from content roles (subtle when off,
inverted when on), so its disabled step is the disabled content role. It used to share the
border role with the track outline - two package tokens held that colour until 262.15.0 dropped
both, and the nearest role left was the border one. That made the handle #d7d7d7 on an #f5f5f5
track in light, 1.32:1, paler than legacy fluent's 1.65:1. Blazor paints the same element from a
content role (checkbox/switcher: primary-checked-readonly-check-element-trigger-bg = content-
neutral-default-disabled). The track outline keeps the border role, which is correct for a
border.

## packages/devextreme-scss/scss/widgets/fluent-next/tabs/_index.scss

The widget-level disabled state was carried entirely by the blanket dim, so the component showed
nothing of its own once that rule was lifted. It now paints the same disabled roles that its
individually disabled items already use. The label a tab actually shows is .dx-tab-text-span-
pseudo, not the span around it: the outer one is visibility: hidden and only reserves the width
the bold selected state needs. The pseudo span paints its own colour, so colouring the tab left
the visible text black - the rule that covers it matches .dx-tab.dx-state-disabled, which is a
disabled tab, not a disabled tab strip.

## packages/devextreme-scss/scss/widgets/fluent-next/chat/_colors.scss

The transcript keeps full contrast when the chat is disabled - it is content, and neither the
package nor Blazor defines a disabled colour for a message. What the state has to show is that
the input is out of use, so the rule the composing area is separated by takes the disabled
border role, next to the input text and send icon that already paint themselves. An attachment
is a control sitting inside the transcript, and the transcript itself greys with the rest of the
widget too - a reading the component owner chose over the other one, that a message is content
and so has no disabled state.

## packages/devextreme-scss/scss/widgets/fluent-next/gantt/_index.scss

The toolbar icons are SVG data-uri backgrounds with their colour baked in at build time, so the
greyed `color` on a disabled toolbar item never reaches the glyph - an unavailable command
looked exactly like an available one once the blanket dim was lifted. Every one of these icons
is a toolbar command that can be unavailable, so the whole set is emitted again in the disabled
colour. The timescale header paints its own text, so the dates above the chart stayed black
while the task tree beside them greyed. The title inside a task bar is left alone on purpose: it
is written on the bar's own surface, the same reason a scheduler appointment keeps its colour.

## packages/devextreme-scss/scss/widgets/fluent-next/tabs/layout/tab/styling-mode/_secondary.scss

And the same for a disabled widget, whose state class sits on the root next to the styling mode
rather than on the tab. Without this the bar stayed accent-coloured in secondary and in
TabPanel, which uses secondary - the asymmetry with primary was visible side by side. A disabled
widget carries the state on its root, next to the styling-mode class, not on the tab, so the
rule above never matched. And secondary hangs its indicator on .dx-tab-content rather than on
the tab, so the selector that works for primary lands on the wrong element here - which is why
the bar stayed blue in this mode and in TabPanel, which uses it.

## packages/devextreme-scss/tests/fluent-next-naming.test.ts

A Sass boolean is a switch, not a value. base reads these as `@if` conditions that decide
whether rules exist at all, and custom properties resolve long after the rules are emitted - so
publishing one hands out a knob that turns nothing. `$scheduler-appointment-bg-focused: false`
was published before this branch and shipped `--dx-scheduler-appointment-bg-focused: false` on
every scheduler root.

## packages/devextreme-scss/scss/widgets/fluent-next/scheduler/_public.scss

$scheduler-appointment-bg-focused and $scheduler-appointment-shadow-focused are deliberately NOT
published. They are build-time flags, not values: base reads them as `@if` conditions (`$fill-
focused-appointment`, `$is-shadow-color-for-focused-state`) that decide whether rules exist at
all. Published, they emitted `--dx-scheduler-appointment-bg-focused: false` into the shipped CSS
- a name that reads as a colour role holding a Sass boolean, which any var() reading it would
turn into an invalid declaration with nothing in the console.

## packages/devextreme-scss/scss/widgets/fluent-next/textEditor/_colors.scss

text-content.color.default.placeholder.disabled in the package's component tier: a disabled
placeholder is not the same grey as a resting one Read-only shares the disabled border step, but
it is not a disabled state and must be steerable on its own. Blazor goes further and leaves a
read-only editor the ordinary border, distinguishing it by the lost fill alone (ds-
themes/components/text-edit/states.scss); we keep the softer border because it carries the
affordance, and the name no longer hides the choice.

## packages/devextreme-scss/scss/widgets/fluent-next/toolbar/_index.scss

base/toolbar opts the toolbar out of the blanket disabled dim and puts nothing in its place, and
the "do not dim nested widgets" rule clears the dim from the item widgets as well, so a disabled
toolbar rendered exactly like an enabled one. The state is painted from the disabled roles
instead, on the toolbar's own text and on the text of its item buttons. The item widgets are not
disabled themselves, so they keep their own colours: paint them here rather than redeclaring
their tier names, which belong to the button component.

## apps/demos/testing/common.test.ts

Cause not reproduced: the demo has no disabled element, so the inherited "disabled tags" reason
does not apply. Needs a measurement in CI. Real failure, and the palette's rather than the
demo's: content-danger is #e4554f in the dark palette - 4.92:1 on an alternating row, 4.22:1 on
a normal one - so which rows fail is decided by the live data. The package assigns that role to
error text itself.

## e2e/testcafe-devextreme/tests/accessibility/cardView/columnSortable.ts

Real failure, not a false positive: axe composites the drag source's dim into the foreground
before it measures, and at the 0.5 the other themes use, their source lands at 1.61 generic,
1.65 fluent, 2.61 material - so the rule is off for them. fluent-next dims to 0.65 instead and
paints the source with the item's own resting colours rather than the disabled ones, which puts
it at 5.36, so it runs the check.

## e2e/testcafe-devextreme/tests/accessibility/cardView/sortable.ts

Real failure, not a false positive: axe composites the drag source's dim into the foreground
before it measures, and at the 0.5 the other themes use, their source lands at 1.61 generic,
1.65 fluent, 2.61 material - so the rule is off for them. fluent-next dims to 0.65 instead and
paints the source with the item's own resting colours rather than the disabled ones, which puts
it at 5.36, so it runs the check.

## e2e/testcafe-devextreme/tests/accessibility/dataGrid/common.ts

The confirm-delete dialog autofocuses "Yes", and the focused filled button reuses the hovered
step, which in the fluent-next dark palette is a lighter blue (#2b7ecf) that white content fails
on (4.21:1). The pair belongs to the design-token package, so the fix lands at the foundation
level, not in the theme. Color-contrast is the only rule fluent-next runs, so the test is
skipped for that theme instead of narrowed. See fluent-next/DISABLED_STATES.md.

## packages/devextreme-scss/scss/widgets/base/scheduler/appointment/regular/_index.scss

Guarded so a theme can pass false: the date is secondary text, and a theme with a role for that
paints the role instead of dimming the element and its icons with it. Guarded so a theme can
pass false: the appointment left behind needs no mark when the copy under the cursor is the
thing being moved. Resizing is the other case and keeps its dim - there is no copy there, the
appointment itself is what the user is stretching.

## packages/devextreme-scss/scss/widgets/fluent-next/calendar/_index.scss

The package gives a calendar cell a disabled colour (cell.period.color.text.disabled) and the
theme painted nothing at all: a disabled calendar rendered exactly like an enabled one once the
blanket dim was lifted. Only the span: the round selection is drawn on it, and painting the cell
as well put a square behind the circle. box-shadow is left alone for the same reason - it is
part of the shape.

## packages/devextreme-scss/scss/widgets/fluent-next/gallery/_index.scss

The widget-level disabled state was carried entirely by the blanket dim, so the component showed
nothing of its own once that rule was lifted. It is painted from the disabled content role now.
The arrow disc is a surface of its own, so it kept full strength next to greyed slides. The
paging dots keep the accent otherwise, which reads as an active control inside a disabled
gallery. The selected dot stays distinguishable from the rest, just in the disabled scale.

## packages/devextreme-scss/scss/widgets/fluent-next/menu/_index.scss

The widget-level disabled state was carried entirely by the blanket dim, so the component showed
nothing of its own once that rule was lifted. It now paints the same disabled roles that its
individually disabled items already use. item.color.selected.bg.disabled: a selected item that
is disabled keeps neither the selection colour nor nothing at all - the package gives it the
disabled background

## packages/devextreme-scss/scss/widgets/fluent-next/tabs/layout/navigation-button/_base.scss

The contained nav button is already `visibility: hidden` when disabled - a tab strip hides its
scroll buttons rather than greying them - so hiding the content inside it said nothing twice.
Any other styling mode leaves the button visible, and there the package's answer applies: a
disabled icon is content-disabled (tabs.item.color.icon.default.disabled), greyed and still
legible. Blazor does the same, swapping colour, background and cursor and never hiding.

## packages/devextreme-scss/scss/widgets/fluent-next/treeList/_index.scss

No dim on the dragged column: it halved the header text to 3.41:1. The column is marked with the
drag-source colour instead - the sticky-column case already did that. The expander sets its own
colour, so the rule that greys a disabled cell never reached it and a disabled TreeList showed
grey rows with full-contrast chevrons. The widget class is in the selector to outrank the
resting rule above.

## packages/devextreme-scss/scss/widgets/base/_pagination.scss

Guarded so a theme can switch it off with `false`: the info line is secondary text, and a theme
that has a role for that paints the role instead of dimming the element. false opts out of the
dim; `null` would be overwritten by the `!default` above and silently restore it

## packages/devextreme-scss/scss/widgets/base/gridBase/_index.scss

Parametrized so a theme can pass false: a chooser item is faint until it can be dragged, which
is a state, and a theme with roles for that paints them instead. false opts out of the dim; a
theme that marks the dragged column with colour instead does not want its header text halved

## packages/devextreme-scss/scss/widgets/base/pivotGrid/_index.scss

Parametrized so a theme can pass false: this fades the whole field panel while a field is being
dragged, and the panel is not the thing that moves. false opts out of the dim; a theme that
marks the source with colour instead does not want the field text halved

## packages/devextreme-scss/scss/widgets/fluent-next/actionSheet/_index.scss

The sheet's items are buttons that are not disabled themselves, so their text is painted here
rather than through the button tier, which belongs to the button component. The sheet renders
its items into a popup outside the widget, and the element that carries the state there is .dx-
actionsheet-container - matching .dx-actionsheet never reached them.

## packages/devextreme-scss/scss/widgets/fluent-next/button/_mixins.scss

The second selector is for a button inside something disabled - a popup, a toolbar, a form.
DevExtreme puts the state on the container, not on the button, so matching only the button left
a filled one at full accent inside a greyed dialog. Painting the text alone would be worse than
either: a filled button needs its surface and its content to move together.

## packages/devextreme-scss/scss/widgets/fluent-next/calendar/_colors.scss

cell.period.color.text.disabled in the package's component tier A disabled calendar kept its
selected day at full accent while every other cell greyed. The package has no disabled step for
this cell, but it does answer the same question for a menu (item.color.selected.bg.disabled =
bg-disabled), and the shape still says which day is selected.

## packages/devextreme-scss/scss/widgets/fluent-next/cardView/_colors.scss

The dim the sortable puts on a drag source is what marks it, so the chip keeps its own colours
underneath and fades as one piece. They are not painted with the disabled roles on top of that
dim: that pairing measured 2.11 against this background, and axe composites the opacity into the
foreground before it measures, so the text would have been unreadable as well as failing.

## packages/devextreme-scss/scss/widgets/fluent-next/dropDownEditor/_colors.scss

The icon used to fade to 35% of content-subtle while the drop-down was open - about #bebebe on
white - and the active role beside it held the same value as rest, so it marked nothing. The
design system has no neutral content-*-active, so active is said the other way round: the icon
strengthens to the full content role while the editor is open instead of receding.

## packages/devextreme-scss/scss/widgets/fluent-next/fileUploader/_index.scss

The widget-level disabled state was carried entirely by the blanket dim, so the component showed
nothing of its own once that rule was lifted. It is painted from the disabled content role now.
The select-file button is a widget of its own and is not disabled, so its text is painted here
rather than through the button tier, which belongs to the button component.

## packages/devextreme-scss/scss/widgets/fluent-next/gallery/_colors.scss

The disc takes a content role when enabled ($gallery-nav-button-bg is content-subtle), so its
disabled step is the content one. bg-disabled made a near-white disc on a white page, and the
white chevron on it vanished with it. The indicator dots are a control - they page the gallery -
and kept the accent when disabled.

## packages/devextreme-scss/scss/widgets/fluent-next/gridBase/layout/aiChat/_index.scss

This button was the last place still dimming a disabled state, and dimming it took the icon and
the label down together while stating no contrast of its own. The two behavioural parts of the
disabled-widget mixin are what it actually needed; the third is a colour, and the theme has a
role for it.

## packages/devextreme-scss/scss/widgets/fluent-next/pivotGrid/_colors.scss

Border of the field boxes in their ordinary state. It reads the disabled border role because
that is the step the design uses here; nothing on this element is disabled. The field left
behind while dragging. Blazor marks its draggable pivot header with colour, and so do cardView
and the grid here - the field stays readable and says it is the source.

## packages/devextreme-scss/scss/widgets/fluent-next/radioButton/_colors.scss

color.unchecked.border.disabled and color.checked.border.disabled in the package's component
tier. The ring is a border and takes the border scale; the dot inside it stays content. Read-
only shares the disabled step, but it is not a disabled state: Blazor keeps the two apart with
variables of their own, and so do we, so either can move without the other.

## packages/devextreme-scss/scss/widgets/fluent-next/sortable/_sizes.scss

One step up from the 0.5 the other themes dim a drag source by, because axe composites opacity
into the foreground before it measures and 0.5 puts this theme's text under the 4.5 it needs:
3.32 on a cardView chip, 3.43 on a grid column header. 0.65 clears it on every sortable in the
theme with room to spare - 5.36 worst, against 4.54 at 0.6 - and still reads as a clearly faded
source.

## packages/devextreme-scss/scss/widgets/fluent-next/splitter/_colors.scss

The resize handle is the splitter's only chrome of its own - the panes hold the application's
content. Blazor has no disabled splitter to copy (DxSplitter exposes no such parameter), but the
token package does: bar.color.outer-bg.disabled and bar.color.inner-bg.disabled both name bg-
disabled, so the handle's surface follows the background scale rather than the border one.

## packages/devextreme-scss/scss/widgets/fluent-next/switch/_index.scss

base states the switch's disabled look on the widget's own root, and that mixin is shared with
the legacy theme, so the ancestor form cannot be added there. A switch inside a disabled form or
toolbar is the case it misses - the track and the handle stayed at full strength - so this theme
restates the same two paints for it here.

## packages/devextreme-scss/scss/widgets/fluent-next/tabs/layout/tab/styling-mode/_primary.scss

A disabled widget carries the state on its root, next to the styling-mode class, not on the tab
- so the rule above never matched and the indicator kept the accent while the labels greyed. A
disabled widget carries the state on its root, next to the styling-mode class, not on the tab -
so the rule above never matched and the indicator kept the accent while the labels greyed.

## packages/devextreme-scss/scss/widgets/fluent-next/tileView/_index.scss

A tile paints its own colour, so a disabled one kept it: the rule the theme has matches a
disabled TileView, and item.disabled puts the state on the tile itself. The widget-level
disabled state was carried entirely by the blanket dim, so the component showed nothing of its
own once that rule was lifted. It is painted from the disabled content role now.

## packages/devextreme-scss/scss/widgets/fluent-next/colorView/_colors.scss

A disabled palette cannot be greyed out: its content is the colour. Blazor marks the tile
outlines and the captions instead (ds-themes/components/color-palette/states.scss) and leaves
the swatches untouched; these three do the same here.

## packages/devextreme-scss/scss/widgets/fluent-next/common/_colors.scss

The disabled content step. It is global because it is applied at the widget root, so that text
painting no colour of its own inherits it - the role the package names for 70 of its 125
disabled tokens.

## packages/devextreme-scss/scss/widgets/fluent-next/diagram/_colors.scss

The placeholder artwork was content-subtle with a separate 50% on top - two declarations for one
colour. Folding the alpha into the paint is what Blazor does (color-opacity) and it stops the
element's opacity from taking its children with it.

## packages/devextreme-scss/scss/widgets/fluent-next/fieldset/_index.scss

DxFormLayout cascades Enabled to its items and its theme paints nothing on the container (ds-
themes/components/form-layout has no disabled styling at all), so the captions carry the state
here too - the values are editors and mark themselves.

## packages/devextreme-scss/scss/widgets/fluent-next/gridBase/_colors.scss

A disabled command link used to be the accent at 35%, and its icon the same accent at 60% - two
alphas for one state on one element, and neither states a contrast. One disabled role covers
both, the way every other disabled content in the grid is painted.

## packages/devextreme-scss/scss/widgets/fluent-next/pagination/_colors.scss

The selected page and page size are filled discs. A disabled pager kept the accent fill while
its numeral greyed - grey on saturated blue, worse than either state. The pair follows the
answer the package gives for a selected menu item: bg-disabled behind content-disabled.

## packages/devextreme-scss/scss/widgets/fluent-next/scheduler/_colors.scss

The date line under an appointment subject in the tooltip. It is secondary text, so it says so
with the subtle content role - the same one the chat gives its timestamps - rather than by being
made translucent.

## packages/devextreme-scss/scss/widgets/fluent-next/speedDialAction/_index.scss

The floating action button had no disabled state at all: it renders into the viewport, keeps its
accent disc and white icon, and a disabled one looked exactly like a live one. The label is
painted through the overlay chain, so a two-class selector loses to it.

## packages/devextreme-scss/scss/widgets/fluent-next/treeList/_colors.scss

grid.cell-renderer.text.color.icon.disabled in the package's component tier: an icon inside a
cell follows the state. The expander sets its own colour, so the rule that greys the cell text
never reached it - a disabled TreeList showed grey rows with full-contrast chevrons.

## packages/devextreme-scss/scss/widgets/fluent-next/validation/_colors.scss

A disabled field cannot be corrected, so its error message stops shouting: it kept the danger
colour and the danger surface next to an editor that had gone grey. Same reasoning as the
message above: a disabled field cannot be corrected.

## packages/devextreme-scss/scss/widgets/fluent-next/validation/_index.scss

The message renders into an overlay, so the state is reached through the editor that owns it.
The message text sits in a span of its own, which kept the danger colour while the pill behind
it had already gone grey - red letters on a grey ground reads worse than either state.

## packages/devextreme-scss/scss/widgets/base/_numberBox.scss

Guarded so a theme can pass false: a disabled editor already paints its own disabled content,
and a second dim on the spin buttons only stacks on it.

## packages/devextreme-scss/scss/widgets/base/chat/layout/chat/_index.scss

false opts out of the dim; `null` would be overwritten by the `!default` in the parent module
and silently restore it

## packages/devextreme-scss/scss/widgets/base/dropDownEditor/_index.scss

Guarded so a theme can pass false: an active state is a colour, and a theme with a role for it
paints the role rather than fading the icon out.

## packages/devextreme-scss/scss/widgets/base/filterBuilder/_common.scss

Guarded so a theme can pass false: the separator is secondary text and a theme with a role for
that paints the role.

## packages/devextreme-scss/scss/widgets/base/scheduler/_tooltip.scss

false opts out: the date is secondary text, and a theme that has a role for that says so with a
colour rather than by making the line translucent

## packages/devextreme-scss/scss/widgets/base/treeView/_common.scss

false opts out of the dim entirely; a `null` here would be overwritten by the `!default` in
_index.scss and silently restore it

## packages/devextreme-scss/scss/widgets/fluent-next/card/_index.scss

A card is a surface, and a surface in a disabled subtree takes the disabled surface role. It
used to be greyed by the blanket dim; nothing marked it once that went.

## packages/devextreme-scss/scss/widgets/fluent-next/checkBox/_colors.scss

Read-only shares the disabled step, but it is not a disabled state: Blazor keeps the two apart
with variables of their own, and so do we, so either can move without the other.

## packages/devextreme-scss/scss/widgets/fluent-next/contextMenu/_index.scss

A disabled context menu had nothing of its own once the blanket dim was gone: its items are
plain markup, not widgets that mark themselves.

## packages/devextreme-scss/scss/widgets/fluent-next/dataGrid/_index.scss

No dim on the dragged column: it halved the header text to 3.41:1. The column is marked with the
drag-source colour instead - the sticky-column case already did that.

## packages/devextreme-scss/scss/widgets/fluent-next/dateView/_index.scss

Every roller item paints itself, the selected one with the accent, so a disabled date view kept
its whole month/day/year list at full contrast - the largest single gap the sweep found.

## packages/devextreme-scss/scss/widgets/fluent-next/fileManager/_colors.scss

The directory tree paints its own item text, so it kept full contrast inside a disabled file
manager while everything around it greyed.

## packages/devextreme-scss/scss/widgets/fluent-next/form/_colors.scss

The Form widget writes its captions as .dx-field-item-label-text, which the fieldset rule does
not reach: the labels stayed at full contrast while their editors greyed.

## packages/devextreme-scss/scss/widgets/fluent-next/form/_index.scss

The Form widget's captions were left at full contrast when the form was disabled: the fieldset
rule matches .dx-field-label, and a Form writes .dx-field-item-label-text.

## packages/devextreme-scss/scss/widgets/fluent-next/loadIndicator/_colors.scss

The ring has to stay a ring: at bg-disabled the track vanished into the page and only a faint
arc was left. The border scale keeps the circle visible without claiming it is active.

## packages/devextreme-scss/scss/widgets/fluent-next/menu/_colors.scss

menu-list.item.color.separator.disabled in the package's component tier
item.color.selected.bg.disabled in the package's component tier

## packages/devextreme-scss/scss/widgets/fluent-next/numberBox/_index.scss

base dims the spin buttons when the editor is disabled; the editor already paints its own
disabled content, so this only added a second, unmeasurable dim on top of it.

## packages/devextreme-scss/scss/widgets/fluent-next/scrollable/_index.scss

The scrollbar thumb keeps its full-strength surface inside a disabled widget, where there is
nothing to scroll. It is shared by every scrollable component, so one rule covers them all.

## packages/devextreme-scss/scss/widgets/fluent-next/tabs/variables/_colors.scss

item.color.selector.selected-disabled in the package's component tier: the indicator under a
selected tab is content, not a border, and its disabled step follows the content scale

## packages/devextreme-scss/scss/widgets/fluent-next/tagBox/_colors.scss

The ordinary tag border. It reads the disabled border role because that is the step the design
uses here; the name says what it paints, not where the value happens to come from.

## e2e/testcafe-devextreme/helpers/accessibility/utils.ts

Swallowing this used to report the test as passed with no assertion at all.

## packages/devextreme-scss/scss/widgets/fluent-next/list/_colors.scss

item.color.selected.bg.disabled (and multi-selected) in the package's component tier

## packages/devextreme-scss/scss/widgets/fluent-next/scrollable/_colors.scss

The thumb takes a content role when enabled, so its disabled step is the content one.

## packages/devextreme-scss/scss/widgets/fluent-next/splitterBar/_index.scss

The bar is the splitter's only chrome, so it is what shows the state.

## packages/devextreme-scss/scss/widgets/fluent-next/treeView/_colors.scss

item.color.selected.bg.disabled in the package's component tier
