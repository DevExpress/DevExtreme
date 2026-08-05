/*
 * Regenerates tools/naming/registries.json — the single source of truth for the dxdsfluent
 * SCSS naming standard (scss/widgets/dxdsfluent/NAMING.md).
 *
 *   node tools/naming/derive-registries.mjs        # writes registries.json
 *   node tools/naming/derive-registries.mjs --check # fails if the committed file is stale
 *
 * Vocabularies that describe the design system (parts, states, sub-element anatomy) are DERIVED
 * from the generated token package, so they cannot drift from it. Judgment calls (component
 * exceptions, chassis dependents, rejected synonyms) live in OVERRIDES below and are reviewed as
 * code. Run `pnpm nx build:tokens devextreme-scss` first — this script reads generated output.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeDir = join(packageRoot, 'scss', 'widgets', 'dxdsfluent');
const componentTokens = join(packageRoot, 'scss', '_design-system', 'fluent', 'components', 'theme.scss');
const output = join(here, 'registries.json');

// ---------------------------------------------------------------------------------------------
// Judgment calls. Everything else in registries.json is derived.
// ---------------------------------------------------------------------------------------------

const OVERRIDES = {
  // folder -> component, only where kebab(folder) is not the component name
  components: {
    gridBase: 'grid', // shared grid chassis; matches the package's grid-cell / grid-row / grid-view family
    menuBase: 'menu', // shared chassis of menu / contextMenu / dropDownMenu
    icons: 'icon', // matches the package's icon-* family
  },

  /*
   * Folders that own no component: they are the system tier or bundle configuration.
   *
   * `typography/` is here rather than in `components` because there is no dxTypography widget: the
   * folder holds the theme's TYPE SCALE (xs…xl, heading-1…6) plus the `.dx-typography-*` utility
   * classes that publish it. Five folders read the scale, it describes no widget's anatomy, and
   * `typography` is a registered concern — the common/ criterion, satisfied without moving anything.
   * Moving the declarations into common/ was tried and reverted: it pulled common/ earlier in the
   * load order and shifted `--dx-line-height` inside its :root block, i.e. it changed the emitted CSS.
   */
  systemFolders: ['common', 'typography'],

  // component -> folder that is allowed to declare it (O2: exactly one declaration home).
  // Only needed where more than one folder currently declares the component's variables.
  declarationHome: {
    grid: 'gridBase',
  },

  // O5: a chassis may be read by its dependents, and only for the chassis component's variables.
  // Dependents are widgets that literally render the chassis widget — not "whatever reads it today".
  chassis: {
    gridBase: {
      component: 'grid',
      dependents: ['dataGrid', 'treeList', 'pivotGrid', 'cardView'],
    },
    /*
     * The declaration home is `menu/`, not `menuBase/`: menu/ declares the whole $menu-* colour set
     * and menuBase/ consumes it (it declared exactly one name, which moved to menu/). The first
     * version of this registry had the direction backwards.
     */
    menu: {
      component: 'menu',
      dependents: ['menuBase', 'contextMenu', 'dropDownMenu'],
    },
    /*
     * Button is a chassis for its control metrics (height, icon size, icon margin): the dependents
     * below render real button affordances and must match Button pixel for pixel. The values used to
     * sit in the theme root, which hid the coupling — moving them here made it explicit.
     *
     * Watch the size of this list. If it keeps growing, that is evidence these three are not button
     * anatomy at all but global control metrics, and they belong in the `global` concern instead.
     */
    button: {
      component: 'button',
      /*
       * The exception is really per-READ, not per-folder: it applies when the reader paints the chassis
       * widget's OWN element. `buttonGroup` and `speedDialAction` ARE buttons; `scheduler` restyles a
       * real `.dx-button` in its dropdown-appointment block by feeding Button's text-mode palette into
       * `dx-button-flat-color-styling`, which is the same thing. `diagram` and `calendar` are NOT here:
       * they use Button's colours on SVG strokes and on calendar cells, i.e. on things that are not
       * buttons, and for those O4 applies — their own variable on the same token.
       *
       * The enforcer can only encode this per folder, so a folder goes in when its reads are of the
       * first kind, and this comment records which element justified it.
       */
      dependents: [
        'buttonGroup', 'chat', 'contextMenu', 'gridBase', 'htmlEditor', 'list', 'menu', 'menuBase',
        'pivotGrid', 'scheduler', 'speedDialAction', 'stepper', 'toolbar',
      ],
    },
    textEditor: {
      component: 'text-editor',
      /*
       * `gridBase` is in the list because a grid cell in edit mode IS a text editor: the grid has to
       * match the editor's input padding and the footprint of its invalid badge, or the cell jumps
       * when it turns into an editor.
       */
      dependents: [
        'textBox', 'textArea', 'numberBox', 'dateBox', 'dateRangeBox', 'selectBox',
        'autocomplete', 'lookup', 'tagBox', 'colorBox', 'dropDownBox', 'dropDownEditor',
        'dropDownList', 'gridBase',
      ],
    },
    /*
     * dropDownEditor is a base class in the widget hierarchy exactly as textEditor is — SelectBox,
     * Lookup, DateBox, ColorBox and TagBox all extend it — so the same reasoning applies. `gridBase`
     * is here for the same reason as above: a grid cell in edit mode renders a real drop-down editor.
     */
    dropDownEditor: {
      component: 'drop-down-editor',
      dependents: [
        'selectBox', 'lookup', 'dateBox', 'colorBox', 'dropDownBox', 'dropDownList', 'tagBox',
        'autocomplete', 'gridBase',
      ],
    },
  },

  /*
   * O4's counterpart: folder -> components it RENDERS, with the element that proves it. A read of a
   * component listed here is matching a widget the reader contains, not borrowing a value that
   * happened to look right. Everything not listed stays a violation.
   */
  embeds: {
    // .dx-toolbar-menu renders a real List; the toolbar's own buttons match its item height
    toolbar: ['list'],
    // .dx-scheduler-dropdown-appointments renders a List, the header a Toolbar, the appointment
    // tooltip a Tooltip, and the recurrence editor real radio groups
    scheduler: ['list', 'toolbar', 'tooltip', 'radio-group'],
    // the column chooser is a Popup, its message a menu item, the revert tooltip a validation message
    gridBase: ['popup', 'menu', 'validation'],
    // .dx-htmleditor-toolbar is a Toolbar, the image dialog a Popup with a FileUploader inside
    'html-editor': ['toolbar', 'popup', 'file-uploader', 'text-editor'],
    htmlEditor: ['toolbar', 'popup', 'file-uploader', 'text-editor'],
    // the confirmation dialog is a Popup, the message box a text editor
    chat: ['popup', 'text-editor'],
    // a fieldset field is whatever control it wraps: checkBox, switch, slider or a form label
    fieldset: ['check-box', 'switch', 'slider', 'form'],
    /*
     * List items render real check boxes and radio buttons in selection modes, and
     * `.dx-list-with-search` puts a real TextBox above them — the scroll area's height is computed
     * from that editor's min-height.
     */
    list: ['check-box', 'radio-button', 'text-editor'],
    // the colour box's drop-down content IS a ColorView
    colorBox: ['color-view'],
    // the field chooser's tree is a TreeView
    pivotGrid: ['tree-view'],
    // the pager sits inside the grid's chrome and aligns with its cell padding
    pagination: ['grid'],
    // gantt renders the grid's tree list on the left and form labels in its dialogs
    gantt: ['grid', 'form'],
    // a range slider is two slider handles
    rangeSlider: ['slider'],
    // .dx-scrollview wraps a Scrollable
    scrollView: ['scrollable'],
    // the validation message is positioned against the editor it belongs to
    validation: ['text-editor'],
    filterBuilder: ['text-editor'],
    // the file manager's toolbar is a Toolbar
    fileManager: ['toolbar'],
    // the editor's spin buttons are real Buttons
    textEditor: ['button'],
  },

  // System-tier concerns (common/). Each must map to a non-component token family.
  systemConcerns: [
    // Foundation values shared by the whole theme: icon size, base font size, border radius/width.
    // Named `global` after the package's own family (--dxds-global-border-radius-default,
    // --dxds-global-color-focus, --dxds-global-spacing-item-gap-*). The obvious alternatives —
    // `typography`, `icon`, `widget` — all collide with a component name.
    'global',
    /*
     * `palette` is the ONE concern whose names carry no part and no state, because the value is
     * deliberately role-free. `common/_index.scss` exposes a complete 4x3 matrix of utility classes
     * — accent / text / bg / border-color, each applied as `color`, as `background-color` + `fill`,
     * and as `border-color` (.dx-theme-accent-as-border-color and friends). Giving such a value a
     * part would make the name lie in two roles out of three, and giving each role its own value
     * would break the contract those classes advertise: "this exact colour, used as X".
     * Values that turned out to have a single real role are NOT here — they became role-honest
     * names instead (typography colour -> $global-content-rest, the badge colours -> the badge
     * concerns below).
     */
    'palette',
    // Cross-cutting decorations several widgets draw but none of them owns — same class of thing as
    // `focus-rect`: the invalid/valid validation badges, drawn by a mixin in common/ and used by the
    // editor family plus fieldset.
    'invalid-badge',
    'valid-badge',
    'focus-rect', // ds.$focus-rect-color-*
    'shadow', // ds.$color-shadow-* / ds.$box-shadow-*
    'typography', // ds.$font-* / ds.$line-height-*
    'separator', // ds.$separator-color
    'backdrop', // ds.$color-surface-backdrop-*
    'surface', // ds.$color-surface-neutral-*
    'state', // ds.$opacity-* for disabled/readonly conventions
    'motion',
  ],

  // Bundle configuration and theme identity: exempt from the component-prefix rule.
  // They are string-concatenated into .dx-theme-marker, which themes.current() parses at runtime,
  // and named by build/bundle-template.dxdsfluent.scss (see GOTCHAS.md §5).
  themeIdentity: [
    '$color', '$mode', '$size', '$accent',
    '$fluent-color-accent-modificator', '$fluent-color-theme-modificator', '$fluent-size-postfix',
  ],

  // Folders exempt from the standard, with the reason recorded in NAMING.md.
  exemptFolders: {
    cardView: 'own cross-theme BEM system on null !default base variables; renaming it would '
      + 'require touching generic/material/fluent, which breaks the byte-identity constraint',
  },

  // Segments the package puts in the part slot that are NOT parts: they are variant or state
  // words leaking into it (upstream defects, see DIVERGENCES.md). Excluded from PARTS.
  partExclude: [
    'default', 'selected', 'hidden', 'invalid', 'range', 'pre', 'group', 'none', 'alt',
    'inverted', 'edge', 'center', 'disable', 'static', 'dragged', 'transparent',
  ],

  // Parts the package lacks a clean name for, or that the derivation below cannot recover.
  partsAdd: [
    'outline', // outline-color of a focus ring; the package models it as the focus-rect component
    // The derivation keeps only the last segment of the part slot, so these two collapse to `icon`.
    // Both exist in the package (8 tokens each), e.g. menu-item-color-selected-start-icon-active.
    'start-icon',
    'end-icon',
    /*
     * An opacity that branches on $mode has to live in _colors.scss (the only file with $mode in
     * scope), so `opacity` is a part as well as a size slot — resolved by file, like `content`.
     */
    'opacity',
    // Shadow *colors*: the package keeps them in the semantic tier (color-shadow-ambient / -key)
    // and its component tokens spell them box-shadow-layer-N-color, which has no part slot at all.
    'shadow',
    // A drop shadow is two paint slots, not one: the ambient layer and the key layer carry different
    // colours (ds.$color-shadow-ambient / -key). `rejected.parts` already redirected the legacy
    // color1/color2 spelling here.
    'shadow-ambient',
    'shadow-key',
  ],

  // A button inside another widget is a nested component (anatomy rule 3), not a part.
  partsRemove: ['button'],

  states: [
    'rest', 'hovered', 'active', 'focused',
    'selected', 'selected-hovered', 'selected-active', 'selected-focused',
    'disabled', 'read-only',
  ],

  modifiers: {
    // data-driven mode
    value: [
      'checked', 'unchecked', 'indeterminate', 'invalid', 'opened', 'expanded', 'collapsed',
      'empty', 'current', 'allday', 'recurrent', 'rtl', 'pending', 'modified', 'removed', 'alternation',
      // The DOM condition .dx-texteditor-with-label / .dx-texteditor-with-floating-label: an inner
      // label changes the input padding. It spans two labelMode values (static and floating), so no
      // single option value names it — the DOM class is the discoverable spelling.
      'with-label',
      // .dx-menu-item-has-icon: a menu item that reserves room for an icon
      'with-icon',
      // .dx-popup-title present: the content box loses the padding the title already provides
      'with-title',
      // Switch.value rendered as .dx-switch-on-value / -off-value, and the two label boxes inside
      'on', 'off',
      // RadioGroup.layout / Tabs.orientation and friends
      'horizontal', 'vertical',
      // .dx-device-phone: the phone-sized variant of a roller or item
      'phone',
      // Pagination.displayMode: 'compact' is what renders .dx-light-mode
      'compact',
      // Scheduler appointment variants: the short-layout flag and the duration steps behind
      // .dx-scheduler-appointment-has-resource / the 10..25-minute layouts
      'small', 'dragging', 'inverted', 'first-month', 'other-month',
      // calendar cell states drawn as classes, and the two htmlEditor overlay variants
      'contoured', 'faded', 'legacy',
      // `.dx-calendar-other-view` — a cell belonging to the neighbouring month
      'other',
      // the two step appearances Stepper draws, and the two treeView border variants
      'base', 'accent', 'with-border', 'border-visible',
      // .dx-list-slide-menu-button-delete vs -menu
      'delete', 'menu',
      // Chat's secondary cancel button, pivotGrid's sorted field, and the two/three-group cells
      'secondary', 'sorted', 'two', 'three',
      // `:first-child` — a DOM position, used where the first cell or page needs its own metric
      'first-child', 'first',
      // `.dx-position-indicator-last` — the drop indicator after the last field
      'last',
      // the middle dot of Chat's typing indicator, which is larger than the outer two
      'center',
      // `.dx-filemanager-progress-box-without-close-button`, and the drawer panel's initial width
      'without-close-button', 'initial',
      // Chat's message-group alignment, FileUploader.showFileList and its cancel-button position,
      // and Form's labelLocation
      'alignment-start', 'alignment-end', 'show-file-list', 'position-end', 'position-start',
      'location-left', 'location-right',
      '10min', '15min', '20min', '25min', 'adaptive', 'transparent',
      // More DOM/device conditions that change geometry, same class as with-label:
      'touch-friendly', // .dx-device-touch-friendly
      'adaptive', // adaptive layout of date/color pickers
      'with-clear', // the editor also shows a clear button
    ],
    // `type` option. Both `danger` (Button.type) and `error` (Toast.type) are here because the
    // rule is "the value the API uses", and the two widgets spell the same intent differently.
    intent: ['normal', 'default', 'danger', 'error', 'success', 'warning', 'info'],
    // `stylingMode` / `labelMode` / `mode` options
    appearance: [
      'contained', 'outlined', 'text', 'filled', 'underlined', 'floating', 'static',
      'hidden', // .dx-…-border-hidden: the collapsed-border variant of a grid
      'with-icons', // command column that also shows icons
      'outside', // labelMode: 'outside'
      'primary', 'secondary', // Tabs.stylingMode
      'thin', // the always-visible thin scrollbar variant base draws for showScrollbar
      // TabPanel.tabsPosition: which side the strip sits on decides which border faces the content.
      // The option value is used rather than a logical axis, because the side is a variant here, not
      // a property — and `left` under RTL is still the `left` value of the option.
      'top', 'bottom', 'left', 'right',
    ],
  },

  /*
   * Allowed slots in _sizes.scss: real CSS properties plus four abstract nouns (`size` = a square
   * width+height, `gap`, `offset`, `spacing`).
   *
   * This is a curated list, not the whole CSS spec, on purpose: `known-css-properties` is only a
   * transitive dependency of stylelint here, and adding it as a direct one would touch the shared
   * lockfile for a validation nicety. The list grows one entry at a time as components migrate, and
   * every addition is a reviewed diff — which is also what keeps physical axes out (`margin-left`
   * is a real CSS property but is deliberately absent, see the logical-axes rule in NAMING.md).
   */
  sizeSlots: [
    'size', 'gap', 'offset', 'spacing',
    /*
     * A one-dimensional decoration has a length and a thickness that map to width or height
     * depending on orientation — Tabs' selection indicator is set as `width` when the strip is
     * horizontal and as `height` when it is vertical, so a physical slot would lie in half the cases.
     * `min-size` is the square minimum of an element sized by min-width AND min-height together.
     */
    'length', 'thickness', 'min-size',
    // Chat lays its message rows out on a grid, and the theme owns the column template
    'grid-template-columns',
    'padding', 'padding-inline', 'padding-block',
    'padding-inline-start', 'padding-inline-end', 'padding-block-start', 'padding-block-end',
    'margin', 'margin-inline', 'margin-block',
    'margin-inline-start', 'margin-inline-end', 'margin-block-start', 'margin-block-end',
    'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
    'border', 'border-width', 'border-radius', 'border-style',
    'border-block-start', 'border-block-end',
    'border-inline-start', 'border-inline-end',
    'border-start-start-radius', 'border-start-end-radius',
    'border-end-start-radius', 'border-end-end-radius',
    'border-block-start-width', 'border-block-end-width',
    'inset-block-start', 'inset-block-end', 'inset-inline-start', 'inset-inline-end',
    'inset-inline', 'inset-block',
    // the blur length of a box-shadow, when a theme needs it apart from the composite
    'box-shadow-blur',
    'border-inline-start-width', 'border-inline-end-width',
    'font-size', 'font-weight', 'font-family', 'line-height', 'letter-spacing',
    'text-transform', 'text-decoration',
    'opacity', 'box-shadow', 'outline', 'outline-offset', 'outline-width',
    'column-gap', 'row-gap', 'z-index', 'transition', 'transform', 'inset',
  ],

  /*
   * Physical spellings that are only rejected in the SLOT position, i.e. as the last segment. The same
   * words are legal variants earlier in a name (`$tabs-tab-top-border` is TabPanel's tabsPosition,
   * `$slider-label-bottom-padding-block-end` is the label position), so a global replacement would
   * corrupt them.
   */
  rejectedTrailing: {
    // the box-model longhands have to be listed too: without them the bare `top` below matches
    // `margin-top` and turns it into `margin-inset-block-start`
    'margin-top': 'margin-block-start',
    'margin-bottom': 'margin-block-end',
    'margin-left': 'margin-inline-start',
    'margin-right': 'margin-inline-end',
    'padding-top': 'padding-block-start',
    'padding-bottom': 'padding-block-end',
    'padding-left': 'padding-inline-start',
    'padding-right': 'padding-inline-end',
    top: 'inset-block-start',
    bottom: 'inset-block-end',
    left: 'inset-inline-start',
    right: 'inset-inline-end',
    'border-top': 'border-block-start',
    'border-bottom': 'border-block-end',
    'border-left': 'border-inline-start',
    'border-right': 'border-inline-end',
    'border-top-width': 'border-block-start-width',
    'border-bottom-width': 'border-block-end-width',
    'border-left-width': 'border-inline-start-width',
    'border-right-width': 'border-inline-end-width',
    'border-top-left-radius': 'border-start-start-radius',
    'border-top-right-radius': 'border-start-end-radius',
    'border-bottom-left-radius': 'border-end-start-radius',
    'border-bottom-right-radius': 'border-end-end-radius',
  },

  /*
   * Segments that name nothing and are simply dropped. `root` and `element` mean "the widget's own
   * box", which the grammar expresses by having no sub-element at all; `state` is the `.dx-state-*`
   * class whose meaning the state suffix already carries; `common` and `renovation` are grouping and
   * implementation words with no DOM counterpart (base's `$datagrid-common-*` family is the same
   * thing).
   */
  droppedSegments: ['root', 'state', 'common', 'renovation'],

  /*
   * Squashed compounds, applied before anything else: the legacy names spell nested widgets and
   * multi-word boxes without hyphens (`treeview-item`, `contextmenu`, `numberbox`), and every one of
   * them has a canonical hyphenated form the registry already knows. Normalising here keeps the
   * registry free of the non-canonical spellings.
   */
  rejectedSpellings: {
    treeview: 'tree-view',
    contextmenu: 'context-menu',
    fileuploader: 'file-uploader',
    filemanager: 'file-manager',
    numberbox: 'number-box',
    textbox: 'text-box',
    datebox: 'date-box',
    checkbox: 'checkbox',
    viewmode: 'view-mode',
    messagelist: 'message-list',
    messagebox: 'message-box',
    messagegroup: 'message-group',
    typingindicator: 'typing-indicator',
    filename: 'file-name',
    falename: 'file-name',
    boxshadow: 'box-shadow',
    dropzone: 'drop-zone',
    pagesizes: 'page-sizes',
    pageindex: 'page-index',
    grouppanel: 'group-panel',
    alldaypanel: 'all-day-panel',
    colorview: 'color-view',
    colorbox: 'color-box',
    radiogroup: 'radio-group',
    radiobutton: 'radio-button',
    tabpanel: 'tab-panel',
    loadindicator: 'load-indicator',
    scrollview: 'scroll-view',
    searchbox: 'search-box',
    holdmenu: 'hold-menu',
    menucontent: 'menu-content',
    aidialog: 'ai-dialog',
    progressbar: 'progress-bar',
    progressbox: 'progress-box',
    // squashed in the legacy pivotGrid names; the trailing `color` then resolves like any other
    totalcolor: 'total-color',
    grandtotalcolor: 'grand-total-color',
    pivotgridfieldchooser: 'field-chooser',
    htmleditor: 'html-editor',
    speeddialaction: 'speed-dial-action',
    buttongroup: 'button-group',
    dropdownbutton: 'drop-down-button',
    dropdownmenu: 'drop-down-menu',
    tooltipbutton: 'tooltip-button',
  },

  // old spelling -> canonical. Drives the codemod and the failure messages of the enforcer.
  rejected: {
    parts: {
      background: 'bg',
      'background-color': 'bg',
      bgcolor: 'bg',
      fill: 'bg',
      'fill-color': 'bg',
      'border-color': 'border',
      bordercolor: 'border',
      'text-color': 'content',
      foreground: 'content',
      fg: 'content',
      'icon-color': 'icon',
      'glyph-color': 'icon',
      'shadow-color': 'shadow',
      color1: 'shadow-ambient',
      color2: 'shadow-key',
      // the same two layers, spelled out in pivotGrid and gridBase
      'first-shadow-color': 'shadow-ambient',
      'second-shadow-color': 'shadow-key',
      'shader-bg': 'backdrop',
      scrim: 'backdrop',
      'divider-color': 'separator',
      'handle-bg': 'trigger',
      'left-icon': 'start-icon',
      'right-icon': 'end-icon',
    },
    // A variant word the CSS class spells with a `mode-` prefix; the option value is the canonical one.
    modifiers: {
      'mode-contained': 'contained',
      'mode-outlined': 'outlined',
      'mode-text': 'text',
    },
    states: {
      hover: 'hovered',
      focus: 'focused',
      pressed: 'active',
      activated: 'active',
      readonly: 'read-only',
      idle: 'rest',
      'selected-hover': 'selected-hovered',
    },
    properties: {
      'horizontal-padding': 'padding-inline',
      'side-padding': 'padding-inline',
      'padding-horizontal': 'padding-inline',
      'vertical-padding': 'padding-block',
      'padding-vertical': 'padding-block',
      'padding-start': 'padding-inline-start',
      'padding-end': 'padding-inline-end',
      'padding-left': 'padding-inline-start',
      'padding-right': 'padding-inline-end',
      'padding-top': 'padding-block-start',
      'padding-bottom': 'padding-block-end',
      'horizontal-margin': 'margin-inline',
      'vertical-margin': 'margin-block',
      'margin-left': 'margin-inline-start',
      'margin-right': 'margin-inline-end',
      'margin-top': 'margin-block-start',
      'margin-bottom': 'margin-block-end',
      paddings: 'padding',
      margins: 'margin',
      radius: 'border-radius',
      rounding: 'border-radius',
      'border-size': 'border-width',
      'min-heigth': 'min-height', // upstream typo
      'text-size': 'font-size',
      'text-weight': 'font-weight',
      shadow: 'box-shadow',
      dimension: 'size',
    },
  },

  // Components whose variables already follow the standard. Only these are checked strictly;
  // everything else is compared against the known-violations snapshot. Grows one batch at a time.
  migrated: [
    'toast', 'button', 'text-editor',
    'text-box', 'text-area', 'number-box', 'date-box', 'date-range-box', 'select-box',
    'lookup', 'tag-box', 'color-box', 'drop-down-editor', 'drop-down-list',
    'grid', 'data-grid', 'tree-list',
    // waves C11-C12, the finished tails
    'switch', 'date-view', 'gallery',
    'typography', 'toolbar', 'overlay', 'informer', 'scroll-view', 'context-menu', 'fieldset',
    'menu', 'progress-bar', 'load-indicator', 'drop-down-menu',
    // wave C9, the small folders
    'accordion', 'action-sheet', 'box', 'button-group', 'load-panel', 'tile-view', 'validation',
    'tooltip', 'radio-button', 'scrollable', 'drop-down-button', 'badge', 'card', 'icon', 'popover',
    'splitter', 'splitter-bar', 'sortable', 'tab-panel',
  ],

  /*
   * DOM anatomy per component, filled at the moment the component migrates (reviewed diff).
   */
  // Names must not collide with a state; colliding with a part is fine (see assertParseable).
  subElements: {
    toast: ['content', 'icon', 'item', 'stack'],
    // .dx-icon and .dx-button-text are real boxes inside a button; `icon` is also a part, which
    // is allowed — the grammar resolves it by position (see assertParseable).
    button: ['icon', 'text', 'content'],
    'text-box': ['search', 'search-bar', 'icon'],
    // Wave C9: the small folders. Every word below is a DOM box of that widget (.dx-accordion-item-title,
    // .dx-actionsheet-item, .dx-tile, .dx-radio-value-container, …), not a re-spelling of a part.
    accordion: ['title', 'body', 'item', 'icon'],
    'action-sheet': ['item'],
    box: ['item', 'content'],
    'button-group': ['item'],
    'load-panel': ['content'],
    'tile-view': ['tile', 'wrapper'],
    validation: ['message', 'summary', 'summary-item', 'overlay'],
    tooltip: ['overlay', 'content', 'popup', 'arrow'],
    popover: ['popup', 'title'],
    splitter: ['resize-handle', 'icon'],
    'splitter-bar': ['icon'],
    sortable: ['clone', 'source', 'placeholder', 'placeholder-inside'],
    'tab-panel': ['tabs'],
    icon: ['pulldown'],
    'radio-button': ['icon', 'dot', 'value-container'],
    scrollable: ['scroll', 'scrollbar'],
    'drop-down-button': ['action', 'toggle', 'spindown-icon', 'icon', 'item'],
    /*
     * Wave C10. Every word is a DOM box of that widget, read off its selectors — `.dx-checkbox-icon`,
     * `.dx-list-item-ghost-…`, `.dx-pager .dx-page`, `.dx-toolbar-label`, `.dx-treeview-node`, and so
     * on. Compounds (`group-header`, `nav-button`, `pull-down`) are one anatomy level, not two.
     */
    'check-box': ['icon', 'mark', 'arrow', 'arrow-icon', 'container'],
    switch: ['handle', 'container', 'inner'],
    /*
     * `menu-items-container` sits next to `items-container` on purpose: base/_contextMenu.scss draws
     * `.dx-context-menu .dx-menu-items-container` with its own parameter, and contextMenu/_index.scss
     * draws the SAME element again with its own value, which wins on order. Two variables for one
     * padding, with different values — see DIVERGENCES.md.
     */
    'context-menu': ['item', 'items-container', 'menu-items-container', 'separator', 'content',
      'text'],
    'drop-down-menu': ['section', 'list', 'popup', 'content'],
    'date-view': ['roller', 'item', 'year', 'month', 'hours-colon'],
    'time-view': ['clock', 'digits', 'field', 'number-box', 'input', 'time-separator', 'spin',
      'format12'],
    fieldset: ['field', 'label', 'value', 'header', 'attention-icon', 'radio-group'],
    'radio-group': ['radio-button', 'collection', 'value-container'],
    'progress-bar': ['status', 'range', 'container', 'label'],
    menu: ['item', 'icon', 'text', 'separator', 'popup', 'tree-view', 'node', 'content', 'link'],
    slider: ['bar', 'handle', 'inner', 'track', 'tooltip', 'label', 'wrapper'],
    gallery: ['indicator', 'indicator-item', 'nav-button', 'nav-arrow', 'nav-icon', 'item',
      'button'],
    list: [
      'item', 'group', 'group-header', 'header-indicator', 'hold-menu', 'ghost', 'menu-button',
      'next-button', 'delete-button', 'select-all', 'select-all-separator', 'search-box', 'message',
      'badge-container', 'slide-menu', 'slide-menu-button', 'context-menu', 'context-menu-content',
      'items', 'toggle-delete', 'response-wait', 'separator',
    ],
    toolbar: ['item', 'label', 'separator', 'section', 'menu', 'group', 'button', 'text',
      'text-editor'],
    tabs: ['tab', 'item', 'icon', 'nav-button', 'content', 'badge'],
    'tree-view': [
      'item', 'item-element', 'node', 'checkbox', 'checkbox-container', 'container', 'toggle-item',
      'select-all-item', 'search-box', 'search-editor', 'load-indicator', 'spin', 'border',
      'control',
    ],
    popup: ['title', 'content', 'toolbar', 'toolbar-item', 'toolbar-label', 'dialog', 'message',
      'button'],
    pagination: ['page', 'page-index', 'pages-count', 'page-sizes', 'separator', 'nav-button',
      'navigate-button', 'nav', 'icon'],
    'scroll-view': ['pocket', 'pull-down', 'scroll-bottom', 'indicator', 'image', 'text', 'icon',
      'load-indicator'],
    // .dx-fa-button / .dx-fa-button-label are the real class names of the floating action button
    'speed-dial-action': ['main', 'button', 'label', 'fa-button', 'fa-button-label'],
    /*
     * Wave C16, the remaining composite widgets. Same rule as everywhere above: a word goes in only
     * if it is a DOM box of that widget. Words that turned out to be variants live in MODIFIERS, and
     * names carrying a physical `-left`/`-right` are left for the manual tail of each folder.
     */
    calendar: ['cell', 'header', 'week-day-header', 'week-number', 'week-number-cell', 'navigator',
      'footer-button', 'view', 'element'],
    chat: ['message-list', 'message-box', 'message', 'day-header', 'empty-view', 'avatar', 'bubble',
      'file', 'file-name', 'file-container', 'files-container', 'suggestions', 'editing-preview',
      'caption', 'delete-button', 'cancel-button', 'context-menu', 'icon', 'box', 'container',
      'alert-list', 'prompt', 'textarea', 'toolbar', 'information', 'author-name', 'timestamp',
      'typing-indicator', 'circle', 'bubble', 'group'],
    'color-view': ['palette', 'palette-cell', 'hue-scale', 'hue-scale-cell', 'alpha', 'controls',
      'container', 'label', 'handle', 'color-preview', 'preview', 'textbox', 'hex', 'overlay',
      'content-box', 'bg-box'],
    diagram: ['toolbar', 'toolbar-icon', 'toolbar-wrapper', 'title-toolbar', 'toolbox',
      'context-toolbox', 'target', 'properties-panel', 'canvas', 'format', 'item', 'text', 'icon',
      'image-icon', 'button', 'popup', 'title', 'content', 'load-indicator', 'loading-indicator',
      'palette', 'color-view', 'hue-scale-cell', 'shape', 'selection-mark', 'input-container',
      'accordion-item'],
    'filter-builder': ['group', 'group-content', 'item', 'item-value', 'text', 'icon', 'action-icon',
      'plus', 'plus-icon', 'remove', 'remove-icon', 'field', 'operation', 'operator', 'tree-view',
      'tree-view-item',
      'tree-view-node', 'toggle', 'toggle-item-visibility', 'editor', 'range-separator',
      'scrollable'],
    form: ['field-item', 'field-required', 'field-mark', 'label', 'label-icon', 'group',
      'group-caption', 'group-content', 'help', 'help-text', 'mark', 'layout-manager', 'tabpanel',
      'multiview', 'item', 'content', 'row', 'switch', 'caption-icon', 'custom-caption-icon'],
    /*
     * gantt's own class names are abbreviated upstream and the abbreviations are not documented
     * anywhere: `.dx-gantt-hb` / `-vb` are the two splitters, `.dx-gantt-tm` / `-ti` the time marker
     * and time indicator, `.dx-gantt-tPrg` the progress bar. They are registered as they are spelled
     * in the DOM — inventing readable expansions would break the link to the selector.
     */
    gantt: ['task', 'task-res', 'task-title', 'task-progress', 'task-wrapper', 'task-edit-wrapper',
      'edit-progress',
      'parent-task', 'collapsable-row', 'splitter-bar', 'toolbar', 'toolbar-wrapper',
      'toolbar-separator', 'title', 'view', 'row', 'si', 'hb', 'vb', 'tm', 'ti'],
    'html-editor': ['toolbar', 'table', 'variable', 'mention', 'resize', 'resize-frame', 'cover',
      'uploader', 'file-uploader', 'input-wrapper', 'wrapper', 'ai-dialog', 'content', 'icon', 'item',
      'highlighted-row', 'code-block', 'placeholder', 'size-editor', 'add-image-dialog', 'separator',
      'tabs', 'selects', 'title'],
    'pivot-grid': ['area', 'area-field', 'fields-area-head', 'fields-area-head-cell', 'field-chooser',
      'field', 'fields', 'expand-icon', 'row', 'column', 'cell', 'last-cell', 'header', 'headers',
      'drag-header', 'total', 'grand-total', 'filter', 'sort', 'icon', 'chevron', 'chevron-icon',
      'container', 'popup', 'content', 'search', 'item', 'text', 'border', 'box', 'toolbar', 'button',
      'position-indicator', 'tree-view', 'tree-view-item', 'tree-view-node', 'tree-view-search',
      'drag', 'checkbox', 'field-chooser-field', 'field-area-box', 'header-filter', 'indicators',
      'data-area'],
    stepper: ['step', 'step-indicator', 'step-label', 'label', 'connector', 'value', 'icon', 'text',
      'item', 'container'],
    'recurrence-editor': ['switch', 'repeat-end', 'item', 'container', 'label', 'until-date-box',
      'count-number-box', 'interval-number-box', 'number-box', 'button-group', 'radio-group'],
    /*
     * Wave C15, scheduler. Every word below is a `.dx-scheduler-*` DOM box (the legacy names were
     * built from those class names), with the compounds kept whole because that is how the class
     * reads: `.dx-scheduler-appointment-tooltip-buttons`, `.dx-scheduler-header-panel-cell`, … The
     * variant words that were mixed into the same position — `small`, the duration steps `10min`…
     * `25min`, `dragging`, `inverted`, `first-month`, `other-month` — are modifiers instead, and the
     * few names carrying a physical `-left`/`-right` are left for the manual tail.
     */
    scheduler: [
      'appointment', 'appointment-content', 'appointment-collector', 'appointment-tooltip',
      'appointment-popup', 'agenda', 'agenda-appointment', 'all-day-panel', 'all-day-table',
      'all-day-title', 'common-collector', 'cell', 'table-cell', 'date-table', 'date-table-cell',
      'time-panel', 'time-panel-cell', 'header', 'header-panel', 'header-panel-cell', 'header-day',
      'header-panel-time-cell', 'header-panel-day', 'group-header', 'group-header-table-cell',
      'group-separator', 'navigator', 'navigator-button', 'navigator-icon', 'toolbar', 'toolbar-item',
      'tooltip', 'tooltip-title', 'tooltip-date', 'tooltip-subject', 'tooltip-marker',
      'tooltip-content', 'tooltip-remove', 'workspace', 'workspace-month', 'workspace-info',
      'workspace-date-table-cell', 'workspace-month-cell', 'workspace-month-header',
      'workspace-month-timeline-time', 'timeline', 'timeline-date-table-cell', 'form', 'item',
      'icon', 'icon-container', 'title', 'details', 'short-content', 'subject', 'date', 'marker',
      'remove', 'strip', 'dropdown-button', 'dropdown-appointment', 'days-of-week-buttons',
      'repeat-end-item', 'all-day-item', 'month', 'recurrence', 'recurring', 'date-time-indicator',
      'separator', 'container', 'content', 'button', 'text', 'time', 'day', 'element', 'widget',
      'time-cell', 'cell-date', 'panel', 'body', 'layout', 'column', 'scrollable-content',
      'all-day-appointment', 'sidebar',
      'group', 'last-group-cell', 'views', 'views-empty-cell', 'views-time-panel', 'list',
      'list-item', 'reduced', 'drag-source', 'resizing', 'indicator', 'droppable-cell', 'overlay',
      'dd-appointment', 'start',
      'views-header', 'views-group-header', 'views-time-indicator', 'views-vertical-group',
      'resource-item', 'resource-value', 'virtual-row', 'empty-cell',
    ],
    /*
     * Wave C14, the file widgets. Compounds are one anatomy level: `progress-box` is
     * `.dx-filemanager-progress-box`, `thumbnails-item` is `.dx-filemanager-thumbnails-item` — the DOM
     * class of each is exactly the compound.
     */
    'file-manager': [
      'i-cancel', 'text-item', 'drop-zone-placeholder', 'progress-bold', 'close', 'context-menu',
      'file-uploader',
      'toolbar', 'toolbar-separator', 'toolbar-separator-item', 'toolbar-viewmode', 'file-toolbar',
      'breadcrumbs', 'breadcrumbs-item', 'dirs-panel', 'dirs-tree-item', 'drawer-panel',
      'file-item', 'file-item-select', 'file-actions-button', 'details-view', 'checkbox-column',
      'thumbnails', 'thumbnails-item', 'thumbnails-view-port', 'custom-thumbnail', 'spacer',
      'progress-panel', 'progress-box', 'progress-title', 'progress-bar', 'close-button',
      'large-icon', 'view-mode-button', 'tree-view-item', 'drop-zone-placeholder',
      'cancel-button', 'notification', 'container', 'separator', 'content', 'item', 'menu-item',
      'popup', 'overlay', 'editor', 'button', 'icon', 'text', 'title', 'image', 'placeholder',
      'drop-zone',
    ],
    'file-uploader': [
      'file', 'file-name', 'file-size', 'file-status-message', 'file-container', 'file-icon',
      'button', 'upload-button', 'cancel-button', 'progress-bar', 'status', 'message', 'label',
      'text', 'files-container', 'wrapper',
    ],
    /*
     * Wave C11 — the folder tails. `heading-N` and `xs…xl` are the steps of the type scale, an
     * enumerated entity, which the standard allows to carry an ordinal (NAMING.md, numeric segments);
     * the token package spells them the same way (font-size-heading-1, font-size-base-xs).
     */
    typography: ['heading-1', 'heading-2', 'heading-3', 'heading-4', 'heading-5', 'heading-6',
      'xs', 's', 'm', 'l', 'xl', 'link'],
    overlay: ['content'],
    informer: ['icon'],
    // `stop-N` are the three colours of one decorative gradient — again an enumerated entity.
    'load-indicator': ['segment', 'inner', 'sparkle', 'stop-1', 'stop-2', 'stop-3'],
    'text-area': ['content'],
    'number-box': ['spin', 'container', 'icon'],
    'date-box': [
      'overlay', 'item', 'popup', 'content', 'title', 'container', 'cell', 'button',
      'apply-button', 'input',
    ],
    'date-range-box': ['active-bar', 'custom-button', 'input'],
    'select-box': ['list'],
    lookup: ['field', 'search', 'arrow', 'popup', 'content'],
    'tag-box': ['tag', 'content', 'container', 'remove-button', 'select-all', 'list'],
    'color-box': ['preview', 'overlay', 'content', 'input', 'container', 'toolbar-item', 'icon'],
    'drop-down-editor': ['button', 'invalid-badge', 'list', 'icon'],
    grid: [
      'row', 'cell', 'header', 'group-row', 'master-detail', 'column-chooser', 'item', 'message',
      'ai-chat', 'drag-header', 'filter-row', 'filter-panel', 'summary', 'column-separator',
      'no-data', 'link', 'editor', 'search', 'chevron', 'icon', 'text-stub', 'selection',
      'draggable-column', 'header-filter', 'drop-highlight', 'text-link', 'icon-link',
      'checkbox', 'menu-item', 'header-panel', 'group-panel', 'command', 'edit', 'edit-column',
      'select-column', 'icon-container', 'filter-operation',
      'adaptive-column', 'tree-view', 'node', 'select-all', 'sort-index', 'error-message', 'popup',
      'overlay', 'revert-button', 'validation', 'input', 'progress-bar', 'prompt-editor', 'after',
      'lines', 'title', 'ai', 'operation', 'list', 'button', 'content', 'text', 'header-row',
    ],
    // dataGrid's own deltas on top of the chassis: the group panel and the edit-form buttons.
    // `group-panel-item` and `block-separator` are compounds — one anatomy level each, not two.
    'data-grid': [
      'group-panel', 'group-panel-item', 'block-separator', 'sort', 'group-row', 'sticky-column',
      'cell', 'form-buttons', 'error-message', 'filter-panel',
    ],
    'tree-list': [
      'chevron', 'icon', 'expand', 'node', 'empty-space', 'sticky-column', 'cell', 'form-buttons',
      'error-message',
    ],
    'text-editor': [
      'input', 'label', 'line', 'button', 'clear-button', 'spin-button', 'custom-button',
      'icon-container', 'invalid-badge',
    ],
  },
};

