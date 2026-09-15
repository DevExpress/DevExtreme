<!-- Generated: node tools/review/roles.mjs. Do not edit by hand. -->
# Roles - what the theme assigns, what the package assigns

Package `@devexpress/design-tokens-internal@262.16.0`, sets: core, vnext, blazor, wpf.

Colour declarations reading a role: **711**.

| Signal | Count |
|---|---|
| family mismatch (slot wants another `--dxds-` family) | **59** |
| slot contradicts the painted property | **10** |
| states that resolve to one role | **22** |
| one concept painted with several roles | **22** (6 across families) |
| text/background pairs below AA | **2** of 60 measured (2 dark only) |
| package: agrees | 297 |
| package: agrees-kin | 45 |
| package: cross-family | 9 |
| package: family-conflict | 1 |
| package: role-new | 112 |
| package: slot-absent | 19 |
| package: no-counterpart | 225 |
| package: slot-unparsed | 3 |

## Cross-family - the package uses this role, but only for a slot of another kind - 9

- `check-box-invalid-mark-bg` = ds.$color-content-danger-shared  (scss/widgets/fluent-next/checkBox/_colors.scss:38)
    - package paints it as **icon** in blazor/checkbox
    - **same widget, different word**: the package uses this very role on another part of it
    - for our slot `bg` the package uses: `color-bg`, `color-bg-danger`, `color-bg-danger-active`, `color-bg-danger-hovered`, `color-bg-danger-shared`, `color-bg-danger-shared-active`, `color-bg-danger-shared-hovered`, `color-bg-inverted`, `color-bg-on-color`, `color-bg-primary`, `color-bg-primary-active`, `color-bg-primary-hovered`, `color-bg-static-dark`, `color-bg-success-shared`, `color-bg-success-shared-active`, `color-bg-success-shared-hovered`, `color-border-subtle`, `color-content-disabled`, `color-content-inverted`, `color-none`
    - **free swap**: `color-bg-danger-shared` resolves identically in both modes (light #c50f1f / dark #e4554f)
- `check-box-invalid-mark-bg-hovered` = ds.$color-content-danger-shared-hovered  (scss/widgets/fluent-next/checkBox/_colors.scss:39)
    - package paints it as **icon** in blazor/checkbox
    - **same widget, different word**: the package uses this very role on another part of it
    - for our slot `bg` the package uses: `color-bg`, `color-bg-danger`, `color-bg-danger-active`, `color-bg-danger-hovered`, `color-bg-danger-shared`, `color-bg-danger-shared-active`, `color-bg-danger-shared-hovered`, `color-bg-inverted`, `color-bg-on-color`, `color-bg-primary`, `color-bg-primary-active`, `color-bg-primary-hovered`, `color-bg-static-dark`, `color-bg-success-shared`, `color-bg-success-shared-active`, `color-bg-success-shared-hovered`, `color-border-subtle`, `color-content-disabled`, `color-content-inverted`, `color-none`
    - **free swap**: `color-bg-danger-shared-hovered` resolves identically in both modes (light #9d0013 / dark #ee726a)
- `check-box-invalid-mark-bg-focused` = ds.$color-content-danger-shared-active  (scss/widgets/fluent-next/checkBox/_colors.scss:40)
    - package paints it as **icon** in blazor/checkbox
    - **same widget, different word**: the package uses this very role on another part of it
    - for our slot `bg` the package uses: `color-bg`, `color-bg-danger`, `color-bg-danger-active`, `color-bg-danger-hovered`, `color-bg-danger-shared`, `color-bg-danger-shared-active`, `color-bg-danger-shared-hovered`, `color-bg-inverted`, `color-bg-on-color`, `color-bg-primary`, `color-bg-primary-active`, `color-bg-primary-hovered`, `color-bg-static-dark`, `color-bg-success-shared`, `color-bg-success-shared-active`, `color-bg-success-shared-hovered`, `color-border-subtle`, `color-content-disabled`, `color-content-inverted`, `color-none`
    - **free swap**: `color-bg-danger-shared-active` resolves identically in both modes (light #76000b / dark #9d0013)
- `radio-button-invalid-bg` = ds.$color-border-danger-shared  (scss/widgets/fluent-next/radioButton/_colors.scss:19)
    - package paints it as **border** in blazor/radio
    - **same widget, different word**: the package uses this very role on another part of it
    - for our slot `bg` the package uses: `color-bg-inverted`, `color-bg-static-dark`, `color-border-subtle`, `color-content-inverted`, `color-none`
    - ours resolves light #c50f1f / dark #e4554f; no role of the right family shares it. Nearest of the right family: `color-bg-inverted` (moves light and dark), `color-bg-static-dark` (moves light and dark)
- `radio-button-invalid-bg-hovered` = ds.$color-border-danger-shared-hovered  (scss/widgets/fluent-next/radioButton/_colors.scss:20)
    - package paints it as **border** in blazor/radio
    - **same widget, different word**: the package uses this very role on another part of it
    - for our slot `bg` the package uses: `color-bg-inverted`, `color-bg-static-dark`, `color-border-subtle`, `color-content-inverted`, `color-none`
    - ours resolves light #9d0013 / dark #ee726a; no role of the right family shares it. Nearest of the right family: `color-bg-inverted` (moves light and dark), `color-bg-static-dark` (moves light and dark)
- `radio-button-invalid-bg-focused` = ds.$color-border-danger-shared-active  (scss/widgets/fluent-next/radioButton/_colors.scss:21)
    - package paints it as **border** in blazor/radio
    - **same widget, different word**: the package uses this very role on another part of it
    - for our slot `bg` the package uses: `color-bg-inverted`, `color-bg-static-dark`, `color-border-subtle`, `color-content-inverted`, `color-none`
    - ours resolves light #76000b / dark #9d0013; no role of the right family shares it. Nearest of the right family: `color-bg-inverted` (moves light and dark), `color-bg-static-dark` (moves light and dark)
- `switch-handle-off-bg` = ds.$color-content-subtle  (scss/widgets/fluent-next/switch/_colors.scss:9)
    - package paints it as **trigger** in core/switch, vnext/switch
    - package paints it as **icon, title** in core/empty-item, vnext/empty-item
    - package paints it as **content, trigger** in wpf/toggle-switch
    - **same widget, different word**: the package uses this very role on another part of it
    - for our slot `bg` the package uses: `color-bg-danger-active`, `color-bg-danger-shared`, `color-bg-danger-shared-hovered`, `color-bg-disabled`, `color-bg-inverted`, `color-bg-primary-active`, `color-bg-primary-shared`, `color-bg-primary-shared-hovered`, `color-bg-static-dark`, `color-bg-success-active`, `color-bg-success-shared`, `color-bg-success-shared-hovered`, `color-border-subtle`, `color-content-inverted`, `color-none`
    - ours resolves light #444444 / dark #cbcbcb; no role of the right family shares it. Nearest of the right family: `color-bg-danger-active` (moves light and dark), `color-bg-danger-shared` (moves light and dark), `color-bg-danger-shared-hovered` (moves light and dark)
- `switch-handle-bg-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/switch/_colors.scss:16)
    - package paints it as **trigger** in core/switch, vnext/switch
    - package paints it as **placeholder, text** in core/text-content, vnext/text-content
    - package paints it as **content** in core/link, vnext/link
    - package paints it as **content, trigger** in wpf/toggle-switch
    - **same widget, different word**: the package uses this very role on another part of it
    - for our slot `bg` the package uses: `color-bg-danger-active`, `color-bg-danger-shared`, `color-bg-danger-shared-hovered`, `color-bg-disabled`, `color-bg-inverted`, `color-bg-primary-active`, `color-bg-primary-shared`, `color-bg-primary-shared-hovered`, `color-bg-static-dark`, `color-bg-success-active`, `color-bg-success-shared`, `color-bg-success-shared-hovered`, `color-border-subtle`, `color-content-inverted`, `color-none`
    - ours resolves light #ababab / dark #767676; no role of the right family shares it. Nearest of the right family: `color-bg-danger-active` (moves light and dark), `color-bg-danger-shared` (moves light and dark), `color-bg-danger-shared-hovered` (moves light and dark)
- `switch-handle-on-shadow` = ds.$color-content-inverted *(alpha bridge - see BRIDGES.md)*  (scss/widgets/fluent-next/switch/_colors.scss:27)
    - package paints it as **trigger** in core/switch, vnext/switch
    - package paints it as **veil** in core/backdrop, vnext/backdrop
    - **same widget, different word**: the package uses this very role on another part of it
    - the package names no role for slot `shadow` here

## Family conflict - the package paints this slot from another family entirely - 1

- `load-indicator-segment-inner-border` = ds.$color-bg-primary-subtle  (scss/widgets/fluent-next/loadIndicator/_colors.scss:9)
    - for slot `border` the package uses: `color-border-subtle`, `color-focus`, `color-focus-inverted`, `color-focus-static`, `color-focus-static-inverted`, `color-none`
    - ours resolves light #b4d2f4 / dark #004884; no role of the right family shares it. Nearest of the right family: `color-border-subtle` (moves light and dark)

## Family mismatch - 59

- `chat-typing-indicator-circle-center-bg` = ds.$color-content-subtle  (scss/widgets/fluent-next/chat/_colors.scss:43)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees-kin
- `chat-typing-indicator-circle-bg` = ds.$color-content-disabled  (scss/widgets/fluent-next/chat/_colors.scss:45)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees-kin
- `check-box-icon-bg` = ds.$color-content-inverted  (scss/widgets/fluent-next/checkBox/_colors.scss:7)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees
- `check-box-invalid-mark-bg` = ds.$color-content-danger-shared  (scss/widgets/fluent-next/checkBox/_colors.scss:38)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: cross-family
- `check-box-invalid-mark-bg-hovered` = ds.$color-content-danger-shared-hovered  (scss/widgets/fluent-next/checkBox/_colors.scss:39)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: cross-family
- `check-box-invalid-mark-bg-focused` = ds.$color-content-danger-shared-active  (scss/widgets/fluent-next/checkBox/_colors.scss:40)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: cross-family
- `check-box-icon-bg-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/checkBox/_colors.scss:45)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees
- `date-view-item-content-selected` = ds.$color-bg-primary  (scss/widgets/fluent-next/dateView/_colors.scss:9)
    - slot `content` wants `color-content-*`, reads a `bg` role; package verdict: no-counterpart
- `diagram-connector-border` = ds.$color-bg-primary  (scss/widgets/fluent-next/diagram/_colors.scss:11)
    - slot `border` wants `color-border-*`, reads a `bg` role; package verdict: no-counterpart
- `diagram-connection-border` = ds.$color-bg-success  (scss/widgets/fluent-next/diagram/_colors.scss:12)
    - slot `border` wants `color-border-*`, reads a `bg` role; package verdict: no-counterpart
- `diagram-geometry-mark-border` = ds.$color-bg-danger  (scss/widgets/fluent-next/diagram/_colors.scss:13)
    - slot `border` wants `color-border-*`, reads a `bg` role; package verdict: no-counterpart
- `diagram-image-icon-accent-border` = ds.$color-content-primary  (scss/widgets/fluent-next/diagram/_colors.scss:24)
    - slot `border` wants `color-border-*`, reads a `content` role; package verdict: no-counterpart
- `diagram-selection-mark-content` = ds.$color-border-contrast  (scss/widgets/fluent-next/diagram/_colors.scss:60)
    - slot `content` wants `color-content-*`, reads a `border` role; package verdict: no-counterpart
- `diagram-selection-bg` = ds.$color-border-contrast  (scss/widgets/fluent-next/diagram/_colors.scss:61)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: no-counterpart
- `file-manager-editor-bg-active` = ds.$color-content  (scss/widgets/fluent-next/fileManager/_colors.scss:6)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: no-counterpart
- `gallery-indicator-border-selected` = ds.$color-bg  (scss/widgets/fluent-next/gallery/_colors.scss:11)
    - slot `border` wants `color-border-*`, reads a `bg` role; package verdict: role-new
- `gallery-border-focused` = ds.$color-bg-primary  (scss/widgets/fluent-next/gallery/_colors.scss:20)
    - slot `border` wants `color-border-*`, reads a `bg` role; package verdict: role-new
- `gallery-indicator-item-bg-selected-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/gallery/_colors.scss:26)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees-kin
- `gallery-indicator-item-bg-disabled` = ds.$color-border-disabled  (scss/widgets/fluent-next/gallery/_colors.scss:27)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: role-new
- `html-editor-uploader-cover-bg` = ds.$color-border  (scss/widgets/fluent-next/htmlEditor/_colors.scss:14)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: no-counterpart
- `html-editor-code-block-bg` = ds.$color-content-subtle  (scss/widgets/fluent-next/htmlEditor/_colors.scss:18)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: no-counterpart
- `list-base-select-all-separator-bg` = ds.$color-border-subtle  (scss/widgets/fluent-next/list/_colors.scss:32)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: agrees
- `load-indicator-segment-border` = ds.$color-content-primary  (scss/widgets/fluent-next/loadIndicator/_colors.scss:3)
    - slot `border` wants `color-border-*`, reads a `content` role; package verdict: agrees-kin
- `load-indicator-segment-border-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/loadIndicator/_colors.scss:4)
    - slot `border` wants `color-border-*`, reads a `content` role; package verdict: agrees-kin
- `load-indicator-segment-inner-border` = ds.$color-bg-primary-subtle  (scss/widgets/fluent-next/loadIndicator/_colors.scss:9)
    - slot `border` wants `color-border-*`, reads a `bg` role; package verdict: family-conflict
- `menu-separator-bg` = ds.$color-border-subtle  (scss/widgets/fluent-next/menu/_colors.scss:11)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: agrees
- `menu-separator-bg-disabled` = ds.$color-border-disabled  (scss/widgets/fluent-next/menu/_colors.scss:13)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: role-new
- `pivot-grid-position-indicator-bg` = ds.$color-border-contrast  (scss/widgets/fluent-next/pivotGrid/_colors.scss:19)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: no-counterpart
- `progress-bar-bg` = ds.$color-border  (scss/widgets/fluent-next/progressBar/_colors.scss:3)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: agrees-kin
- `progress-bar-range-bg` = ds.$color-content-primary  (scss/widgets/fluent-next/progressBar/_colors.scss:5)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees-kin
- `progress-bar-container-bg-disabled` = ds.$color-border-disabled  (scss/widgets/fluent-next/progressBar/_colors.scss:6)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: agrees-kin
- `progress-bar-range-bg-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/progressBar/_colors.scss:7)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees-kin
- `progress-bar-range-indeterminate-bg` = ds.$color-content-primary  (scss/widgets/fluent-next/progressBar/_colors.scss:8)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees-kin
- `radio-button-invalid-bg` = ds.$color-border-danger-shared  (scss/widgets/fluent-next/radioButton/_colors.scss:19)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: cross-family
- `radio-button-invalid-bg-hovered` = ds.$color-border-danger-shared-hovered  (scss/widgets/fluent-next/radioButton/_colors.scss:20)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: cross-family
- `radio-button-invalid-bg-focused` = ds.$color-border-danger-shared-active  (scss/widgets/fluent-next/radioButton/_colors.scss:21)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: cross-family
- `scheduler-time-indicator-content` = ds.$color-bg-danger  (scss/widgets/fluent-next/scheduler/_colors.scss:26)
    - slot `content` wants `color-content-*`, reads a `bg` role; package verdict: no-counterpart
- `scheduler-time-indicator-bg` = ds.$color-content  (scss/widgets/fluent-next/scheduler/_colors.scss:36)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: no-counterpart
- `scrollable-scroll-bg` = ds.$color-content-subtle  (scss/widgets/fluent-next/scrollable/_colors.scss:5)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees-kin
- `scrollable-scroll-bg-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/scrollable/_colors.scss:7)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees-kin
- `slider-bar-bg` = ds.$color-border-contrast  (scss/widgets/fluent-next/slider/_colors.scss:3)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: no-counterpart
- `slider-accent-content-focused` = ds.$color-bg-primary-active  (scss/widgets/fluent-next/slider/_colors.scss:7)
    - slot `content` wants `color-content-*`, reads a `bg` role; package verdict: no-counterpart