// ---------------------------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------------------------

const kebab = (folder) => folder.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const listFolders = (dir) => readdirSync(dir)
  .filter((entry) => statSync(join(dir, entry)).isDirectory())
  .sort();

const sortedUnique = (values) => [...new Set(values)].sort();

const stripState = (name, states) => {
  // longest match first, so `selected-hovered` wins over `selected`
  const ordered = [...states].sort((a, b) => b.length - a.length);
  for (const state of ordered) {
    if (name.endsWith(`-${state}`)) return { base: name.slice(0, -state.length - 1), state };
  }
  return { base: name, state: null };
};

const deriveFromTokens = (states) => {
  const names = [...readFileSync(componentTokens, 'utf8').matchAll(/--dxds-([a-z0-9-]+):/g)]
    .map((match) => match[1]);

  const parts = new Set();
  const packageElementPaths = new Set();

  names.forEach((name) => {
    const { base } = stripState(name, states);
    const marker = base.indexOf('-color-');
    if (marker === -1) return;
    const elementPath = base.slice(0, marker);
    const tail = base.slice(marker + '-color-'.length);
    packageElementPaths.add(elementPath);
    if (tail) parts.add(tail.split('-').pop());
  });

  return {
    tokenCount: names.length,
    parts: [...parts],
    packageElementPaths: [...packageElementPaths].sort(),
  };
};

/*
 * The grammar is positional, so the vocabularies do NOT all have to be disjoint:
 *
 *   $<component>(-<sub-element>)*(-<modifier>)*-<slot>(-<state>)
 *
 * Parsing is right-to-left with longest-match: the trailing state, then the slot, then the middle.
 * That resolves the overlaps that do exist on purpose — `text` is both a part (text color) and an
 * appearance modifier (stylingMode: 'text'), and `separator`/`backdrop`/`shadow` are both parts and
 * system concerns:
 *
 *   $button-text-bg-rest   -> modifier `text`  + slot `bg`      (slot is the position before state)
 *   $button-text-rest      -> slot `text`                        (no modifier present)
 *   $separator-border-rest -> concern `separator` + slot `border` (concern is the first segment)
 *   $button-separator-rest -> component `button` + slot `separator`
 *
 * Only overlaps between vocabularies competing for the SAME position are fatal, and there are two:
 *
 *   1. STATES ∩ PARTS = ∅       — the trailing state is matched first, so a part that is also a
 *      state word would be eaten as the state and the slot would go missing
 *   2. SUB_ELEMENTS ∩ STATES = ∅ — same reason, from the other side
 *
 * A sub-element that is also a PART or a MODIFIER is fine, and `toast` proves it: the DOM element is
 * `.dx-toast-content`, so `content` is both the name of that box and the part meaning "text colour".
 *
 *   $toast-content-padding-block  -> sub-element `content` + slot `padding-block`
 *   $toast-content-rest           -> slot `content` (the slot is mandatory and sits before the state)
 *
 * Both parse. Requiring sub-elements to avoid part names would have forced `body` on an element the
 * DOM calls `content`, which costs findability for no decidability gain. (This is the second time the
 * instinct "make all the vocabularies disjoint" turned out to be too strong — see NAMING.md.)
 */