- `slider-invalid-bg` = ds.$color-border-danger  (scss/widgets/fluent-next/slider/_colors.scss:9)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: no-counterpart
- `slider-invalid-bg-hovered` = ds.$color-border-danger  (scss/widgets/fluent-next/slider/_colors.scss:10)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: no-counterpart
- `slider-invalid-content-focused` = ds.$color-border-danger  (scss/widgets/fluent-next/slider/_colors.scss:11)
    - slot `content` wants `color-content-*`, reads a `border` role; package verdict: no-counterpart
- `slider-bg-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/slider/_colors.scss:13)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: no-counterpart
- `slider-handle-invalid-bg` = ds.$color-border-danger  (scss/widgets/fluent-next/slider/_colors.scss:21)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: no-counterpart
- `stepper-step-bg-selected-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/stepper/_colors.scss:31)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: no-counterpart
- `stepper-step-invalid-bg-selected` = ds.$color-content-danger  (scss/widgets/fluent-next/stepper/_colors.scss:42)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: no-counterpart
- `stepper-connector-bg` = ds.$color-border-subtle  (scss/widgets/fluent-next/stepper/_colors.scss:52)
    - slot `bg` wants `color-bg-*`, reads a `border` role; package verdict: no-counterpart
- `stepper-connector-value-bg-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/stepper/_colors.scss:56)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: no-counterpart
- `stepper-step-shadow` = ds.$color-bg  (scss/widgets/fluent-next/stepper/_colors.scss:58)
    - slot `shadow` wants `color-shadow-*`, reads a `bg` role; package verdict: no-counterpart
- `switch-handle-off-bg` = ds.$color-content-subtle  (scss/widgets/fluent-next/switch/_colors.scss:9)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: cross-family
- `switch-handle-on-bg` = ds.$color-content-inverted  (scss/widgets/fluent-next/switch/_colors.scss:13)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: agrees-kin
- `switch-handle-bg-disabled` = ds.$color-content-disabled  (scss/widgets/fluent-next/switch/_colors.scss:16)
    - slot `bg` wants `color-bg-*`, reads a `content` role; package verdict: cross-family
- `switch-handle-on-shadow` = ds.$color-content-inverted  (scss/widgets/fluent-next/switch/_colors.scss:27)
    - slot `shadow` wants `color-shadow-*`, reads a `content` role; package verdict: cross-family
- `text-editor-line` = ds.$color-content-subtle  (scss/widgets/fluent-next/textEditor/_colors.scss:19)
    - slot `line` wants `color-border-*`, reads a `content` role; package verdict: agrees
- `text-editor-line-hovered` = ds.$color-content  (scss/widgets/fluent-next/textEditor/_colors.scss:20)
    - slot `line` wants `color-border-*`, reads a `content` role; package verdict: agrees
- `text-editor-line-focused` = ds.$color-content  (scss/widgets/fluent-next/textEditor/_colors.scss:21)
    - slot `line` wants `color-border-*`, reads a `content` role; package verdict: agrees

## Roles the package assigns and the theme never reads - 79

Counted from the package inward rather than from our declarations outward, because a whole
family can be missing without any single declaration looking wrong.

Of the 175 roles the four sets assign, the theme reads 86.
79 exist in the semantic layer and go unread; 10 are names no layer declares -
stale references inside the neighbours' own sets.

| Role | Assigned by |
|---|---|
| `color-bg-high` | core, vnext |
| `color-bg-info` | blazor, core, vnext |
| `color-bg-info-active` | blazor, core, vnext |
| `color-bg-info-hovered` | blazor, core, vnext |
| `color-bg-info-selected` | blazor |
| `color-bg-info-subtler` | blazor, wpf |
| `color-bg-info-subtler-active` | wpf |
| `color-bg-info-subtler-hovered` | wpf |
| `color-bg-info-subtler-selected` | wpf |
| `color-bg-inverted-active` | blazor |
| `color-bg-inverted-disabled` | blazor |
| `color-bg-inverted-hovered` | blazor |
| `color-bg-inverted-selected` | blazor |
| `color-bg-low-active` | core, vnext |
| `color-bg-on-color` | core, wpf |
| `color-bg-on-color-alpha` | core, vnext |
| `color-bg-on-color-alpha-active` | core, vnext |
| `color-bg-on-color-alpha-disabled` | core, vnext |
| `color-bg-on-color-alpha-hovered` | core, vnext |
| `color-bg-static-dark-active` | blazor |
| `color-bg-static-dark-hovered` | blazor |
| `color-bg-static-dark-selected` | blazor |
| `color-bg-static-light-active` | blazor |
| `color-bg-static-light-disabled` | blazor |
| `color-bg-static-light-hovered` | blazor |
| `color-bg-static-light-selected` | blazor |
| `color-bg-success-shared` | blazor |
| `color-bg-success-shared-active` | blazor |
| `color-bg-success-shared-hovered` | blazor |
| `color-bg-warning-active` | blazor, core, vnext |
| `color-bg-warning-hovered` | blazor, core, vnext |
| `color-bg-warning-selected` | blazor |
| `color-bg-warning-subtler` | blazor, vnext, wpf |
| `color-bg-warning-subtler-active` | wpf |
| `color-bg-warning-subtler-hovered` | wpf |
| `color-bg-warning-subtler-selected` | wpf |
| `color-border-info` | blazor |
| `color-border-inverted` | blazor |
| `color-border-inverted-active` | blazor |
| `color-border-inverted-disabled` | blazor |
| `color-border-inverted-hovered` | blazor |
| `color-border-on-color-shared` | core, vnext |
| `color-border-on-color-shared-disabled` | core |
| `color-border-static-dark` | blazor, core, vnext, wpf |
| `color-border-static-dark-active` | blazor |
| `color-border-static-dark-disabled` | blazor |
| `color-border-static-dark-hovered` | blazor |
| `color-border-static-light` | blazor |
| `color-border-static-light-active` | blazor |
| `color-border-static-light-disabled` | blazor |
| `color-border-static-light-hovered` | blazor |
| `color-border-success-shared` | blazor |
| `color-border-success-shared-active` | blazor |
| `color-border-success-shared-hovered` | blazor |
| `color-border-warning` | blazor, vnext |
| `color-content-info` | blazor, wpf |
| `color-content-info-active` | blazor, core, vnext |
| `color-content-info-hovered` | blazor, core, vnext |
| `color-content-inverted-disabled` | blazor |
| `color-content-on-color` | blazor, core, vnext |
| `color-content-on-color-disabled` | core, vnext |
| `color-content-on-color-shared` | wpf |
| `color-content-on-color-shared-disabled` | core |
| `color-content-on-color-subtler` | core, vnext |
| `color-content-on-subtle-primary` | wpf |
| `color-content-primary-shared` | core, vnext |
| `color-content-primary-shared-active` | core, vnext |
| `color-content-primary-shared-hovered` | core, vnext |
| `color-content-static-light-disabled` | blazor, wpf |
| `color-content-success-shared` | blazor |
| `color-content-success-shared-active` | blazor |
| `color-content-success-shared-hovered` | blazor |
| `color-content-warning` | blazor, vnext, wpf |
| `color-content-warning-active` | blazor, core, vnext |
| `color-content-warning-hovered` | blazor, core, vnext |
| `color-focus` | core, vnext |
| `color-focus-inverted` | core, vnext |
| `color-focus-static` | core, vnext |
| `color-focus-static-inverted` | core, vnext |

## One concept, several roles - 22 (6 across families)

Grouped by what the name says the thing is - modifiers, slot, state - with sub-elements
dropped. A shade apart is a difference two components can honestly have; a family apart is
one concept painted as a fill in one widget and as a border in the next. Listed first are
the ones where every role resolves to the SAME colour in both modes - the same paint under
several names, free to unify and, until then, repainted differently by the next redesign.

- **invalid bg rest** - 6 roles, 3 families
    - **one colour, 3 names** (#c50f1f / #e4554f): `color-bg-danger-shared`, `color-content-danger-shared`, `color-border-danger-shared`
    - checkBox: `color-bg-danger-shared`  (scss/widgets/fluent-next/checkBox/_colors.scss:34)
    - checkBox: `color-content-danger-shared`  (scss/widgets/fluent-next/checkBox/_colors.scss:38)
    - common: `color-bg-danger-shared`  (scss/widgets/fluent-next/common/_colors.scss:27)
    - gridBase: `color-bg-danger-subtler`  (scss/widgets/fluent-next/gridBase/_colors.scss:24)
    - progressBar: `color-bg-danger`  (scss/widgets/fluent-next/progressBar/_colors.scss:9)
    - radioButton: `color-border-danger-shared`  (scss/widgets/fluent-next/radioButton/_colors.scss:19)
    - slider: `color-border-danger`  (scss/widgets/fluent-next/slider/_colors.scss:9)
- **invalid bg hovered** - 4 roles, 3 families
    - **one colour, 3 names** (#9d0013 / #ee726a): `color-bg-danger-shared-hovered`, `color-content-danger-shared-hovered`, `color-border-danger-shared-hovered`
    - checkBox: `color-bg-danger-shared-hovered`  (scss/widgets/fluent-next/checkBox/_colors.scss:35)
    - checkBox: `color-content-danger-shared-hovered`  (scss/widgets/fluent-next/checkBox/_colors.scss:39)
    - radioButton: `color-border-danger-shared-hovered`  (scss/widgets/fluent-next/radioButton/_colors.scss:20)
    - slider: `color-border-danger`  (scss/widgets/fluent-next/slider/_colors.scss:10)
- **invalid bg focused** - 3 roles, 3 families, **one colour under several names**
    - **one colour, 3 names** (#76000b / #9d0013): `color-bg-danger-shared-active`, `color-content-danger-shared-active`, `color-border-danger-shared-active`
    - checkBox: `color-bg-danger-shared-active`  (scss/widgets/fluent-next/checkBox/_colors.scss:36)
    - checkBox: `color-content-danger-shared-active`  (scss/widgets/fluent-next/checkBox/_colors.scss:40)
    - radioButton: `color-border-danger-shared-active`  (scss/widgets/fluent-next/radioButton/_colors.scss:21)
- **accent border rest** - 3 roles, 2 families
    - diagram: `color-content-primary`  (scss/widgets/fluent-next/diagram/_colors.scss:24)
    - gantt: `color-border-primary`  (scss/widgets/fluent-next/gantt/_colors.scss:25)
    - scheduler: `color-border`  (scss/widgets/fluent-next/scheduler/_colors.scss:8)
- **base bg rest** - 3 roles, 2 families
    - list: `color-border-subtle`  (scss/widgets/fluent-next/list/_colors.scss:32)
    - scheduler: `color-bg-primary-subtle`  (scss/widgets/fluent-next/scheduler/_colors.scss:12)
    - stepper: `color-bg`  (scss/widgets/fluent-next/stepper/_colors.scss:17)
- **menu bg rest** - 2 roles, 2 families
    - list: `color-bg`  (scss/widgets/fluent-next/list/_colors.scss:22)
    - menu: `color-bg`  (scss/widgets/fluent-next/menu/_colors.scss:3)
    - menu: `color-border-subtle`  (scss/widgets/fluent-next/menu/_colors.scss:11)
- **base content rest** - 2 roles, 1 family
    - diagram: `color-content-subtle`  (scss/widgets/fluent-next/diagram/_colors.scss:21)
    - stepper: `color-content`  (scss/widgets/fluent-next/stepper/_colors.scss:25)
- **empty content rest** - 2 roles, 1 family
    - cardView: `color-content-subtle`  (scss/widgets/fluent-next/cardView/_colors.scss:178)
    - chat: `color-content`  (scss/widgets/fluent-next/chat/_colors.scss:37)
    - chat: `color-content-subtle`  (scss/widgets/fluent-next/chat/_colors.scss:39)
- **error bg rest** - 2 roles, 1 family
    - gridBase: `color-bg-danger`  (scss/widgets/fluent-next/gridBase/_colors.scss:37)
    - informer: `color-bg-danger-subtler`  (scss/widgets/fluent-next/informer/_colors.scss:4)
    - toast: `color-bg-danger`  (scss/widgets/fluent-next/toast/_colors.scss:11)
- **error content rest** - 2 roles, 1 family
    - gridBase: `color-content-static-dark`  (scss/widgets/fluent-next/gridBase/_colors.scss:35)
    - gridBase: `color-content-danger`  (scss/widgets/fluent-next/gridBase/_colors.scss:79)
    - informer: `color-content-danger`  (scss/widgets/fluent-next/informer/_colors.scss:3)
    - toast: `color-content-static-dark`  (scss/widgets/fluent-next/toast/_colors.scss:13)
- **highlighted bg rest** - 2 roles, 1 family
    - cardView: `color-bg-highlight`  (scss/widgets/fluent-next/cardView/_colors.scss:168)
    - htmlEditor: `color-bg-primary-alpha-active`  (scss/widgets/fluent-next/htmlEditor/_colors.scss:15)
- **info content rest** - 2 roles, 1 family
    - informer: `color-content`  (scss/widgets/fluent-next/informer/_colors.scss:5)
    - pagination: `color-content-subtle`  (scss/widgets/fluent-next/pagination/_colors.scss:14)
    - toast: `color-content`  (scss/widgets/fluent-next/toast/_colors.scss:5)
- **invalid border focused** - 2 roles, 1 family
    - calendar: `color-border-danger`  (scss/widgets/fluent-next/calendar/_colors.scss:18)
    - checkBox: `color-border-danger-shared-active`  (scss/widgets/fluent-next/checkBox/_colors.scss:32)
    - switch: `color-border-danger`  (scss/widgets/fluent-next/switch/_colors.scss:24)
- **invalid border hovered** - 2 roles, 1 family
    - checkBox: `color-border-danger-shared-hovered`  (scss/widgets/fluent-next/checkBox/_colors.scss:31)
    - switch: `color-border-danger`  (scss/widgets/fluent-next/switch/_colors.scss:23)
- **invalid border rest** - 2 roles, 1 family
    - calendar: `color-border-danger`  (scss/widgets/fluent-next/calendar/_colors.scss:17)
    - checkBox: `color-border-danger-shared`  (scss/widgets/fluent-next/checkBox/_colors.scss:30)
    - switch: `color-border-danger`  (scss/widgets/fluent-next/switch/_colors.scss:22)
- **invalid content rest** - 2 roles, 1 family
    - common: `color-content-static-dark`  (scss/widgets/fluent-next/common/_colors.scss:28)
    - fieldset: `color-content-danger`  (scss/widgets/fluent-next/fieldset/_colors.scss:4)
    - fileUploader: `color-content-danger`  (scss/widgets/fluent-next/fileUploader/_colors.scss:12)
    - stepper: `color-content-danger`  (scss/widgets/fluent-next/stepper/_colors.scss:36)
- **inverted content rest** - 2 roles, 1 family
    - fileManager: `color-content-static-dark`  (scss/widgets/fluent-next/fileManager/_colors.scss:47)
    - list: `color-content-static-dark`  (scss/widgets/fluent-next/list/_colors.scss:37)
    - scheduler: `color-content-inverted`  (scss/widgets/fluent-next/scheduler/_colors.scss:55)
- **menu icon rest** - 2 roles, 1 family
    - contextMenu: `color-content-subtle`  (scss/widgets/fluent-next/contextMenu/_colors.scss:4)
    - filterBuilder: `color-content`  (scss/widgets/fluent-next/filterBuilder/_colors.scss:36)
- **menu shadow rest** - 2 roles, 1 family
    - contextMenu: `box-shadow-md`  (scss/widgets/fluent-next/contextMenu/_colors.scss:5)
    - list: `color-shadow-ambient`  (scss/widgets/fluent-next/list/_colors.scss:23)
- **success content rest** - 2 roles, 1 family
    - gridBase: `color-content-success`  (scss/widgets/fluent-next/gridBase/_colors.scss:81)
    - toast: `color-content-static-dark`  (scss/widgets/fluent-next/toast/_colors.scss:17)
- **text content focused** - 2 roles, 1 family
    - filterBuilder: `color-content-static-dark`  (scss/widgets/fluent-next/filterBuilder/_colors.scss:7)
    - textEditor: `color-content-primary`  (scss/widgets/fluent-next/textEditor/_colors.scss:33)
- **text content rest** - 2 roles, 1 family
    - cardView: `color-content`  (scss/widgets/fluent-next/cardView/_colors.scss:22)
    - diagram: `color-content-subtle`  (scss/widgets/fluent-next/diagram/_colors.scss:25)
    - textEditor: `color-content`  (scss/widgets/fluent-next/textEditor/_colors.scss:3)

## Text on its own background, below AA - 2 of 60 measured pairs

Only pairs the bundle puts in one rule, so no assumption about which surface a text sits
on. A row that passes in light and fails in dark is the case nothing else can see: the
etalons are all .light and the axe rule reads text only.

Both thresholds matter and the report does not pick for you: 4.5:1 for text, 3:1 for a
glyph or a control boundary. A checkmark at 3.36 passes as a graphic; the same number under
a menu label does not.

| Selector | Text | On | Light | Dark |
|---|---|---|---|---|
| `.dx-messagelist-context-menu-content .dx-menu-item:has(.dx-icon-trash).dx-state-focused` | `color-content-danger` | `color-bg-hovered` | 5.56 | 3.05 ⚠ |
| `.dx-field-value.dx-attention::before` | `color-content-static-dark` | `color-bg-danger-shared` | 6.07 | 3.68 ⚠ |

## A glyph left behind by its own state - 18 of 44 cross-state pairs

The table above can only measure a foreground and a background written in one rule. A state
ladder never writes them together: the focused rule repaints the fill and leaves the glyph
to the rest rule. These rows pair the two by element, with the state classes stripped, so
the checked box is never matched against an unchecked one.

Two thresholds, as above: 4.5:1 if the foreground is a label, 3:1 if it is a glyph or a
boundary (WCAG 1.4.11, which no axe rule implements and no screenshot can see). A single
warning marks a row under 4.5, a double one a row under 3.

| Selector | Glyph | On the state fill | Light | Dark |
|---|---|---|---|---|
| `.dx-checkbox-checked.dx-state-active .dx-checkbox-icon` | `color-content-inverted` | `color-bg-primary-shared-active` | 11.17 | 2.31 ⚠⚠ |
| `.dx-button-mode-outlined.dx-button-default.dx-state-active` | `color-content-primary` | `color-bg-primary-subtler-active` | 2.94 ⚠⚠ | 4.79 |
| `.dx-button-mode-outlined.dx-button-success.dx-state-active` | `color-content-success` | `color-bg-success-subtler-active` | 3.02 ⚠ | 4.75 |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-active` | `color-content-danger` | `color-bg-danger-subtler-active` | 3.18 ⚠ | 5.01 |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-selected` | `color-content-danger` | `color-bg-danger-subtler-selected` | 3.78 ⚠ | 3.22 ⚠ |
| `.dx-button-mode-outlined.dx-button-success.dx-state-selected` | `color-content-success` | `color-bg-success-subtler-selected` | 3.51 ⚠ | 3.23 ⚠ |
| `.dx-button-mode-outlined.dx-button-default.dx-state-selected` | `color-content-primary` | `color-bg-primary-subtler-selected` | 3.45 ⚠ | 3.35 ⚠ |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-hover` | `color-content-danger` | `color-bg-danger-subtler-hovered` | 4.43 ⚠ | 3.92 ⚠ |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-focused` | `color-content-danger` | `color-bg-danger-subtler-hovered` | 4.43 ⚠ | 3.92 ⚠ |
| `.dx-button-mode-outlined.dx-button-default.dx-state-hover` | `color-content-primary` | `color-bg-primary-subtler-hovered` | 4.02 ⚠ | 4.11 ⚠ |
| `.dx-button-mode-outlined.dx-button-default.dx-state-focused` | `color-content-primary` | `color-bg-primary-subtler-hovered` | 4.02 ⚠ | 4.11 ⚠ |
| `.dx-button-mode-outlined.dx-button-success.dx-state-hover` | `color-content-success` | `color-bg-success-subtler-hovered` | 4.04 ⚠ | 4.03 ⚠ |
| `.dx-button-mode-outlined.dx-button-success.dx-state-focused` | `color-content-success` | `color-bg-success-subtler-hovered` | 4.04 ⚠ | 4.03 ⚠ |
| `.dx-button.dx-button-success.dx-state-hover` | `color-content-static-dark` | `color-bg-success-hovered` | 7.53 | 4.18 ⚠ |
| `.dx-button.dx-button-success.dx-state-focused` | `color-content-static-dark` | `color-bg-success-hovered` | 7.53 | 4.18 ⚠ |
| `.dx-button.dx-button-default.dx-state-hover` | `color-content-static-dark` | `color-bg-primary-hovered` | 7.82 | 4.21 ⚠ |
| `.dx-button.dx-button-default.dx-state-focused` | `color-content-static-dark` | `color-bg-primary-hovered` | 7.82 | 4.21 ⚠ |
| `.dx-step.dx-state-hover.dx-step-completed .dx-step-indicator` | `color-content-static-dark` | `color-bg-primary-hovered` | 7.82 | 4.21 ⚠ |

## States that resolve to one role - 22

A state in the name that the eye cannot find. `focused` reusing `hovered` is accepted -
the foundation has no focused state - and is not listed; everything below is a ladder the
design system ships and the theme does not climb.

| Where | Slot | Role | States sharing it | Rung the system ships and we skip |
|---|---|---|---|---|
| scss/widgets/fluent-next/button/_colors.scss:56 | `button-danger-contained-content` | ds.$color-content-static-dark | `rest`, `selected` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/button/_colors.scss:72 | `button-danger-outlined-content` | ds.$color-content-danger-hovered | `hovered`, `selected` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/button/_colors.scss:31 | `button-default-contained-content` | ds.$color-content-static-dark | `rest`, `selected` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/button/_colors.scss:108 | `button-default-outlined-content` | ds.$color-content-primary-hovered | `hovered`, `selected` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/button/_colors.scss:114 | `button-default-text-content` | ds.$color-content-primary-hovered | `hovered`, `selected` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/button/_colors.scss:13 | `button-normal-contained-content` | ds.$color-content | `rest`, `selected` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/button/_colors.scss:81 | `button-success-contained-content` | ds.$color-content-static-dark | `rest`, `selected` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/button/_colors.scss:97 | `button-success-outlined-content` | ds.$color-content-success-hovered | `hovered`, `selected` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/calendar/_colors.scss:17 | `calendar-invalid-border` | ds.$color-border-danger | `focused`, `rest` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/chat/_colors.scss:59 | `chat-message-list-context-menu-delete-button-content` | ds.$color-content-danger | `focused`, `rest` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/checkBox/_colors.scss:42 | `check-box-border` | ds.$color-border-disabled | `disabled`, `read-only` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/fileManager/_colors.scss:14 | `file-manager-file-item-select-bg` | ds.$color-bg-primary | `focused`, `rest` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/fileManager/_colors.scss:13 | `file-manager-file-item-select-content` | ds.$color-content-inverted | `focused`, `rest` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/list/_colors.scss:17 | `list-item-bg` | ds.$color-bg-active | `active`, `selected-focused` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/lookup/_colors.scss:3 | `lookup-icon` | ds.$color-content-subtle | `active`, `rest` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/radioButton/_colors.scss:23 | `radio-button-content` | ds.$color-content-disabled | `disabled`, `read-only` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/slider/_colors.scss:9 | `slider-invalid-bg` | ds.$color-border-danger | `hovered`, `rest` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/switch/_colors.scss:22 | `switch-invalid-border` | ds.$color-border-danger | `focused`, `hovered`, `rest` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/tabs/variables/_colors.scss:3 | `tabs-tab-content` | ds.$color-content | `rest`, `selected` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/tagBox/_colors.scss:3 | `tag-box-tag-content` | ds.$color-content | `active`, `rest` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/textEditor/_colors.scss:28 | `text-editor-border` | ds.$color-border-disabled | `disabled`, `read-only` | none - the system has no role for the second state either |
| scss/widgets/fluent-next/treeView/_colors.scss:4 | `tree-view-content` | ds.$color-content | `focused`, `rest` | none - the system has no role for the second state either |

## The slot does not match the property it paints - 10

Read out of the built bundle, so this is what the browser gets, not what the name claims.
Most are the name and not the role: fourteen filterBuilder `-content` variables reach base as
`button-color()`, which sets `background-color`, and the bg roles they carry were right all
along. Two idioms are deliberate and stay - a hairline drawn with `background-color` keeps its
border role, and a value that paints two properties is named after the dominant one (rule 5).

| Where | Variable | Reads | Slot says | Actually paints |
|---|---|---|---|---|
| scss/widgets/fluent-next/colorView/_colors.scss:3 | `color-view-border` | ds.$color-border | `border` (border) | `box-shadow` |
| scss/widgets/fluent-next/colorView/_colors.scss:8 | `color-view-border-disabled` | ds.$color-border-disabled | `border` (border) | `box-shadow` |
| scss/widgets/fluent-next/diagram/_colors.scss:61 | `diagram-selection-bg` | ds.$color-border-contrast | `bg` (bg) | `fill` |
| scss/widgets/fluent-next/gantt/_colors.scss:22 | `gantt-content` | ds.$color-content | `content` (content) | `background-color`, `border-color`, `border-left-color`, `border-top-color` |
| scss/widgets/fluent-next/gridBase/_colors.scss:44 | `grid-border-focused` | ds.$color-border-primary | `border` (border) | `background-color` |
| scss/widgets/fluent-next/radioButton/_colors.scss:27 | `radio-button-content-read-only` | ds.$color-content-disabled | `content` (content) | `background-color`, `border-color` |
| scss/widgets/fluent-next/slider/_colors.scss:7 | `slider-accent-content-focused` | ds.$color-bg-primary-active | `content` (content) | `background`, `border-color` |
| scss/widgets/fluent-next/slider/_colors.scss:11 | `slider-invalid-content-focused` | ds.$color-border-danger | `content` (content) | `background-color`, `border-color` |
| scss/widgets/fluent-next/splitterBar/_colors.scss:3 | `splitter-bar-border` | ds.$color-border | `border` (border) | `background-color` |
| scss/widgets/fluent-next/splitterBar/_colors.scss:6 | `splitter-bar-border-disabled` | ds.$color-border-disabled | `border` (border) | `background-color` |

## Typography off the role grid - 16 of 47 step reads

The role grid names no step with this value, so the theme reads the base scale directly.
Each line is a choice: move onto the nearest role (the value changes, etalons follow), ask
the package for a role at this step, or record the value as a deliberate divergence.

| Where | Variable | Reads | Marker | Nearest roles |
|---|---|---|---|---|
| scss/widgets/fluent-next/chat/_sizes.scss:102 | `chat-message-list-empty-message-font-size` | `font-size-180` | `no-semantic-role` | `base-lg` (160), `title-sm` (160), `title-md` (200) |
| scss/widgets/fluent-next/diagram/_sizes.scss:94 | `diagram-popup-close-icon-line-height` | `line-height-120` | `icon-glyph-size` | `caption-sm` (140), `base-xs` (140), `caption-md` (160) |
| scss/widgets/fluent-next/fileManager/_sizes.scss:65 | `file-manager-progress-title-font-size` | `font-size-180` | `no-semantic-role` | `base-lg` (160), `title-sm` (160), `title-md` (200) |
| scss/widgets/fluent-next/gridBase/_sizes.scss:32 | `grid-header-line-height` | `line-height-180` | `no-semantic-role` | `caption-md` (160), `base-sm` (160), `caption-lg` (200) |
| scss/widgets/fluent-next/pagination/_sizes.scss:9 | `pagination-page-line-height` | `line-height-120` | `no-semantic-role` | `caption-sm` (140), `base-xs` (140), `caption-md` (160) |
| scss/widgets/fluent-next/pivotGrid/_sizes.scss:17 | `pivot-grid-indicators-line-height` | `line-height-120` | `no-semantic-role` | `caption-sm` (140), `base-xs` (140), `caption-md` (160) |
| scss/widgets/fluent-next/scheduler/_sizes.scss:44 | `scheduler-appointment-10min-title-line-height` | `line-height-120` | `no-semantic-role` | `caption-sm` (140), `base-xs` (140), `caption-md` (160) |
| scss/widgets/fluent-next/scheduler/_sizes.scss:127 | `scheduler-appointment-15min-title-line-height` | `line-height-180` | `no-semantic-role` | `caption-md` (160), `base-sm` (160), `caption-lg` (200) |
| scss/widgets/fluent-next/scheduler/_sizes.scss:146 | `scheduler-appointment-tooltip-date-font-size` | `font-size-110` | `no-semantic-role` | `caption-sm` (100), `base-xs` (100), `caption-md` (120) |
| scss/widgets/fluent-next/scheduler/_sizes.scss:175 | `scheduler-appointment-15min-title-line-height` | `line-height-120` | `no-semantic-role` | `caption-sm` (140), `base-xs` (140), `caption-md` (160) |
| scss/widgets/fluent-next/scheduler/_sizes.scss:229 | `scheduler-appointment-icon-font-size` | `font-size-180` | `icon-glyph-size` | `base-lg` (160), `title-sm` (160), `title-md` (200) |
| scss/widgets/fluent-next/scheduler/_sizes.scss:266 | `scheduler-appointment-content-details-font-size` | `font-size-110` | `no-semantic-role` | `caption-sm` (100), `base-xs` (100), `caption-md` (120) |
| scss/widgets/fluent-next/scheduler/_sizes.scss:288 | `scheduler-group-header-agenda-font-size` | `font-size-180` | `no-semantic-role` | `base-lg` (160), `title-sm` (160), `title-md` (200) |
| scss/widgets/fluent-next/scheduler/_sizes.scss:308 | `scheduler-time-indicator-font-size` | `font-size-300` | `no-semantic-role` | `headline-md` (280), `headline-lg` (320), `title-lg` (240) |
| scss/widgets/fluent-next/typography/_sizes.scss:38 | `typography-s-font-size` | `font-size-180` | **none** | `base-lg` (160), `title-sm` (160), `title-md` (200) |
| scss/widgets/fluent-next/validation/_sizes.scss:25 | `validation-message-line-height` | `line-height-120` | `no-semantic-role` | `caption-sm` (140), `base-xs` (140), `caption-md` (160) |

### A role names this step and the theme reads the step anyway - 31

| Where | Variable | Reads | Marker | Role with this step |
|---|---|---|---|---|
| scss/widgets/fluent-next/cardView/_sizes.scss:188 | `card-view-card-header-font-size` | `font-size-160` | **none** | `base-lg`, `title-sm` |
| scss/widgets/fluent-next/cardView/_sizes.scss:270 | `card-view-card-header-font-size` | `font-size-140` | **none** | `caption-lg`, `base-md`, `title-xs` |
| scss/widgets/fluent-next/chat/_sizes.scss:112 | `chat-file-icon-font-size` | `font-size-200` | `icon-glyph-size` | `title-md` |
| scss/widgets/fluent-next/chat/_sizes.scss:138 | `chat-message-list-empty-message-font-size` | `font-size-140` | `no-semantic-role` | `caption-lg`, `base-md`, `title-xs` |
| scss/widgets/fluent-next/chat/_sizes.scss:148 | `chat-file-icon-font-size` | `font-size-160` | `icon-glyph-size` | `base-lg`, `title-sm` |
| scss/widgets/fluent-next/checkBox/_sizes.scss:5 | `check-box-icon-font-size` | `font-size-160` | `icon-glyph-size` | `base-lg`, `title-sm` |
| scss/widgets/fluent-next/diagram/_sizes.scss:93 | `diagram-popup-close-icon-font-size` | `font-size-120` | `icon-glyph-size` | `caption-md`, `base-sm` |
| scss/widgets/fluent-next/fileUploader/_sizes.scss:22 | `file-uploader-file-icon-font-size` | `font-size-200` | `icon-glyph-size` | `title-md` |
| scss/widgets/fluent-next/fileUploader/_sizes.scss:31 | `file-uploader-file-icon-font-size` | `font-size-160` | `icon-glyph-size` | `base-lg`, `title-sm` |
| scss/widgets/fluent-next/gallery/_sizes.scss:8 | `gallery-nav-icon-font-size` | `font-size-320` | `icon-glyph-size` | `headline-lg` |
| scss/widgets/fluent-next/gridBase/_sizes.scss:168 | `grid-column-chooser-title-font-size` | `font-size-160` | **none** | `base-lg`, `title-sm` |
| scss/widgets/fluent-next/scheduler/_sizes.scss:45 | `scheduler-appointment-10min-icon-font-size` | `font-size-120` | `icon-glyph-size` | `caption-md`, `base-sm` |
| scss/widgets/fluent-next/scheduler/_sizes.scss:50 | `scheduler-appointment-15min-icon-font-size` | `font-size-120` | `icon-glyph-size` | `caption-md`, `base-sm` |
| scss/widgets/fluent-next/scheduler/_sizes.scss:61 | `scheduler-appointment-month-font-size` | `font-size-120` | **none** | `caption-md`, `base-sm` |
| scss/widgets/fluent-next/scheduler/_sizes.scss:62 | `scheduler-workspace-info-font-size` | `font-size-160` | **none** | `base-lg`, `title-sm` |
| scss/widgets/fluent-next/scheduler/_sizes.scss:98 | `scheduler-appointment-tooltip-date-font-size` | `font-size-140` | `no-semantic-role` | `caption-lg`, `base-md`, `title-xs` |
| scss/widgets/fluent-next/scheduler/_sizes.scss:302 | `scheduler-appointment-month-text-font-size` | `font-size-120` | **none** | `caption-md`, `base-sm` |
| scss/widgets/fluent-next/scheduler/_sizes.scss:310 | `scheduler-small-font-size` | `font-size-140` | **none** | `caption-lg`, `base-md`, `title-xs` |
| scss/widgets/fluent-next/scheduler/_sizes.scss:312 | `scheduler-month-date-text-font-size` | `font-size-160` | **none** | `base-lg`, `title-sm` |
| scss/widgets/fluent-next/scrollView/_sizes.scss:4 | `scroll-view-load-indicator-font-size` | `font-size-240` | `icon-glyph-size` | `title-lg`, `headline-sm` |
| scss/widgets/fluent-next/scrollView/_sizes.scss:12 | `scroll-view-pull-down-icon-font-size` | `font-size-240` | `icon-glyph-size` | `title-lg`, `headline-sm` |
| scss/widgets/fluent-next/tabs/variables/_sizes.scss:39 | `tabs-tab-nav-button-icon-font-size` | `font-size-200` | `icon-glyph-size` | `title-md` |
| scss/widgets/fluent-next/tabs/variables/_sizes.scss:48 | `tabs-tab-nav-button-icon-font-size` | `font-size-160` | `icon-glyph-size` | `base-lg`, `title-sm` |
| scss/widgets/fluent-next/typography/_sizes.scss:8 | `typography-xs-font-size` | `font-size-120` | **none** | `caption-md`, `base-sm` |
| scss/widgets/fluent-next/typography/_sizes.scss:36 | `typography-l-font-size` | `font-size-280` | **none** | `headline-md` |
| scss/widgets/fluent-next/typography/_sizes.scss:37 | `typography-m-font-size` | `font-size-200` | **none** | `title-md` |
| scss/widgets/fluent-next/typography/_sizes.scss:49 | `typography-xl-font-size` | `font-size-240` | **none** | `title-lg`, `headline-sm` |
| scss/widgets/fluent-next/typography/_sizes.scss:50 | `typography-l-font-size` | `font-size-200` | **none** | `title-md` |
| scss/widgets/fluent-next/typography/_sizes.scss:51 | `typography-m-font-size` | `font-size-160` | **none** | `base-lg`, `title-sm` |
| scss/widgets/fluent-next/typography/_sizes.scss:52 | `typography-s-font-size` | `font-size-140` | **none** | `caption-lg`, `base-md`, `title-xs` |
| scss/widgets/fluent-next/validation/_sizes.scss:18 | `validation-message-line-height` | `line-height-160` | `no-semantic-role` | `caption-md`, `base-sm` |

## No package counterpart - 16 folders

dateView, diagram, dropDownEditor, fileManager, fileUploader, filterBuilder, gantt, htmlEditor, pivotGrid, scheduler, slider, sortable, splitterBar, stepper, tileView, widget

These are the manual layer: no set describes them, so the role can only be judged by eye
against the light/dark pair, and a gap goes to design as a card.