const assertParseable = (parts, states, modifiers, subElements) => {
  const clash = (a, b) => a.filter((value) => b.includes(value));

  const stateParts = clash(states, parts);
  if (stateParts.length) {
    throw new Error(`STATES and PARTS overlap, the grammar would be undecidable: ${stateParts}`);
  }

  Object.entries(subElements).forEach(([component, names]) => {
    const bad = clash(names, states);
    if (bad.length) {
      throw new Error(`sub-elements of ${component} collide with a state name: ${bad}`);
    }
  });
};

const build = () => {
  const folders = listFolders(themeDir);
  const derived = deriveFromTokens(OVERRIDES.states);

  const parts = sortedUnique([
    ...derived.parts.filter((part) => !OVERRIDES.partExclude.includes(part)),
    ...OVERRIDES.partsAdd,
  ]).filter((part) => !OVERRIDES.partsRemove.includes(part));

  const components = {};
  folders.forEach((folder) => {
    if (OVERRIDES.systemFolders.includes(folder)) return;
    components[folder] = OVERRIDES.components[folder] ?? kebab(folder);
  });

  // component -> owning folder; explicit overrides win, otherwise the only folder mapping to it
  const declarationHome = {};
  Object.entries(components).forEach(([folder, component]) => {
    declarationHome[component] = OVERRIDES.declarationHome[component] ?? folder;
  });

  const subElements = OVERRIDES.subElements;
  assertParseable(parts, OVERRIDES.states, OVERRIDES.modifiers, subElements);

  return {
    $comment: 'GENERATED by tools/naming/derive-registries.mjs — do not edit by hand. '
      + 'Judgment calls live in OVERRIDES in that script; vocabularies are derived from '
      + 'scss/_design-system (regenerate with `pnpm nx build:tokens devextreme-scss` first).',
    parseRule: '$<component>(-<sub-element>)*(-<modifier>)*-<slot>(-<state>) — parsed right-to-left '
      + 'with longest match. Overlaps between vocabularies competing for DIFFERENT positions are '
      + 'intentional and resolved positionally; see assertParseable() in the generator for the two '
      + 'overlaps that are forbidden.',
    derivedFrom: {
      componentTokens: 'scss/_design-system/fluent/components/theme.scss',
      componentTokenCount: derived.tokenCount,
      themeFolders: folders.length,
    },
    components,
    declarationHome,
    systemFolders: OVERRIDES.systemFolders,
    systemConcerns: [...OVERRIDES.systemConcerns].sort(),
    chassis: OVERRIDES.chassis,
    themeIdentity: OVERRIDES.themeIdentity,
    exemptFolders: OVERRIDES.exemptFolders,
    parts,
    states: OVERRIDES.states,
    modifiers: OVERRIDES.modifiers,
    sizeSlots: OVERRIDES.sizeSlots,
    rejected: OVERRIDES.rejected,
    embeds: OVERRIDES.embeds,
    rejectedTrailing: OVERRIDES.rejectedTrailing,
    rejectedSpellings: OVERRIDES.rejectedSpellings,
    droppedSegments: OVERRIDES.droppedSegments,
    subElements,
    packageElementPaths: derived.packageElementPaths,
    migrated: OVERRIDES.migrated,
  };
};

const serialized = `${JSON.stringify(build(), null, 2)}\n`;

if (process.argv.includes('--check')) {
  const committed = readFileSync(output, 'utf8');
  if (committed !== serialized) {
    process.stderr.write('registries.json is stale — run node tools/naming/derive-registries.mjs\n');
    process.exit(1);
  }
  process.stdout.write('registries.json is up to date\n');
} else {
  writeFileSync(output, serialized);
  process.stdout.write(`wrote ${output}\n`);
}
